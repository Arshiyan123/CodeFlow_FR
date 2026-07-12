import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';
import App from './App';
import './index.css';

if (import.meta.env.VITE_BACKEND_URL) {
  setBaseUrl(import.meta.env.VITE_BACKEND_URL);
}

createRoot(document.getElementById('root')!).render(<App />);