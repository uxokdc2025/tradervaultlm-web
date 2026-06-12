// main.jsx — Seamless AI Homepage entry point
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import './styles/colors.css';
import './styles/typography.css';
import './styles/app.css';

createRoot(document.getElementById('root')).render(<App />);
