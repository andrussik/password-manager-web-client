import { User } from '../models/User';
import { API_URL } from '../utils/config';
import { getServiceApi } from '../utils/service-api';

export const USERS_PATH = '/api/users';

const api = getServiceApi(API_URL + USERS_PATH);

export const get = async (): Promise<User> => {
  return (await api.get(''))?.data;
};
