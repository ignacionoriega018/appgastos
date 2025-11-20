import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, X, StickyNote, Calendar } from 'lucide-react';
import { Note } from '../types';
import { generateId } from '../services/storageService';

interface NotesModuleProps {
  notes: Note[];
  onAdd: (note: Note) => void;
  onDelete: (id: string) => void;
  userId: string;
}

const NOTE_COLORS = [
  'bg-yellow-100 border-yellow-200 text-yellow-900',
  'bg-green-100 border-green-200 text-green-900',
  'bg-blue-100 border-blue-200 text-blue-900',
  'bg-purple-100 border-purple-200 text-purple-900',
  'bg-rose-100 border-rose-200 text-rose-900',
  'bg-slate-100 border-slate-200 text-slate-900',
];

const NotesModule: React.FC<NotesModuleProps> = ({ notes, onAdd, onDelete, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !content) return;

    const newNote: Note = {
      id: generateId(),
      user_id: userId,
      title: title || 'Sin título',
      content,
      date: new Date().toISOString().split('T')[0],
      color: selectedColor,
      timestamp: Date.now()
    };

    onAdd(newNote);
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedColor(NOTE_COLORS[0]);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar en mis notas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] shadow-sm"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
          style={{boxShadow: '0 10px 15px -3px var(--primary-200)'}}
        >
          <Plus className="w-5 h-5" />
          Nueva Nota
        </button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <StickyNote className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Bloc de Notas Vacío</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">Guarda ideas, listas de compras o recordatorios rápidos aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div key={note.id} className={`relative group p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md ${note.color}`}>
              <div className="flex justify-between items-start mb-3">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
                  <Calendar className="w-3 h-3" />
                  {note.date}
                </span>
                <button 
                  onClick={() => onDelete(note.id)}
                  className="p-1.5 rounded-full hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity text-current"
                  title="Borrar nota"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-lg mb-2 leading-tight">{note.title}</h3>
              <p className="text-sm whitespace-pre-wrap opacity-90 leading-relaxed">{note.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col animate-slide-up overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Crear Nota</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input 
                type="text" 
                placeholder="Título de la nota" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl font-bold text-slate-800 placeholder-slate-300 focus:outline-none"
                autoFocus
              />
              <textarea 
                placeholder="Escribe tus ideas aquí..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-40 resize-none text-slate-600 placeholder-slate-300 focus:outline-none text-base leading-relaxed"
              />
              
              <div className="flex flex-wrap gap-3 pt-2">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color.split(' ')[0]} ${selectedColor === color ? 'border-slate-600 scale-110 shadow-sm' : 'border-transparent'}`}
                  />
                ))}
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-[0.98]"
                  style={{boxShadow: '0 10px 15px -3px var(--primary-200)'}}
                >
                  Guardar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesModule;