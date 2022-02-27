import { User } from '../models/User';
import { getApi } from '../utils/api-utils';
import { API_URL } from '../utils/config';

export const USERS_PATH = '/api/users';

const api = getApi(API_URL + USERS_PATH);

export const get = async (): Promise<User> => {
  return (await api.get(''))?.data;
};
