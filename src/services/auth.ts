import { publicApi } from "../api/api";

export const login = (data: { login: string; password: string }) =>
  publicApi.post("/auth/login", data);

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refres_token");
  window.location.href = "/";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};