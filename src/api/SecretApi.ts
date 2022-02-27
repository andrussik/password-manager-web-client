import { Secret } from '../models/Secret';
import { getApi } from '../utils/api-utils';
import { API_URL } from '../utils/config';

export const SECRETS_PATH = '/api/secrets';

const api = getApi(API_URL + SECRETS_PATH);

export const saveSecret = async (secret: Secret): Promise<Secret> => (await api.post('', secret))?.data;

export const removeSecret = async (id: string): Promise<void> => (await api.delete(`/${id}`))?.data;
