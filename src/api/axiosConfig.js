import axios from "axios";
import { API_BASE_URL } from "./../../config/api";

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Cambia la base URL según el backend
  timeout: 10000, // 10 segundos
});

export default axiosInstance;
