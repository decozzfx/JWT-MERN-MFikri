import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios'
import 'bulma/css/bulma.css'

axios.defaults.withCredentials = true // agar tidak request kredensial setiap kali request ke server 

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);