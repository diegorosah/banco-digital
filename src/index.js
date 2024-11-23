// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/globals/Globals.css';
import App from './App';
import 'primereact/resources/themes/lara-dark-blue/theme.css';  // Tema Lara Dark Blue
import 'primereact/resources/primereact.min.css';  // CSS básico do PrimeReact
import 'primeicons/primeicons.css';  // Ícones

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
