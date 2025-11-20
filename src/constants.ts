import { Category, User } from './types';

export const COLOR_PALETTE = [
  '#F87171', // Red 400
  '#60A5FA', // Blue 400
  '#34D399', // Emerald 400
  '#A78BFA', // Violet 400
  '#F472B6', // Pink 400
  '#FBBF24', // Amber 400
  '#9CA3AF', // Gray 400
  '#FB923C', // Orange 400
  '#22D3EE', // Cyan 400
  '#E879F9', // Fuchsia 400
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Alimentación', color: '#F87171', isDefault: true, user_id: null },
  { id: 'cat_2', name: 'Transporte', color: '#60A5FA', isDefault: true, user_id: null },
  { id: 'cat_3', name: 'Vivienda', color: '#34D399', isDefault: true, user_id: null },
  { id: 'cat_4', name: 'Entretenimiento', color: '#A78BFA', isDefault: true, user_id: null },
  { id: 'cat_5', name: 'Salud', color: '#F472B6', isDefault: true, user_id: null },
  { id: 'cat_6', name: 'Compras', color: '#FBBF24', isDefault: true, user_id: null },
  { id: 'cat_7', name: 'Otros', color: '#9CA3AF', isDefault: true, user_id: null },
];

// Initial admin user
export const DEFAULT_ADMIN_USER: User = {
  id: 'user_admin_1',
  username: 'nacho',
  password: '41221374', // Hardcoded as requested
  name: 'Nacho',
  role: 'ADMIN'
};

export const CURRENCY_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});