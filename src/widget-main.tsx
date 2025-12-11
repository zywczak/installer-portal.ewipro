import React from "react";
import ReactDOM from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme/theme";
import Form from "./components/app/form";

const ThemedForm = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Form />
  </ThemeProvider>
);

const FormWidget = reactToWebComponent(ThemedForm, React, ReactDOM, {
  shadow: undefined,
});

customElements.define("form-widget", FormWidget);
