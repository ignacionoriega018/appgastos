import { Expense, Category, User, Note } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_ADMIN_USER } from '../constants';

const STORAGE_KEY_EXPENSES = 'minimspend_data_v1';
const STORAGE_KEY_CATEGORIES = 'minimspend_categories_v1';
const STORAGE_KEY_USERS = 'minimspend_users_v1';
const STORAGE_KEY_NOTES = 'minimspend_notes_v1';

// --- HELPER ---
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// --- EXPENSES ---
export const getStoredExpenses = (): Expense[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EXPENSES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading expenses', error);
    return [];
  }
};

export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses', error);
  }
};

// --- NOTES ---
export const getStoredNotes = (): Note[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_NOTES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading notes', error);
    return [];
  }
};

export const saveNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes', error);
  }
};

// --- CATEGORIES ---
export const getStoredCategories = (): Category[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (stored) return JSON.parse(stored);
    
    // Initialize defaults if empty
    saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  } catch (error) {
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories', error);
  }
};

// --- USERS ---
export const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    if (stored) return JSON.parse(stored);

    // Initialize default admin if empty
    const initialUsers = [DEFAULT_ADMIN_USER];
    saveUsers(initialUsers);
    return initialUsers;
  } catch (error) {
    return [DEFAULT_ADMIN_USER];
  }
};

export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users', error);
  }
};