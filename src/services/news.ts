import { axiosInstance } from "../api/api";

export const getNews = () =>
  axiosInstance.get("/owner/news");

export const createNews = (data: any) =>
  axiosInstance.post("/owner/news", data);

export const updateNews = (id: number, data: any) =>
  axiosInstance.patch(`/owner/news/${id}`, data);       

export const deleteNews = (id: number) =>
  axiosInstance.delete(`/owner/news/${id}`);
