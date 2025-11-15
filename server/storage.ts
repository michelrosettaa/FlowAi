import {
  users,
  tasks,
  userPreferences,
  calendarEvents,
  subscriptionPlans,
  userSubscriptions,
  usageRecords,
  emailAccounts,
  type User,
  type UpsertUser,
  type Task,
  type InsertTask,
  type UserPreferences,
  type InsertUserPreferences,
  type CalendarEvent,
  type InsertCalendarEvent,
  type SubscriptionPlan,
  type UserSubscription,
  type InsertUserSubscription,
  type UsageRecord,
  type InsertUsageRecord,
  type EmailAccount,
  type InsertEmailAccount,
} from "../lib/db/schema";
import { db } from "./db";
import { eq, or, and, gte, lte, desc, sql } from "drizzle-orm";

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
  
  getEmailAccounts(userId: string): Promise<EmailAccount[]>;
  getPrimaryEmailAccount(userId: string): Promise<EmailAccount | undefined>;
  createEmailAccount(account: InsertEmailAccount): Promise<EmailAccount>;
  deleteEmailAccount(id: string, userId: string): Promise<boolean>;
  
  getAllPlans(): Promise<SubscriptionPlan[]>;
  getPlanBySlug(slug: string): Promise<SubscriptionPlan | undefined>;
  getPlanById(id: string): Promise<SubscriptionPlan | undefined>;
  
  getUserSubscription(userId: string): Promise<(UserSubscription & { plan: SubscriptionPlan }) | undefined>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscription(userId: string, updates: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined>;
  
  getUsageForPeriod(userId: string, feature: "ai_messages" | "email_sends" | "calendar_sync" | "tasks", periodStart: Date, periodEnd: Date): Promise<UsageRecord | undefined>;
  incrementUsage(userId: string, feature: "ai_messages" | "email_sends" | "calendar_sync" | "tasks", amount?: number): Promise<UsageRecord>;
  getCurrentUsage(userId: string): Promise<{ ai_messages: number; email_sends: number; calendar_sync: number; tasks: number }>;
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
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    
    return updatedTask;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    
    return result.length > 0;
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
    const result = await db
      .delete(calendarEvents)
      .where(
        and(
          eq(calendarEvents.id, id),
          or(
            eq(calendarEvents.userId, userIdOrSessionId),
            eq(calendarEvents.sessionId, userIdOrSessionId)
          )
        )
      )
      .returning();
    
    return result.length > 0;
  }

  async getEmailAccounts(userId: string): Promise<EmailAccount[]> {
    return await db.select().from(emailAccounts).where(eq(emailAccounts.userId, userId));
  }

  async getPrimaryEmailAccount(userId: string): Promise<EmailAccount | undefined> {
    const [account] = await db
      .select()
      .from(emailAccounts)
      .where(and(eq(emailAccounts.userId, userId), eq(emailAccounts.isPrimary, true)))
      .limit(1);
    return account;
  }

  async createEmailAccount(accountData: InsertEmailAccount): Promise<EmailAccount> {
    const [account] = await db.insert(emailAccounts).values(accountData).returning();
    return account;
  }

  async deleteEmailAccount(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(emailAccounts)
      .where(and(eq(emailAccounts.id, id), eq(emailAccounts.userId, userId)))
      .returning();
    
    return result.length > 0;
  }

  async getAllPlans(): Promise<SubscriptionPlan[]> {
    return await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.isActive, true))
      .orderBy(subscriptionPlans.sortOrder);
  }

  async getPlanBySlug(slug: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.slug, slug))
      .limit(1);
    return plan;
  }

  async getPlanById(id: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, id))
      .limit(1);
    return plan;
  }

  async getUserSubscription(userId: string): Promise<(UserSubscription & { plan: SubscriptionPlan }) | undefined> {
    const result = await db
      .select()
      .from(userSubscriptions)
      .leftJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
      .where(eq(userSubscriptions.userId, userId))
      .limit(1);

    if (!result[0] || !result[0].subscription_plans) {
      return undefined;
    }

    return {
      ...result[0].user_subscriptions,
      plan: result[0].subscription_plans,
    };
  }

  async createUserSubscription(subscriptionData: InsertUserSubscription): Promise<UserSubscription> {
    const [subscription] = await db
      .insert(userSubscriptions)
      .values(subscriptionData)
      .onConflictDoUpdate({
        target: userSubscriptions.userId,
        set: {
          ...subscriptionData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return subscription;
  }

  async updateUserSubscription(userId: string, updates: Partial<InsertUserSubscription>): Promise<UserSubscription | undefined> {
    const [updated] = await db
      .update(userSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userSubscriptions.userId, userId))
      .returning();
    return updated;
  }

  async getUsageForPeriod(
    userId: string,
    feature: "ai_messages" | "email_sends" | "calendar_sync" | "tasks",
    periodStart: Date,
    periodEnd: Date
  ): Promise<UsageRecord | undefined> {
    const [usage] = await db
      .select()
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.userId, userId),
          eq(usageRecords.feature, feature),
          eq(usageRecords.periodStart, periodStart)
        )
      )
      .limit(1);
    return usage;
  }

  async incrementUsage(userId: string, feature: "ai_messages" | "email_sends" | "calendar_sync" | "tasks", amount: number = 1): Promise<UsageRecord> {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [record] = await db
      .insert(usageRecords)
      .values({
        userId,
        feature,
        count: amount,
        periodStart,
        periodEnd,
        lastIncrementAt: now,
      })
      .onConflictDoUpdate({
        target: [usageRecords.userId, usageRecords.feature, usageRecords.periodStart],
        set: {
          count: sql`${usageRecords.count} + ${amount}`,
          lastIncrementAt: now,
          updatedAt: now,
        },
      })
      .returning();
    return record;
  }

  async getCurrentUsage(userId: string): Promise<{ ai_messages: number; email_sends: number; calendar_sync: number; tasks: number }> {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const usage = await db
      .select()
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.userId, userId),
          eq(usageRecords.periodStart, periodStart)
        )
      );

    return {
      ai_messages: usage.find((u) => u.feature === "ai_messages")?.count || 0,
      email_sends: usage.find((u) => u.feature === "email_sends")?.count || 0,
      calendar_sync: usage.find((u) => u.feature === "calendar_sync")?.count || 0,
      tasks: usage.find((u) => u.feature === "tasks")?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
