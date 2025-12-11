import axios from "axios";
// import { BASE_API_URL } from "./const";
const BASE_API_URL = "https://api-veen-e-test.ewipro.com";
const getAccessToken = () => localStorage.getItem("access");
// const getRefreshToken = () => localStorage.getItem("refresh");

// const setAccessToken = (token: string) => {
//     localStorage.setItem("access", token);
// };

// const logout = () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     window.location.href = "/login";
// };

const api = axios.create({
    baseURL: BASE_API_URL,
});

const excludedPaths = [
    // "/auth"
    // "/login/",
    // "/register/",
    // "/reset-password/",
    // "/verify-email/",
    // "/google-login/",
    // "/api/token/refresh/"
];

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        console.log(token);
      
        // const isExcluded = excludedPaths.some(path => config.url?.includes(path));

        // if (token && !isExcluded) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;



























