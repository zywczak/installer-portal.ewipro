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
























































// import axios, { AxiosRequestConfig } from "axios";

// const BASE_API_URL = "https://api-veen-e.ewipro.com";
// const DEFAULT_PATH = "/installer/info/";

// // Pobiera token z localStorage
// const getAccessToken = () => localStorage.getItem("access");

// // Endpointy, dla których nie dodajemy tokena
// const excludedPaths = ["/installer/authenticate/"];

// // Tworzymy instancję axios
// const api = axios.create({
//   baseURL: BASE_API_URL,
// });

// // Interceptor dodający token
// api.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken();
//     const isExcluded = excludedPaths.some(path => config.url?.includes(path));

//     if (token && !isExcluded) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Jeśli URL nie jest podany, ustawiamy domyślny
//     if (!config.url) {
//       config.url = DEFAULT_PATH;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Nadpisujemy metody post/get/put/delete, żeby domyślnie używały DEFAULT_PATH
// const methods = ["get", "post", "put", "delete"] as const;

// methods.forEach((method) => {
//   const original = api[method];
//   api[method] = function (urlOrData?: any, maybeData?: any) {
//     if (typeof urlOrData === "string") {
//       // Jeśli podano URL -> używamy normalnie
//       return original.call(api, urlOrData, maybeData);
//     } else {
//       // Jeśli URL nie podano -> używamy DEFAULT_PATH
//       return original.call(api, DEFAULT_PATH, urlOrData);
//     }
//   } as any;
// });

// export default api;