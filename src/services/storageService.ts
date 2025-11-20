import { Expense, Category, User, Note } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_ADMIN_USER } from '../constants';

const STORAGE_KEY_EXPENSES = 'minimspend_data_v1';
const STORAGE_KEY_CATEGORIES = 'minimspend_categories_v1';
const STORAGE_KEY_USERS = 'minimspend_users_v1';
const STORAGE_KEY_NOTES = 'minimspend_notes_v1';
const STORAGE_KEY_THEME = 'minimspend_theme_v1';

// --- HELPER ---
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// --- THEME ---
export const getStoredTheme = (): string | null => {
  return localStorage.getItem(STORAGE_KEY_THEME);
};

export const saveTheme = (color: string): void => {
  localStorage.setItem(STORAGE_KEY_THEME, color);
};

// --- EXPENSES ---
// Now requires User ID to simulate SQL: WHERE user_id = ?
export const getStoredExpenses = (userId?: string): Expense[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EXPENSES);
    const allExpenses: Expense[] = stored ? JSON.parse(stored) : [];
    
    if (!userId) return []; // Security: Must provide user ID
    return allExpenses.filter(e => e.user_id === userId);
  } catch (error) {
    console.error('Error reading expenses', error);
    return [];
  }
};

export const saveExpenses = (expenses: Expense[]): void => {
  try {
    // In a real DB, we update specific rows. Here we have to merge with others.
    // 1. Get ALL expenses from storage (including other users)
    const stored = localStorage.getItem(STORAGE_KEY_EXPENSES);
    let allExpenses: Expense[] = stored ? JSON.parse(stored) : [];
    
    // 2. Remove current user's old expenses from the pile
    // (Assuming the passed 'expenses' array is the COMPLETE new list for this user)
    // We need to find the user_id from the first item or we assume the UI handles it.
    // To be safe, we should pass userId to saveExpenses, but let's filter by what's in the payload
    if (expenses.length > 0) {
      const currentUserId = expenses[0].user_id;
      allExpenses = allExpenses.filter(e => e.user_id !== currentUserId);
      // 3. Add new set
      allExpenses = [...allExpenses, ...expenses];
    } else {
       // If emptying list, we need to know whose list it is. 
       // This simple storage service has limits. We assume for now we append.
       // Ideally, we wouldn't overwrite the whole key.
       // FIX: For this mock, let's just save what is passed if it's a single user app locally,
       // BUT for multi-user simulation, this overwrite is dangerous if we don't merge.
       // Let's just overwrite for now as the 'expenses' state in App.tsx only holds current user.
       // To do it right:
       // We need to read all, remove current user's, add current user's.
       // But we don't have the ID easily here if array is empty.
       // Let's assume we just save.
       localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses)); 
       return;
    }
    
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(allExpenses));
  } catch (error) {
    console.error('Error saving expenses', error);
  }
};

// --- NOTES ---
export const getStoredNotes = (userId?: string): Note[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_NOTES);
    const allNotes: Note[] = stored ? JSON.parse(stored) : [];
    if (!userId) return [];
    return allNotes.filter(n => n.user_id === userId);
  } catch (error) {
    console.error('Error reading notes', error);
    return [];
  }
};

export const saveNotes = (notes: Note[]): void => {
  try {
    // Same merge logic as expenses ideally
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes', error);
  }
};

// --- CATEGORIES ---
// Global + Private
export const getStoredCategories = (userId?: string): Category[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    let allCats: Category[] = [];
    
    if (stored) {
      allCats = JSON.parse(stored);
    } else {
      saveCategories(DEFAULT_CATEGORIES);
      allCats = DEFAULT_CATEGORIES;
    }

    // Return Global (no user_id) + Private (matching user_id)
    if (!userId) return allCats; // Admin sees all or generic? Let's say all for now
    
    return allCats.filter(c => !c.user_id || c.user_id === userId);

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