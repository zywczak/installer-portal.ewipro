// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://twoje-api.pl/api",
//   withCredentials: true,
// });

// export default api;




// import React, { createContext, useState, useContext, ReactNode } from "react";
// import api from "../api/axios";

// interface AuthContextType {
//   user: any;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<any>(null);
//   const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

//   const login = async (email: string, password: string) => {
//     const res = await api.post("/auth/login", { email, password });
//     const { token, user } = res.data;
//     setUser(user);
//     setToken(token);
//     localStorage.setItem("token", token);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };








// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
//   const { token } = useAuth();
//   return token ? children : <Navigate to="/auth" replace />;
// };

// export default ProtectedRoute;





// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import Auth from "./pages/Auth";
// import Dashboard from "./pages/Dashboard";
// import ProtectedRoute from "./pages/ProtectedRoute";

// const App = () => (
//   <AuthProvider>
//     <Router>
//       <Routes>
//         <Route path="/auth" element={<Auth />} />
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   </AuthProvider>
// );

// export default App;






// import React from "react";
// import { Button } from "@mui/material";
// import { useAuth } from "../context/AuthContext";

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   return (
//     <div style={{ padding: 40 }}>
//       <h1>Witaj {user?.email || "użytkowniku"} 👋</h1>
//       <Button variant="contained" onClick={logout}>
//         Wyloguj
//       </Button>
//     </div>
//   );
// };

// export default Dashboard;
export {}