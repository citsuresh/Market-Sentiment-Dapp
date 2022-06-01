import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";
 
 
 
ReactDOM.render(
 <React.StrictMode>
   <MoralisProvider appId="2WPhe9gYpYuMOan0P25ve24IhZkvLk74qdrK3kpS" serverUrl="https://nt0ucrs6xq0k.usemoralis.com:2053/server">
         <App />
   </MoralisProvider>
 </React.StrictMode>,
 document.getElementById('root')
);