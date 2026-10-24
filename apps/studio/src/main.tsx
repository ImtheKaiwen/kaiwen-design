import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@imthekaiwen/ui-web/styles.css';
import './studio.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
