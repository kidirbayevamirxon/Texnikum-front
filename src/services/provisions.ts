import { axiosInstance } from "../api/api";

export const getProvisions = () => {
  return axiosInstance.get("/owner/deficiency");
};

export const createProvision = (data: {
  title: string;
  description?: string;
}) => {
  return axiosInstance.post("/ownercreate_deficiency", data);
};

export const updateProvision = (
  id: number,
  data: {
    title?: string;
    description?: string;
  }
) => {
  return axiosInstance.patch(`/owner/deficiency/${id}`, data);
};

export const deleteProvision = (id: number) => {
  return axiosInstance.delete(`/owner/deficiency/${id}`);
};
