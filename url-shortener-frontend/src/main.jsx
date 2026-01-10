import ReactDOM from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import { store } from './App/store.js';
import './Theme.css'
import './index.css'
import { ThemeProvider } from "../context/ThemeContext.jsx";
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
