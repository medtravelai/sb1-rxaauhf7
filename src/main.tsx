import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found. The app requires a DOM element with id "root".'
  );
}

try {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  
  // Show a user-friendly error message
  rootElement.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: system-ui, sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <h1 style="color: #c2410c; margin-bottom: 16px;">
        ¡Ups! Algo salió mal
      </h1>
      <p style="color: #666; margin-bottom: 16px;">
        Lo sentimos, ha ocurrido un error al cargar la aplicación.
        Por favor, intenta recargar la página.
      </p>
      <button 
        onclick="window.location.reload()" 
        style="
          background: #ea580c;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
        "
      >
        Recargar Página
      </button>
    </div>
  `;
}
