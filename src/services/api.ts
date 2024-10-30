import axios from "axios";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@Sea:token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Erro na configuração da requisição.");
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      toast.error("Acesso não autorizado. Por favor, faça login novamente.");
    } else if (status === 500) {
      toast.error("Erro interno do servidor.");
    } else {
      toast.error(
        `${error.response.data.message}. Houve um erro com sua requisição :(`
      );
    }

    return Promise.reject(error);
  }
);
