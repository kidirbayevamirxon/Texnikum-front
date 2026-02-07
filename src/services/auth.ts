import { axiosInstance } from "../api/api";

export const login = (data: {
  login: string;
  password: string;
}) =>
  axiosInstance.post("auth/login", data);
