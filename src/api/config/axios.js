import { message } from "antd";
import axios from "axios";

export const baseUrl = import.meta.env.VITE_API_URL;
const config = {
  baseUrl,
  timeout: 3000000,
};
const api = axios.create(config);
api.defaults.baseURL = baseUrl;

const handleBefore = (config) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};

const handleError = (error) => {
  if (
    error.response &&
    (error.response.status === 401 || error.response.status === 403)
  ) {
    window.location.href = "/unauthorized";
    message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
  }
  return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, null);
api.interceptors.response.use(null, handleError);

export default api;
