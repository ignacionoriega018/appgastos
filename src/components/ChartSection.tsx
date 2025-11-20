import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Expense, CategoryTotal, Category } from '../types';

interface ChartSectionProps {
  expenses: Expense[];
  categories: Category[];
  themeColor: string;
}

const ChartSection: React.FC<ChartSectionProps> = ({ expenses, categories, themeColor }) => {
  
  // Helper to get color safely
  const getCategoryColor = (catName: string) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.color : '#CBD5E1';
  };

  // Calculate Category Data (Pie Chart)
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(totals)
      .map(([name, value]) => ({
        name,
        value,
        color: getCategoryColor(name)
      }))
      .sort((a, b) => b.value - a.value) as CategoryTotal[];
  }, [expenses, categories]);

  // Calculate Last 7 Days Data (Bar Chart)
  const dailyData = useMemo(() => {
    const today = new Date();
    const last7Days = [];
    const totalsByDate: Record<string, number> = {};

    // Initialize logic to get dates
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const displayDate = `${d.getDate()}/${d.getMonth() + 1}`;
      
      last7Days.push({ 
        key: dateKey, 
        display: displayDate,
        amount: 0 
      });
      totalsByDate[dateKey] = 0;
    }

    // Sum expenses
    expenses.forEach(expense => {
      if (totalsByDate.hasOwnProperty(expense.date)) {
        totalsByDate[expense.date] += expense.amount;
      }
    });

    return last7Days.map(day => ({
      name: day.display,
      amount: totalsByDate[day.key],
      fullDate: day.key
    }));
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-100">
        <p>No hay datos suficientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Last 7 Days Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Gastos: Últimos 7 días</h3>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#64748B'}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#64748B'}} 
              />
              <Tooltip 
                cursor={{fill: '#F1F5F9'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Gasto']}
              />
              <Bar dataKey="amount" fill={themeColor} radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Distribución de Gastos</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Monto']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {categoryData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Bar Chart (Category) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hidden md:block">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Gastos por Categoría</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 11, fill: '#64748B'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#F1F5F9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                   {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;