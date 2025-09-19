import { StrictMode } from 'react';

import '@mantine/core/styles.css';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { ThemeProvider } from './components/ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
