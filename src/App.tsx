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
import { Dashboard } from './components/Dashboard';
import { Exercise } from './components/Exercise';
import { Nutrition } from './components/Nutrition';
import { MoodSleep } from './components/MoodSleep';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  console.log('App rendering...');
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-orange-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/welcome" replace />} />
              <Route path="/welcome" element={<WelcomeScreen />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/registro" element={<RegisterForm />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                      <DailyTip />
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <Dashboard />
                      </div>
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/ejercicio" element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                      <Exercise />
                    </main>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/nutricion" element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                      <Nutrition />
                    </main>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/bienestar" element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                      <MoodSleep />
                    </main>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/perfil" element={
                <ProtectedRoute>
                  <div>
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                      <ProfilePage />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;