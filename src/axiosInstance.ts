import axios from "axios";

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
