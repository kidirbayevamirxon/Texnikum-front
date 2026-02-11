import { publicApi, privateApi } from "../api/api";

export interface Teacher {
  id: number;
  full_name: string;
  position: string;
  photo?: string;
  description?: string;
  created_date: string;
}

export const getTeachers = () => 
  publicApi.get<Teacher[]>("/owner/teachers");

export const createTeacher = (data: FormData | any) =>
  privateApi.post("/owner/teachers", data);

export const updateTeacher = (id: number, data: FormData | any) =>
  privateApi.patch(`/owner/teachers/${id}`, data);

export const deleteTeacher = (id: number) =>
  privateApi.delete(`/owner/teachers/${id}`);