import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (rootElement) {
  // Mark as ready so the inline error-catcher no longer overrides the screen.
  rootElement.dataset.appReady = '1';
  // Clear the inline boot loader — React takes over.
  rootElement.innerHTML = '';
}

const root = ReactDOM.createRoot(rootElement ?? document.body);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
