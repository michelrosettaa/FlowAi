// lib/storage.ts
export function getStoredTasks(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("flowai_tasks");
  return raw ? JSON.parse(raw) : [];
}

export function addTask(task: string) {
  if (typeof window === "undefined") return;
  const tasks = getStoredTasks();
  if (!tasks.includes(task)) {
    tasks.push(task);
    localStorage.setItem("flowai_tasks", JSON.stringify(tasks));
  }
}

export function clearTasks() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("flowai_tasks");
}
