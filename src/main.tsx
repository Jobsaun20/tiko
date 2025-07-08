import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { AuthProvider } from '@/contexts/AuthContext';
import { BadgeModalProvider } from '@/contexts/BadgeModalContext'; // <--- Importa tu nuevo provider

// BadgeModalProvider debe envolver TODO el App, y AuthProvider sigue funcionando igual.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BadgeModalProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BadgeModalProvider>
  </React.StrictMode>
);
