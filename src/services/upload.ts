import { privateApi } from "../api/api";

export interface UploadResponse {
  files: string[];
  url: string | null;
}

export const uploadFiles = async (
  files: File[],
  folder: "teachers" | "news" | "deficiency"
) => {
  const formData = new FormData();

  formData.append("folder", folder);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await privateApi.post<UploadResponse>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
