import React from 'react';
import { Trash2, Calendar, Tag } from 'lucide-react';
import { Expense, Category } from '../types';
import { CURRENCY_FORMATTER } from '../constants';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, categories, onDelete }) => {
  
  const getCategoryColor = (catName: string) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.color : '#CBD5E1';
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Sin movimientos</h3>
        <p className="text-slate-500 text-sm mt-1">Empieza añadiendo tu primer gasto.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Movimientos Recientes</h3>
        <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
          {expenses.length} registros
        </span>
      </div>
      <div className="divide-y divide-slate-50">
        {expenses.map((expense) => (
          <div key={expense.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm shrink-0"
                style={{ backgroundColor: getCategoryColor(expense.category) }}
              >
                {expense.category.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm md:text-base">{expense.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {expense.date}
                  </span>
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide font-medium text-slate-600">
                    {expense.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-800 text-sm md:text-base">
                {CURRENCY_FORMATTER.format(expense.amount)}
              </span>
              <button 
                onClick={() => onDelete(expense.id)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Eliminar gasto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;