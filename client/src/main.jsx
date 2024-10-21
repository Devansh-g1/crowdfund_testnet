// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'; //extra line for thirdweb
import { Ganache, Holesky,Sepolia } from "@thirdweb-dev/chains"; //extra line
const env = await import.meta.env;

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider activeChain={Holesky} clientId='729de2d72dbf8b9846e389ad314a0cbd'> 
  <Router>
    <StateContextProvider>
      <App />
    </StateContextProvider>
  </Router>
  </ThirdwebProvider> 
);


// MAIN.JSX FOR Ganache

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router } from 'react-router-dom';

// import { StateContextProvider } from './context';
// import App from './App';
// import './index.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <Router>
//     <StateContextProvider>
//       <App />
//     </StateContextProvider>
//   </Router>
// );
