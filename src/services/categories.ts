import { publicApi, privateApi } from "../api/api";

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_date: string;
}

export const getCategories = () => 
  publicApi.get<Category[]>("/owner/categories");

export const createCategory = (data: { name: string; description?: string }) =>
  privateApi.post<Category>("/owner/categories", data);

export const updateCategory = (id: number, data: { name?: string; description?: string }) =>
  privateApi.patch<Category>(`/owner/categories/${id}`, data);

export const deleteCategory = (id: number) =>
  privateApi.delete(`/owner/categories/${id}`);