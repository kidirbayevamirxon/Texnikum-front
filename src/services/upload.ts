import { privateApi } from "../api/api";

export const uploadTeacherPhoto = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return privateApi.post("/upload/teacher-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
