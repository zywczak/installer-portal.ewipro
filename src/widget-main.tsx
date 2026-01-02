import React from "react";
import ReactDOM from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Calculator from "./components/app/Calculator";

const ThemedForm = () => (
  <ThemeProvider theme={{}}>
    <CssBaseline />
    <Calculator />
  </ThemeProvider>
);

const FormWidget = reactToWebComponent(ThemedForm, React, ReactDOM, {
  shadow: undefined,
});

customElements.define("form-widget", FormWidget);
