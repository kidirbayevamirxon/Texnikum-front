import { axiosInstance } from "../api/api";

export const getTeachers = () =>
  axiosInstance.get("/owner/teachers");

export const createTeacher = (data: any) =>
  axiosInstance.post("/owner/teachers", data);

export const updateTeacher = (id: number, data: any) =>
  axiosInstance.patch(`/owner/teachers/${id}`, data);

export const deleteTeacher = (id: number) =>
  axiosInstance.delete(`/owner/teachers/${id}`);
