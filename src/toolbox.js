import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const domNode = document.getElementById('react-toolbox-root');
const root = createRoot(domNode);

root.render(<App />);
