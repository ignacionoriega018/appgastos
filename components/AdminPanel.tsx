import React, { useState } from 'react';
import { X, Users, Tags, Plus, Trash2, Shield, Check } from 'lucide-react';
import { User, Category, UserRole } from '../types';
import { generateId } from '../services/storageService';
import { COLOR_PALETTE } from '../constants';

interface AdminPanelProps {
  users: User[];
  categories: Category[];
  onSaveUsers: (users: User[]) => void;
  onSaveCategories: (categories: Category[]) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, categories, onSaveUsers, onSaveCategories, onClose }) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'users'>('categories');

  // Category State
  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);

  // User State
  const [newUserUser, setNewUserUser] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('USER');

  // HANDLERS CATEGORIES
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    const newCat: Category = {
      id: generateId(),
      name: newCatName,
      color: selectedColor,
      isDefault: false
    };
    onSaveCategories([...categories, newCat]);
    setNewCatName('');
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('¿Borrar categoría?')) {
      onSaveCategories(categories.filter(c => c.id !== id));
    }
  };

  // HANDLERS USERS
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserUser || !newUserPass || !newUserName) return;
    
    // Simple check duplicate
    if (users.find(u => u.username.toLowerCase() === newUserUser.toLowerCase())) {
      alert('El usuario ya existe');
      return;
    }

    const newUser: User = {
      id: generateId(),
      username: newUserUser,
      password: newUserPass,
      name: newUserName,
      role: newUserRole
    };
    onSaveUsers([...users, newUser]);
    setNewUserUser('');
    setNewUserPass('');
    setNewUserName('');
    setNewUserRole('USER');
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) {
      alert("No puedes borrar el último usuario");
      return;
    }
    if (window.confirm('¿Borrar usuario?')) {
      onSaveUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Panel de Administración</h2>
            <p className="text-sm text-slate-500">Gestiona datos maestros del sistema</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'categories' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Tags className="w-4 h-4" />
            Categorías
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'users' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Users className="w-4 h-4" />
            Usuarios
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          
          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nueva Categoría</h3>
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      placeholder="Nombre de categoría" 
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PALETTE.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${selectedColor === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 {categories.map((cat) => (
                   <div key={cat.id} className="p-3 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: cat.color }}>
                          {cat.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                      </div>
                      {!cat.isDefault && (
                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-300 hover:text-rose-500 p-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
             <div className="space-y-6">
               {/* Add User Form */}
               <form onSubmit={handleAddUser} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nuevo Usuario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <input 
                      type="text" 
                      placeholder="Nombre Real (ej. Nacho)" 
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <select 
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="USER">Usuario</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Usuario Login" 
                      value={newUserUser}
                      onChange={(e) => setNewUserUser(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                     <input 
                      type="password" 
                      placeholder="Contraseña" 
                      value={newUserPass}
                      onChange={(e) => setNewUserPass(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex justify-center items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Crear Usuario
                  </button>
               </form>

               {/* List */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 {users.map((u) => (
                   <div key={u.id} className="p-3 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${u.role === 'ADMIN' ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{u.name} <span className="text-xs text-slate-400">(@{u.username})</span></p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            {u.role === 'ADMIN' ? <Shield className="w-3 h-3 text-indigo-500" /> : null}
                            {u.role}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteUser(u.id)} className="text-slate-300 hover:text-rose-500 p-2">
                          <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                 ))}
              </div>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
