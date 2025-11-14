import {
  users,
  tasks,
  userPreferences,
  calendarEvents,
  type User,
  type UpsertUser,
  type Task,
  type InsertTask,
  type UserPreferences,
  type InsertUserPreferences,
  type CalendarEvent,
  type InsertCalendarEvent,
} from "../lib/db/schema";
import { db } from "./db";
import { eq, or, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User | undefined>;
  
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<boolean>;
  
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences>;
  
  getCalendarEvents(userIdOrSessionId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]>;
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  deleteCalendarEvent(id: string, userIdOrSessionId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getTasks(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: string, userId: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    
    if (updatedTask && updatedTask.userId !== userId) {
      return undefined;
    }
    
    return updatedTask;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const task = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    
    if (!task[0] || task[0].userId !== userId) {
      return false;
    }
    
    await db.delete(tasks).where(eq(tasks.id, id));
    return true;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return prefs;
  }

  async upsertUserPreferences(prefsData: InsertUserPreferences): Promise<UserPreferences> {
    const [prefs] = await db
      .insert(userPreferences)
      .values(prefsData)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          preferences: prefsData.preferences,
          updatedAt: new Date(),
        },
      })
      .returning();
    return prefs;
  }

  async getCalendarEvents(
    userIdOrSessionId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<CalendarEvent[]> {
    // Build predicates correctly to avoid overwriting user/session filter
    const userFilter = or(
      eq(calendarEvents.userId, userIdOrSessionId),
      eq(calendarEvents.sessionId, userIdOrSessionId)
    );

    if (startDate && endDate) {
      return await db
        .select()
        .from(calendarEvents)
        .where(
          and(
            userFilter,
            gte(calendarEvents.startDate, startDate),
            lte(calendarEvents.endDate, endDate)
          )
        );
    }

    return await db
      .select()
      .from(calendarEvents)
      .where(userFilter);
  }

  async createCalendarEvent(eventData: InsertCalendarEvent): Promise<CalendarEvent> {
    const [event] = await db
      .insert(calendarEvents)
      .values(eventData)
      .returning();
    return event;
  }

  async deleteCalendarEvent(id: string, userIdOrSessionId: string): Promise<boolean> {
    const event = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.id, id))
      .limit(1);

    if (
      !event[0] ||
      (event[0].userId !== userIdOrSessionId && event[0].sessionId !== userIdOrSessionId)
    ) {
      return false;
    }

    await db.delete(calendarEvents).where(eq(calendarEvents.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
