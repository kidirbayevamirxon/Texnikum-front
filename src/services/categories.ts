import { axiosInstance } from "../api/api";

export const getCategories = () =>
  axiosInstance.get("/owner/categories");

export const createCategory = (data: any) =>
  axiosInstance.post("ownercreate_categories", data);

export const updateCategory = (id: number, data: any) =>
  axiosInstance.patch(`/owner/categories/${id}`, data);

export const deleteCategory = (id: number) =>
  axiosInstance.delete(`/owner/categories/${id}`);


