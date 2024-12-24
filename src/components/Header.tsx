import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Moon, Utensils, Heart, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/auth';

export function Header() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <Heart className="w-8 h-8" />
            <span>Amigo</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/ejercicio" className="flex items-center gap-2 hover:text-orange-200 transition-colors">
              <Activity className="w-5 h-5" />
              <span>Ejercicio</span>
            </Link>
            <Link to="/nutricion" className="flex items-center gap-2 hover:text-orange-200 transition-colors">
              <Utensils className="w-5 h-5" />
              <span>Nutrición</span>
            </Link>
            <Link to="/estado" className="flex items-center gap-2 hover:text-orange-200 transition-colors">
              <Moon className="w-5 h-5" />
              <span>Estado</span>
            </Link>
            {user ? (
              <>
                <Link 
                  to="/perfil" 
                  className="flex items-center gap-2 hover:text-orange-200 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Perfil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:text-orange-200 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}