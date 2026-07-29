export type Term = "anual" | "mensual" | "semanal";
export type GoalStatus = "activo" | "completado" | "pausado";
export type Priority = "alta" | "media" | "baja";
export type Mood = "genial" | "bien" | "normal" | "mal" | "terrible";
export type TransactionType = "ingreso" | "gasto" | "ahorro";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  term: Term;
  target_value: number;
  current_value: number;
  color: string;
  due_date: string | null;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  frequency: "diario" | "semanal";
  target_days_per_week: number;
  archived: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_on: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  mood: Mood;
  content: string | null;
  learnings: string | null;
  gratitude: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  priority: Priority;
  due_date: string | null;
  due_time: string | null;
  completed: boolean;
  reminder: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string | null;
  occurred_on: string;
  created_at: string;
}

export interface FinancialGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  due_date: string | null;
  created_at: string;
}
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile>; Relationships: [] };
      goals: { Row: Goal; Insert: Partial<Goal>; Update: Partial<Goal>; Relationships: [] };
      habits: { Row: Habit; Insert: Partial<Habit>; Update: Partial<Habit>; Relationships: [] };
      habit_logs: { Row: HabitLog; Insert: Partial<HabitLog>; Update: Partial<HabitLog>; Relationships: [] };
      journal_entries: {
        Row: JournalEntry;
        Insert: Partial<JournalEntry>;
        Update: Partial<JournalEntry>;
        Relationships: [];
      };
      tasks: { Row: Task; Insert: Partial<Task>; Update: Partial<Task>; Relationships: [] };
      transactions: {
        Row: Transaction;
        Insert: Partial<Transaction>;
        Update: Partial<Transaction>;
        Relationships: [];
      };
      financial_goals: {
        Row: FinancialGoal;
        Insert: Partial<FinancialGoal>;
        Update: Partial<FinancialGoal>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
