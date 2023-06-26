import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
