import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://labuq.catavento.co:10444/api", // Cambia la base URL según el backend
  timeout: 10000, // 10 segundos
});

export default axiosInstance;
