import { publicApi, privateApi } from "../api/api";

export interface Provision {
  id: number;
  title: string;
  description?: string;
  created_date: string;
}

export const getProvisions = () => 
  publicApi.get<Provision[]>("/owner/deficiency");

export const createProvision = (data: { title: string; description?: string }) =>
  privateApi.post("/owner/deficiency", data);

export const updateProvision = (id: number, data: { title?: string; description?: string }) =>
  privateApi.patch(`/owner/deficiency/${id}`, data);

export const deleteProvision = (id: number) =>
  privateApi.delete(`/owner/deficiency/${id}`);