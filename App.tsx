import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Wallet, LogOut, CheckCircle2, Download, Settings, StickyNote, Calendar as CalendarIcon, LayoutDashboard, Search } from 'lucide-react';
import { Expense, User, Category, Note, AppModule } from './types';
import { getStoredExpenses, saveExpenses, getStoredUsers, saveUsers, getStoredCategories, saveCategories, getStoredNotes, saveNotes } from './services/storageService';
import { CURRENCY_FORMATTER } from './constants';
import ChartSection from './components/ChartSection';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import AIAdvisor from './components/AIAdvisor';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import NotesModule from './components/NotesModule';
import CalendarModule from './components/CalendarModule';

// Toast Component
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        {message}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentModule, setCurrentModule] = useState<AppModule>('EXPENSES');
  
  // Data State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Check authentication on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('minimspend_user_session');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    // Initial Data Load (Masters)
    setUsers(getStoredUsers());
    setCategories(getStoredCategories());
  }, []);

  // PWA Install Prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Load User Data when Authenticated
  useEffect(() => {
    if (currentUser) {
      setExpenses(getStoredExpenses());
      setNotes(getStoredNotes());
      setIsLoaded(true);
    }
  }, [currentUser]);

  // Persist Data Changes
  useEffect(() => { if (isLoaded && currentUser) saveExpenses(expenses); }, [expenses, isLoaded, currentUser]);
  useEffect(() => { if (isLoaded) saveCategories(categories); }, [categories, isLoaded]);
  useEffect(() => { if (isLoaded) saveUsers(users); }, [users, isLoaded]);
  useEffect(() => { if (isLoaded && currentUser) saveNotes(notes); }, [notes, isLoaded, currentUser]);

  const handleLogin = (u: string, p: string) => {
    const foundUser = users.find(user => user.username.toLowerCase() === u.toLowerCase() && user.password === p);
    if (foundUser) {
      sessionStorage.setItem('minimspend_user_session', JSON.stringify(foundUser));
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('minimspend_user_session');
    setCurrentUser(null);
    setIsLoaded(false);
    setCurrentModule('EXPENSES');
  };

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  const showToast = (msg: string) => setToastMessage(msg);

  // Actions
  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
    showToast("Gasto guardado");
  };

  const deleteExpense = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
      showToast("Gasto eliminado");
    }
  };

  const addNote = (note: Note) => {
    setNotes(prev => [note, ...prev]);
    showToast("Nota guardada");
  };

  const deleteNote = (id: string) => {
    if (window.confirm('¿Borrar nota?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
      showToast("Nota eliminada");
    }
  };

  const totalSpent = useMemo(() => expenses.reduce((acc, curr) => acc + curr.amount, 0), [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => 
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expenses, searchTerm]);

  if (!currentUser) return <Login onLogin={handleLogin} />;

  const NavItem = ({ module, icon: Icon, label }: { module: AppModule, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentModule(module)}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
        currentModule === module 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const MobileNavItem = ({ module, icon: Icon, label }: { module: AppModule, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentModule(module)}
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
        currentModule === module ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'
      }`}
    >
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 animate-fade-in flex flex-col md:flex-row">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800 leading-none">MinimSpend</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Hola, {currentUser.name}</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem module="EXPENSES" icon={LayoutDashboard} label="Gastos" />
          <NavItem module="NOTES" icon={StickyNote} label="Anotaciones" />
          <NavItem module="CALENDAR" icon={CalendarIcon} label="Calendario" />
        </nav>

        <div className="space-y-3 border-t border-slate-100 pt-6">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Mes</p>
            <p className="text-xl font-bold text-slate-900">{CURRENCY_FORMATTER.format(totalSpent)}</p>
          </div>

          {currentUser.role === 'ADMIN' && (
            <button onClick={() => setIsAdminOpen(true)} className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors text-sm font-medium">
              <Settings className="w-5 h-5" /> Administrar
            </button>
          )}
           {installPrompt && (
             <button onClick={handleInstallClick} className="flex items-center gap-3 w-full p-3 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors text-sm font-medium">
               <Download className="w-5 h-5" /> Instalar App
             </button>
           )}
           <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors text-sm font-medium">
              <LogOut className="w-5 h-5" /> Cerrar Sesión
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-10 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
             <div className="bg-indigo-600 p-2 rounded-lg">
               <Wallet className="w-5 h-5 text-white" />
             </div>
             <h1 className="font-bold text-lg text-slate-800">MinimSpend</h1>
          </div>
          <div className="flex gap-2">
            {currentUser.role === 'ADMIN' && <button onClick={() => setIsAdminOpen(true)} className="p-2 bg-white rounded-full shadow-sm"><Settings className="w-5 h-5 text-slate-500"/></button>}
            <button onClick={handleLogout} className="p-2 bg-white rounded-full shadow-sm"><LogOut className="w-5 h-5 text-slate-400"/></button>
          </div>
        </div>

        {/* MODULE: EXPENSES */}
        {currentModule === 'EXPENSES' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8">
               <div>
                 <h2 className="text-2xl font-bold text-slate-900">Panel de Gastos</h2>
                 <p className="text-slate-500">Resumen de tu actividad financiera.</p>
               </div>
               <button 
                  onClick={() => setIsFormOpen(true)}
                  className="hidden md:flex bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-5 rounded-xl font-semibold transition-all items-center gap-2 shadow-lg shadow-slate-200"
                >
                  <Plus className="w-5 h-5" /> Añadir Gasto
                </button>
            </div>

            <div className="md:hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <p className="text-sm text-slate-500 font-medium mb-1">Gasto Total</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{CURRENCY_FORMATTER.format(totalSpent)}</p>
            </div>

            <AIAdvisor expenses={expenses} />
            <ChartSection expenses={expenses} categories={categories} />
            
            {/* Search & List */}
            <div className="mt-8 space-y-4">
               <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar descripción o categoría..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  />
               </div>
               <ExpenseList expenses={filteredExpenses} categories={categories} onDelete={deleteExpense} />
            </div>
          </div>
        )}

        {/* MODULE: NOTES */}
        {currentModule === 'NOTES' && (
          <div>
             <div className="mb-8">
                 <h2 className="text-2xl font-bold text-slate-900">Mis Anotaciones</h2>
                 <p className="text-slate-500">Ideas, recordatorios y listas.</p>
             </div>
             <NotesModule notes={notes} onAdd={addNote} onDelete={deleteNote} />
          </div>
        )}

        {/* MODULE: CALENDAR */}
        {currentModule === 'CALENDAR' && (
           <div>
              <div className="mb-8">
                 <h2 className="text-2xl font-bold text-slate-900">Calendario</h2>
                 <p className="text-slate-500">Visualiza tu actividad mensual.</p>
              </div>
              <CalendarModule expenses={expenses} notes={notes} categories={categories} />
           </div>
        )}
      </main>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-40 safe-area-pb">
        <MobileNavItem module="EXPENSES" icon={LayoutDashboard} label="Gastos" />
        <MobileNavItem module="NOTES" icon={StickyNote} label="Notas" />
        <MobileNavItem module="CALENDAR" icon={CalendarIcon} label="Agenda" />
      </div>

      {/* Mobile Floating Add Button (Only on Expenses tab) */}
      {currentModule === 'EXPENSES' && (
        <button 
          onClick={() => setIsFormOpen(true)}
          className="md:hidden fixed bottom-24 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-xl shadow-indigo-300 z-30 active:scale-90 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Add Expense Modal */}
      {isFormOpen && (
        <ExpenseForm categories={categories} onAdd={addExpense} onClose={() => setIsFormOpen(false)} />
      )}

      {/* Admin Panel */}
      {isAdminOpen && currentUser.role === 'ADMIN' && (
        <AdminPanel 
          users={users} 
          categories={categories} 
          onSaveUsers={(u) => { setUsers(u); showToast("Usuarios actualizados"); }} 
          onSaveCategories={(c) => { setCategories(c); showToast("Categorías actualizadas"); }} 
          onClose={() => setIsAdminOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;