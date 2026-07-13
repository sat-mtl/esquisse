import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LangProvider } from './LangContext.jsx';

const domNode = document.getElementById('react-toolbox-root');
const root = createRoot(domNode);

root.render(
  <LangProvider>
    <App />
  </LangProvider>
);
