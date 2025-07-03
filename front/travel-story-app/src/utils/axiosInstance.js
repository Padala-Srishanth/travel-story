import axios from "axios";
import { BASE_URL } from "./constants";

const axiosinstance = axios.create({
    baseURL: 'http://localhost:8000', // Now with correct port
    timeout: 10000,
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials: true
  });

axiosinstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // ✅ Template literal used correctly
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosinstance;
