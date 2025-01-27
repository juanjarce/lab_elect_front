import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://72.167.51.48:8082/api", // Cambia la base URL según el backend
  timeout: 10000, // 10 segundos
});

export default axiosInstance;
