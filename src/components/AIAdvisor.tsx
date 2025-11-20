import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { Expense } from '../types';
import { analyzeExpenses } from '../services/geminiService';

interface AIAdvisorProps {
  expenses: Expense[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ expenses }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAnalyze = async () => {
    if (expenses.length === 0) return;
    
    setLoading(true);
    setIsOpen(true);
    
    try {
      const result = await analyzeExpenses(expenses);
      setAdvice(result);
    } catch (e) {
      setAdvice("Error al generar consejo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] rounded-2xl shadow-lg p-6 text-white mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Asistente IA
            </h2>
            <p className="text-indigo-100 text-sm mt-1 opacity-90">
              Obtén consejos personalizados para optimizar tu presupuesto.
            </p>
          </div>
          {!isOpen && (
             <button 
             onClick={handleAnalyze}
             disabled={expenses.length === 0}
             className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Analizar
             <ChevronRight className="w-4 h-4" />
           </button>
          )}
        </div>

        {isOpen && (
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 min-h-[100px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-32 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-200" />
                <span className="text-sm font-medium text-indigo-200">Analizando tus finanzas...</span>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                 <div className="whitespace-pre-wrap text-sm leading-relaxed text-indigo-50">
                    {advice}
                 </div>
              </div>
            )}
            
            {!loading && (
               <button 
               onClick={() => setIsOpen(false)}
               className="mt-4 text-xs font-semibold text-indigo-200 hover:text-white uppercase tracking-wider"
             >
               Cerrar Análisis
             </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;