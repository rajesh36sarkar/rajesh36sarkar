import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// --- SUPPRESS THREE.JS DEPRECATION WARNINGS ---
const originalWarn = console.warn;
console.warn = (...args) => {
  // If the warning message is a string and contains 'deprecated', ignore it
  if (args[0] && typeof args[0] === 'string' && args[0].includes('deprecated')) {
    return;
  }
  // Otherwise, let the normal warning pass through
  originalWarn(...args);
};
// ----------------------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);