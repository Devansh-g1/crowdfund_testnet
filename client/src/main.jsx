// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'; //extra line for thirdweb
import { Holesky,Sepolia } from "@thirdweb-dev/chains"; //extra line
const env = await import.meta.env;

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider activeChain={Holesky} clientId={env.VITE_CLIENT_ID}> 
  <Router>
    <StateContextProvider>
      <App />
    </StateContextProvider>
  </Router>
  </ThirdwebProvider> 
);
