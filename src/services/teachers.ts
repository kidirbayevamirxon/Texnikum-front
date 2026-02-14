import { publicApi, privateApi } from "../api/api";

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  photo?: string[];
  created_date: string;
}

export const getTeachers = () =>
  publicApi.get<Teacher[]>("/owner/teachers");

export const createTeacher = (data: any) =>
  privateApi.post("/owner/teachers", data);

export const updateTeacher = (id: number, data: any) =>
  privateApi.patch(`/owner/teachers/${id}`, data);

export const deleteTeacher = (id: number) =>
  privateApi.delete(`/owner/teachers/${id}`);