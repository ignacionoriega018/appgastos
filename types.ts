export type UserRole = 'ADMIN' | 'USER';

export type AppModule = 'EXPENSES' | 'NOTES' | 'CALENDAR';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this should be hashed
  role: UserRole;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string; // Now refers to Category.name or ID
  categoryId: string; // Link to the specific category ID
  date: string;
  timestamp: number;
}

export interface Note {
  id: string;
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