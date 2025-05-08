import axios from "axios";
import { logout } from "./actions/authAction";
import { store } from "./redux/store";

const apiBaseURL = import.meta.env.VITE_API_URL || "https://localhost:7224/api";

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwtToken");
      await logout()(store.dispatch);
      window.location.href = "/login?sessionExpired=true";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
