import { publicApi, privateApi } from "../api/api";

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  photo?: string[];
  photo_url?: string;
  created_date?: string;
}

export interface TeacherCreatePayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  photo?: string[];
  photo_url?: string;
}

export const getTeachers = () =>
  publicApi.get<Teacher[]>("/owner/teachers");

export const createTeacher = (data: TeacherCreatePayload) =>
  privateApi.post("/owner/teachers", data);

export const updateTeacher = (id: number, data: Partial<TeacherCreatePayload>) =>
  privateApi.patch(`/owner/teachers/${id}`, data);

export const deleteTeacher = (id: number) =>
  privateApi.delete(`/owner/teachers/${id}`);
