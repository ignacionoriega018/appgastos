import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Expense, Category } from '../types';
import { generateId } from '../services/storageService';

interface ExpenseFormProps {
  categories: Category[];
  onAdd: (expense: Expense) => void;
  onClose: () => void;
  userId: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ categories, onAdd, onClose, userId }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId) return;

    const selectedCat = categories.find(c => c.id === categoryId);
    if (!selectedCat) return;

    const newExpense: Expense = {
      id: generateId(),
      user_id: userId,
      amount: parseFloat(amount),
      description,
      category: selectedCat.name, // Legacy support for text name
      categoryId: selectedCat.id,
      date,
      timestamp: new Date(date).getTime()
    };

    onAdd(newExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Nuevo Gasto</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Monto</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all text-lg font-medium text-slate-800"
                placeholder="0.00"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
              placeholder="Ej. Cena con amigos"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Categoría</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{boxShadow: '0 10px 15px -3px var(--primary-200)'}}
          >
            <Plus className="w-5 h-5" />
            Guardar Gasto
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;