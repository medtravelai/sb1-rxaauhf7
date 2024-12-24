import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export function WelcomeScreen() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4">
      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <Heart className="w-16 h-16 text-orange-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ¡Bienvenido a Amigo!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu compañero personal para una vida más saludable. Registra tu actividad física,
          nutrición y bienestar en un solo lugar.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/registro"
            className="btn btn-primary flex items-center justify-center gap-2 text-lg px-8 py-3"
          >
            Crear Cuenta
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="btn btn-secondary flex items-center justify-center gap-2 text-lg px-8 py-3"
          >
            Iniciar Sesión
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <Activity className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Seguimiento de Ejercicios</h3>
            <p className="text-gray-600">Registra tus actividades físicas y mantén un estilo de vida activo.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <Utensils className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Control Nutricional</h3>
            <p className="text-gray-600">Mantén un registro de tu alimentación y mejora tus hábitos.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <Moon className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Bienestar Mental</h3>
            <p className="text-gray-600">Monitorea tu estado de ánimo y calidad de sueño.</p>
          </div>
        </div>
      </div>
    </div>
  );
}