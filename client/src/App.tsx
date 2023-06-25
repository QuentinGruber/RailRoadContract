import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { frFR } from "@mui/material/locale";
import React from "react";
import "./App.css";

import { Provider } from "react-redux";
import store from "./store";
import Router from "./router";

function App() {
  const theme = createTheme(frFR);
  return (
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
