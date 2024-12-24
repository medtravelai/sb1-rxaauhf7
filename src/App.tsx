import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { DailyTip } from './components/DailyTip';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-orange-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/registro" element={<RegisterForm />} />
              <Route path="/welcome" element={<WelcomeScreen />} />
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <DailyTip />
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <Dashboard />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/ejercicio" element={
                <ProtectedRoute>
                  <Exercise />
                </ProtectedRoute>
              } />
              <Route path="/nutricion" element={
                <ProtectedRoute>
                  <Nutrition />
                </ProtectedRoute>
              } />
              <Route path="/estado" element={
                <ProtectedRoute>
                  <MoodSleep />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/welcome" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Placeholder components remain the same
const Dashboard = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-orange-800">¡Bienvenido a Amigo!</h1>
    <p className="text-gray-600">Tu compañero personal para una vida más saludable.</p>
  </div>
);

const Exercise = () => <div>Ejercicio Component</div>;
const Nutrition = () => <div>Nutrición Component</div>;
const MoodSleep = () => <div>Estado Component</div>;

export default App;