import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

const ssrData = (window as unknown as { __SSR_DATA__?: Record<string, unknown> }).__SSR_DATA__ || {};

const root = document.getElementById('root')!;
createRoot(root).render(
  <BrowserRouter>
    <App ssrData={ssrData} />
  </BrowserRouter>
);
