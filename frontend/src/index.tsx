import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
import './index.css'; // se tiver estilos globais

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Ensure Authorization header is set before any component mounts
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);