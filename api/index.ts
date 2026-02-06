import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token_osm");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token_osm");
      localStorage.removeItem("user_osm");
      delete client.defaults.headers.common["Authorization"];

      window.dispatchEvent(new CustomEvent("app-navigate", { detail: "/" }));
    }
    return Promise.reject(error);
  },
);

export default client;
