import { StrictMode } from 'react';

import '@mantine/core/styles.css';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { ThemeProvider } from './components/ThemeProvider';
import { SkinProvider } from './contexts/SkinContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SkinProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </SkinProvider>
  </StrictMode>,
);
