import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './App';
import { GlobalStateProvider } from './state';

render(
  <GlobalStateProvider>
    <Router>
      <App />
    </Router>
  </GlobalStateProvider>,
  document.getElementById('root')
);
