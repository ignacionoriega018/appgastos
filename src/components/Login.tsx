import React, { useState } from 'react';
import { Wallet, ArrowRight, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (u: string, p: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(username, password)) {
      setError(false);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className={`bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 border border-slate-100 ${shaking ? 'animate-shake' : 'animate-slide-up'}`}>
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[var(--primary-600)] p-4 rounded-2xl shadow-lg mb-5 transition-transform hover:scale-110 duration-300" style={{boxShadow: '0 10px 15px -3px var(--primary-200)'}}>
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">MinimSpend</h1>
          <p className="text-slate-400 text-sm font-medium mt-2">Control seguro de gastos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Usuario</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-[var(--primary-500)] transition-colors" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all font-medium"
                placeholder="Ingresa tu usuario"
                autoCapitalize="none"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Contraseña</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[var(--primary-500)] transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all font-medium"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-rose-500 text-sm text-center font-medium bg-rose-50 py-2 rounded-lg animate-pulse">
              Credenciales incorrectas
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-[var(--primary-600)] hover:bg-[var(--primary-700)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-500)] transition-all active:scale-[0.98] mt-6"
            style={{boxShadow: '0 10px 15px -3px var(--primary-200)'}}
          >
            Ingresar
            <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
          </button>
        </form>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;