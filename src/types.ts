export type UserRole = 'ADMIN' | 'USER';

export type AppModule = 'EXPENSES' | 'NOTES' | 'CALENDAR';

export interface Theme {
  name: string;
  colors: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  }
}

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this should be hashed
  role: UserRole;
  name: string;
}

export interface Category {
  id: string;
  user_id?: string | null; // Multi-tenancy: null = global, id = private
  name: string;
  color: string;
  isDefault?: boolean;
}

export interface Expense {
  id: string;
  user_id: string; // Multi-tenancy
  description: string;
  amount: number;
  category: string; // Now refers to Category.name or ID
  categoryId: string; // Link to the specific category ID
  date: string;
  timestamp: number;
}

export interface Note {
  id: string;
  user_id: string; // Multi-tenancy
  title: string;
  content: string;
  date: string;
  color: string; // UI Color (e.g., 'bg-yellow-100')
  timestamp: number;
}

export interface CategoryTotal {
  name: string;
  value: number;
  color: string;
}