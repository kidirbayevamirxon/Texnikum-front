import { publicApi, privateApi } from "../api/api";

export interface NewsItem {
  id: number;
  description: string;
  photo: string[];
  created_date: string;
  updated_date: string;
}


export const getNews = () => publicApi.get<NewsItem[]>("/owner/news");


export const createNews = (data: {
  description: string;
  photo?: string[]; 
}) => privateApi.post("owner/create_news", data);

export const updateNews = (
  id: number,
  data: {
    description?: string;
    photo?: string[];  
  }
) => privateApi.patch(`/owner/news/${id}`, data);



export const deleteNews = (id: number) =>
  privateApi.delete(`/owner/news/${id}`);