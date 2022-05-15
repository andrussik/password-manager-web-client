import axios, { AxiosError } from 'axios';
import { QueryClient } from 'react-query';
import appToast from './app-toast';
import { API_URL } from './config';

export const getServiceApi = (baseUrl: string) => {
  const api = axios.create({
    baseURL: baseUrl,
  });

  api.interceptors.request.use(config => {
    config.headers!.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  });

  return api;
};

const serviceApi = getServiceApi(API_URL!);
export default serviceApi;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      onError: e => errorHandler(e as AxiosError),
    },
    mutations: {
      onError: e => errorHandler(e as AxiosError),
    },
  },
});

const errorHandler = (error: AxiosError) => {
  if (error.response?.data?.errors) {
    const errorMessages = [];
    for (const [_, value] of Object.entries(error.response?.data?.errors)) {
      errorMessages.push(value);
    }
    appToast.error(errorMessages.join('\n'));
  } else {
    appToast.error(error.response?.statusText ?? error.message);
  }
};
