// Minimal entry point for Vite development
// This file is not included in the published package

import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>vite-react-image Development</h1>
    <p>This is the development environment for the vite-react-image library.</p>
    <p>Run "npm run build" to build the library for production.</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);