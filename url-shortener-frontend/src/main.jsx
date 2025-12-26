import ReactDOM from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import { store } from './App/store.js';
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
