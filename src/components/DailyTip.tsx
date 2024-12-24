import React from 'react';
import { Lightbulb } from 'lucide-react';

const tips = [
  "Bebe agua antes de cada comida para mantener una buena hidratación.",
  "Intenta dormir 7-8 horas cada noche para una mejor recuperación.",
  "Incluye proteínas en cada comida para mantener tu masa muscular.",
  "Realiza ejercicios de estiramiento para mejorar tu flexibilidad.",
  "Practica la respiración profunda para reducir el estrés.",
];

export function DailyTip() {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-4 rounded-r">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-orange-800 mb-1">Consejo del día</h3>
          <p className="text-orange-700">{randomTip}</p>
        </div>
      </div>
    </div>
  );
}