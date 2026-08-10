import { neon } from "@neondatabase/serverless";

type QueryResult<T> = { rows: T[] };
type NeonClient = ReturnType<typeof neon>;

let client: NeonClient | null = null;

function getClient(): NeonClient {
  if (!client) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error(
        "Database belum terhubung: environment variable DATABASE_URL belum diset. " +
          "Buat Postgres database lewat tab Storage di dashboard Vercel, variabel ini akan terisi otomatis."
      );
    }
    client = neon(connectionString, { fullResults: true }) as NeonClient;
  }
  return client;
}

export function sql<T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<QueryResult<T>> {
  return getClient()(strings, ...values) as unknown as Promise<QueryResult<T>>;
}

let schemaReady: Promise<void> | null = null;

async function createSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      amount NUMERIC(14, 2) NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      user_label TEXT,
      occurred_on DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS maintenance_items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('rumah', 'kendaraan')),
      notes TEXT,
      last_service_date DATE,
      next_reminder_date DATE,
      user_label TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS important_links (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT,
      notes TEXT,
      user_label TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS calendar_events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      notes TEXT,
      event_date DATE NOT NULL,
      user_label TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS todo_items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      is_done BOOLEAN NOT NULL DEFAULT false,
      user_label TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
}

// Cached across warm invocations so we don't re-run CREATE TABLE on every request.
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = createSchema().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}
