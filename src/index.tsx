import reportWebVitals from './reportWebVitals';
import Auth from './pages/auth';
import App from './pages/app';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';
import './index.css';
import "./i18n";
// import { AuthProvider } from './api/authProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {/* <AuthProvider> */}
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            {/* <Route element={<RequireAuth requiredRole={["admin", "user"]} verification={true} />}> */}
              <Route path="/" element={<App />} />
            {/* </Route> */}

          </Routes>
        {/* </AuthProvider> */}
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
