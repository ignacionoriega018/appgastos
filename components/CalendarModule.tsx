import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Wallet, StickyNote, X } from 'lucide-react';
import { Expense, Note, Category } from '../types';
import { CURRENCY_FORMATTER } from '../constants';

interface CalendarModuleProps {
  expenses: Expense[];
  notes: Note[];
  categories: Category[];
}

const CalendarModule: React.FC<CalendarModuleProps> = ({ expenses, notes, categories }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayDetails, setSelectedDayDetails] = useState<{date: string, dayExpenses: Expense[], dayNotes: Note[]} | null>(null);

  // Helper: Get Category Color
  const getCategoryColor = (catName: string) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.color : '#CBD5E1';
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Generate Calendar Grid
  const calendarDays = useMemo(() => {
    const days = [];
    // Padding for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayExpenses = expenses.filter(e => e.date === dateKey);
      const dayNotes = notes.filter(n => n.date === dateKey);
      
      days.push({
        day: i,
        dateKey,
        hasExpenses: dayExpenses.length > 0,
        hasNotes: dayNotes.length > 0,
        totalSpent: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
        expenses: dayExpenses,
        notes: dayNotes
      });
    }
    return days;
  }, [year, month, expenses, notes]);

  const handleDayClick = (dayData: any) => {
    if (!dayData) return;
    setSelectedDayDetails({
      date: dayData.dateKey,
      dayExpenses: dayData.expenses,
      dayNotes: dayData.notes
    });
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Calendar Header */}
        <div className="p-6 flex justify-between items-center border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
          {weekDays.map(d => (
            <div key={d} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((day, idx) => (
            <div 
              key={idx} 
              onClick={() => handleDayClick(day)}
              className={`
                min-h-[100px] p-2 border-b border-r border-slate-50 relative transition-all
                ${!day ? 'bg-slate-50/30' : 'hover:bg-indigo-50/30 cursor-pointer group'}
                ${day?.dateKey === new Date().toISOString().split('T')[0] ? 'bg-indigo-50/50' : ''}
              `}
            >
              {day && (
                <>
                  <span className={`
                    text-sm font-medium inline-flex w-7 h-7 items-center justify-center rounded-full
                    ${day.dateKey === new Date().toISOString().split('T')[0] ? 'bg-indigo-600 text-white' : 'text-slate-700'}
                  `}>
                    {day.day}
                  </span>
                  
                  <div className="flex flex-col gap-1 mt-2">
                    {day.hasExpenses && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium bg-white border border-slate-100 rounded px-1.5 py-0.5 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        {CURRENCY_FORMATTER.format(day.totalSpent)}
                      </div>
                    )}
                    {day.hasNotes && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-yellow-50 border border-yellow-100 rounded px-1.5 py-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                        {day.notes.length} nota{day.notes.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDayDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[80vh] animate-slide-up">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Resumen del Día</h3>
                <p className="text-sm text-slate-500 capitalize">
                  {new Date(selectedDayDetails.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <button onClick={() => setSelectedDayDetails(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6">
              {/* Expenses Section */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
                  <Wallet className="w-4 h-4" />
                  Gastos ({selectedDayDetails.dayExpenses.length})
                </h4>
                {selectedDayDetails.dayExpenses.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDayDetails.dayExpenses.map(e => (
                      <div key={e.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                         <div className="flex items-center gap-3">
                           <div 
                             className="w-2 h-8 rounded-full" 
                             style={{ backgroundColor: getCategoryColor(e.category) }} 
                           />
                           <div>
                             <p className="font-medium text-slate-800 text-sm">{e.description}</p>
                             <p className="text-xs text-slate-500">{e.category}</p>
                           </div>
                         </div>
                         <span className="font-bold text-slate-700 text-sm">{CURRENCY_FORMATTER.format(e.amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No hay gastos registrados este día.</p>
                )}
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Notes Section */}
              <div>
                <h4 className="flex items-center gap-2 text-xs font-bold text-yellow-600 uppercase tracking-wider mb-3">
                  <StickyNote className="w-4 h-4" />
                  Anotaciones ({selectedDayDetails.dayNotes.length})
                </h4>
                {selectedDayDetails.dayNotes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDayDetails.dayNotes.map(n => (
                      <div key={n.id} className={`p-3 rounded-xl border text-sm ${n.color}`}>
                        <p className="font-bold mb-1">{n.title}</p>
                        <p className="opacity-90 text-xs">{n.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No hay notas para este día.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarModule;