import axios from "axios";
import { refreshToken } from "./actions/authAction";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

const apiBaseURL = "https://localhost:7224/api";
const staticBaseURL = "https://localhost:7224";

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
});

export const staticFilesInstance = axios.create({
  baseURL: staticBaseURL,
  responseType: "blob",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
