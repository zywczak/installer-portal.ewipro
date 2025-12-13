import axios, { AxiosRequestConfig } from "axios";

const BASE_API_URL = "https://api-veen-e.ewipro.com";
const DEFAULT_PATH = "/installer/info/";

const getAccessToken = () => localStorage.getItem("access");

const api = axios.create({
    baseURL: BASE_API_URL,
});

const excludedPaths: any[] = [
    "/installer/authenticate/",
    "/installer/registration/",
];

// Interceptor request – dodawanie tokena do nagłówków
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        const isExcluded = excludedPaths.some(path => config.url?.includes(path));

        if (token && !isExcluded) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor response – obsługa błędu 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized! Redirecting to /auth...");
            localStorage.clear(); 
            window.location.href = "/auth";
        }
        return Promise.reject(error);
    }
);

// Wrapper do post z domyślnym endpointem
const post = async (urlOrData?: string | any, data?: any, config?: AxiosRequestConfig) => {
    if (typeof urlOrData === "string") {
        return api.post(urlOrData, data, config);
    } else {
        // urlOrData jest body, dodajemy token jawnie w nagłówkach
        const token = getAccessToken();
        const headers = { Authorization: token ? `Bearer ${token}` : undefined };
        const finalConfig: AxiosRequestConfig = { ...config, headers };
        return api.post(DEFAULT_PATH, urlOrData, finalConfig);
    }
};

// Wrapper do get z domyślnym endpointem
const get = async (url?: string, config?: AxiosRequestConfig) => {
    const token = getAccessToken();
    const headers = { Authorization: token ? `Bearer ${token}` : undefined };
    return api.get(url || DEFAULT_PATH, { ...(config || {}), headers });
};

export default {
    ...api,
    post,
    get,
};








// import axios from "axios";
// // import { BASE_API_URL } from "./const";
// const BASE_API_URL = "https://api-veen-e-test.ewipro.com";
// const getAccessToken = () => localStorage.getItem("access");
// // const getRefreshToken = () => localStorage.getItem("refresh");

// // const setAccessToken = (token: string) => {
// //     localStorage.setItem("access", token);
// // };

// // const logout = () => {
// //     localStorage.removeItem("access");
// //     localStorage.removeItem("refresh");
// //     window.location.href = "/login";
// // };

// const api = axios.create({
//     baseURL: BASE_API_URL,
// });

// const excludedPaths = [
//     // "/auth"
//     // "/login/",
//     // "/register/",
//     // "/reset-password/",
//     // "/verify-email/",
//     // "/google-login/",
//     // "/api/token/refresh/"
// ];

// api.interceptors.request.use(
//     (config) => {
//         const token = getAccessToken();
//         console.log(token);
      
//         // const isExcluded = excludedPaths.some(path => config.url?.includes(path));

//         // if (token && !isExcluded) {
//         //     config.headers.Authorization = `Bearer ${token}`;
//         // }

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// export default api;
