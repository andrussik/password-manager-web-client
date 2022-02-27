import axios from "axios";

export const getApi = (baseUrl: string) => {
  const api = axios.create({
    baseURL: baseUrl
  });
  
  api.interceptors.request.use(config => {
    config.headers!.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  });

  return api;
}