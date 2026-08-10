export interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: string;
  category: string;
  description: string | null;
  user_label: string | null;
  occurred_on: string;
  created_at: string;
}

export interface MaintenanceItem {
  id: number;
  title: string;
  category: "rumah" | "kendaraan";
  notes: string | null;
  last_service_date: string | null;
  next_reminder_date: string | null;
  user_label: string | null;
  created_at: string;
}

export interface ImportantLink {
  id: number;
  title: string;
  url: string;
  category: string | null;
  notes: string | null;
  user_label: string | null;
  created_at: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  notes: string | null;
  event_date: string;
  user_label: string | null;
  created_at: string;
}

export interface TodoItem {
  id: number;
  title: string;
  is_done: boolean;
  user_label: string | null;
  created_at: string;
}
