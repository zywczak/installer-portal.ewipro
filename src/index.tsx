import reportWebVitals from './reportWebVitals';
import Auth from './pages/auth';
import App from './pages/app';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import "./i18n";
import ResetPassword from './pages/reset';

createRoot(document.getElementById('root')!).render(
      <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route path="/" element={<App />} />

            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
      </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
