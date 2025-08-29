export type DBEntryRow = {
  id: string;
  entry_date: string;
  text: string;
  started_at: string;
  submitted_at: string;
};

export type ApiEntry = {
  id: string;
  date: string;
  text: string;
  startedAt: string;
  submittedAt: string;
};

export function mapEntryRow(row: DBEntryRow): ApiEntry {
  return {
    id: row.id,
    date: row.entry_date,
    text: row.text,
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
  };
}

