import React, { useState, useEffect } from 'react';
import { Utensils, Scan, Calculator, Calendar, Book, Plus, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { logMeal, getMealPlans } from '../lib/api';

interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealPlan {
  id: string;
  title: string;
  description: string;
  meals: {
    name: string;
    items: FoodItem[];
  }[];
}

interface NutritionLog {
  meal_type: string;
  food_items: FoodItem[];
  total_calories: number;
}

export const Nutrition: React.FC = () => {
  const [activeTab, setActiveTab] = useState('database');
  const [searchTerm, setSearchTerm] = useState('');
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [mealType, setMealType] = useState('desayuno');

  const popularFoods: FoodItem[] = [
    {
      name: "Frijoles Negros",
      portion: "1 taza (172g)",
      calories: 227,
      protein: 15,
      carbs: 41,
      fat: 1
    },
    {
      name: "Arroz Integral",
      portion: "1 taza (195g)",
      calories: 216,
      protein: 5,
      carbs: 45,
      fat: 2
    },
    {
      name: "Aguacate",
      portion: "medio (100g)",
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15
    },
    {
      name: "Plátano",
      portion: "1 unidad (118g)",
      calories: 105,
      protein: 1,
      carbs: 27,
      fat: 0
    },
    {
      name: "Tortilla de Maíz",
      portion: "1 unidad (30g)",
      calories: 70,
      protein: 2,
      carbs: 15,
      fat: 1
    }
  ];

  useEffect(() => {
    const loadMealPlans = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const plans = await getMealPlans(user.id);
          setMealPlans(plans);
        }
      } catch (error) {
        console.error('Error loading meal plans:', error);
      }
    };

    loadMealPlans();
  }, []);

  const filteredFoods = popularFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFoodToMeal = (food: FoodItem) => {
    setSelectedFoods(prev => [...prev, food]);
  };

  const removeFoodFromMeal = (index: number) => {
    setSelectedFoods(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotalNutrition = () => {
    return selectedFoods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const logCurrentMeal = async () => {
    if (selectedFoods.length === 0) {
      alert('Por favor agrega alimentos a tu comida');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Por favor inicia sesión para registrar comidas');
        return;
      }

      const totals = calculateTotalNutrition();
      const foodItemsJson = selectedFoods.map(food => ({
        name: food.name,
        portion: food.portion,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat
      }));

      try {
        await logMeal({
          user_id: user.id,
          meal_type: mealType,
          food_items: foodItemsJson,
          total_calories: totals.calories
        });

        setSelectedFoods([]);
        alert('Comida registrada exitosamente');
      } catch (error) {
        console.error('Error logging meal:', error);
        if (error instanceof Error) {
          if (error.message.includes('no encontró el usuario') || error.message.includes('verificar el usuario')) {
            // Try to refresh the page to get a new session
            window.location.reload();
            return;
          }
          alert(error.message);
        } else {
          alert('Error al registrar la comida');
        }
      }
    } catch (authError) {
      console.error('Auth error:', authError);
      alert('Error de autenticación. Por favor inicia sesión nuevamente.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-orange-800">Alimentación</h1>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 ${activeTab === 'database' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            <span>Base de Datos</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-4 py-2 ${activeTab === 'scanner' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            <span>Escáner</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 ${activeTab === 'calculator' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            <span>Calculadora</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className={`px-4 py-2 ${activeTab === 'planner' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>Plan Semanal</span>
          </div>
        </button>
      </div>

      {/* Content Sections */}
      <div className="mt-6">
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Base de Datos de Alimentos</h2>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar alimentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {filteredFoods.map((food, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{food.name}</h3>
                        <p className="text-sm text-gray-600">{food.portion}</p>
                        <p className="text-orange-600">{food.calories} calorías</p>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Proteínas: {food.protein}g</p>
                          <p>Carbohidratos: {food.carbs}g</p>
                          <p>Grasas: {food.fat}g</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addFoodToMeal(food)}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-full"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedFoods.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Comida Actual</h3>
                  <div className="mb-4">
                    <select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                      className="p-2 border rounded-lg"
                    >
                      <option value="desayuno">Desayuno</option>
                      <option value="almuerzo">Almuerzo</option>
                      <option value="cena">Cena</option>
                      <option value="merienda">Merienda</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    {selectedFoods.map((food, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <p className="text-sm text-gray-600">{food.calories} cal</p>
                        </div>
                        <button
                          onClick={() => removeFoodFromMeal(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Total:</p>
                      <p className="text-orange-600">{calculateTotalNutrition().calories} calorías</p>
                    </div>
                    <button
                      onClick={logCurrentMeal}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Registrar Comida
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'scanner' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Escáner de Código de Barras</h2>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Funcionalidad de escáner próximamente...</p>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Calculadora de Recetas</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredientes
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={4}
                  placeholder="Ingresa los ingredientes de tu receta..."
                ></textarea>
              </div>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Calcular Nutrición
              </button>
            </div>
          </div>
        )}

        {activeTab === 'planner' && (
          <div className="space-y-6">
            {mealPlans.map((plan) => (
              <div key={plan.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="space-y-4">
                  {plan.meals.map((meal, index) => (
                    <div key={index} className="border-t pt-4">
                      <h4 className="font-medium mb-2">{meal.name}</h4>
                      <ul className="space-y-2">
                        {meal.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span className="text-gray-600">{item.calories} cal</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
