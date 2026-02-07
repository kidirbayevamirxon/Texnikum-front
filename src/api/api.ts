import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log("401 xatolik aniqlangan, tokenni yangilashga urinish...");
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Refresh token topilmadi");

        const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });

        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token yangilash xatolik:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export function logoutUser() {
  console.log("Foydalanuvchi tizimdan chiqmoqda...");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.replace("/login");
}
