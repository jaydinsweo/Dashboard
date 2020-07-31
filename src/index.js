import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppProvider from "./enigma/AppProvider";
import App from "./App";

ReactDOM.render(
   <React.StrictMode>
      <AppProvider>
         <App />
      </AppProvider>
   </React.StrictMode>,
   document.getElementById("root")
);
