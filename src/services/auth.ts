import { publicApi } from "../api/api";

export interface LoginPayload {
  login: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export const login = (data: LoginPayload) =>
  publicApi.post<LoginResponse>("/auth/login", data);

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("refres_token");
  window.location.href = "/";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};
