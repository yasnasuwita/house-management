import { sql, ensureSchema } from "./db";
import type { Transaction, MaintenanceItem, ImportantLink, CalendarEvent, TodoItem } from "./types";

export async function getBalance(): Promise<{ income: number; expense: number; balance: number }> {
  await ensureSchema();
  const { rows } = await sql<{ income: string | null; expense: string | null }>`
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
    FROM transactions;
  `;
  const income = Number(rows[0]?.income ?? 0);
  const expense = Number(rows[0]?.expense ?? 0);
  return { income, expense, balance: income - expense };
}

export async function getTransactions(limit = 100): Promise<Transaction[]> {
  await ensureSchema();
  const { rows } = await sql<Transaction>`
    SELECT * FROM transactions ORDER BY occurred_on DESC, id DESC LIMIT ${limit};
  `;
  return rows;
}

export async function getMonthlySummary(): Promise<{
  month: string;
  income: number;
  expense: number;
  balance: number;
  byCategory: { category: string; type: string; total: number }[];
}> {
  await ensureSchema();
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().slice(0, 10);

  const { rows } = await sql<{ type: string; category: string; total: string }>`
    SELECT type, category, SUM(amount) AS total
    FROM transactions
    WHERE occurred_on >= ${start} AND occurred_on < ${end}
    GROUP BY type, category
    ORDER BY total DESC;
  `;

  let income = 0;
  let expense = 0;
  const byCategory = rows.map((r) => {
    const total = Number(r.total);
    if (r.type === "income") income += total;
    else expense += total;
    return { category: r.category, type: r.type, total };
  });

  return { month: start, income, expense, balance: income - expense, byCategory };
}

export async function getMaintenanceItems(): Promise<MaintenanceItem[]> {
  await ensureSchema();
  const { rows } = await sql<MaintenanceItem>`
    SELECT * FROM maintenance_items
    ORDER BY
      CASE WHEN next_reminder_date IS NULL THEN 1 ELSE 0 END,
      next_reminder_date ASC,
      created_at DESC;
  `;
  return rows;
}

export async function getLinks(): Promise<ImportantLink[]> {
  await ensureSchema();
  const { rows } = await sql<ImportantLink>`
    SELECT * FROM important_links ORDER BY created_at DESC;
  `;
  return rows;
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  await ensureSchema();
  const { rows } = await sql<CalendarEvent>`
    SELECT * FROM calendar_events ORDER BY event_date ASC, created_at DESC;
  `;
  return rows;
}

export async function getUpcomingReminderCount(): Promise<number> {
  await ensureSchema();
  const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const { rows } = await sql<{ count: string }>`
    SELECT COUNT(*) AS count FROM maintenance_items
    WHERE next_reminder_date IS NOT NULL AND next_reminder_date <= ${inTwoWeeks};
  `;
  return Number(rows[0]?.count ?? 0);
}

export async function getTodayEvents(): Promise<CalendarEvent[]> {
  await ensureSchema();
  const todayIso = new Date().toISOString().slice(0, 10);
  const { rows } = await sql<CalendarEvent>`
    SELECT * FROM calendar_events WHERE event_date = ${todayIso} ORDER BY created_at ASC;
  `;
  return rows;
}

export async function getTodoItems(): Promise<TodoItem[]> {
  await ensureSchema();
  const { rows } = await sql<TodoItem>`
    SELECT * FROM todo_items ORDER BY is_done ASC, created_at DESC;
  `;
  return rows;
}
