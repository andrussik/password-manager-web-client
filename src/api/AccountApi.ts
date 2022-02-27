import { LoginDto } from '../models/api/LoginDto';
import { RegisterDto } from '../models/api/RegisterDto';
import { TokenResponse } from '../models/api/TokenResponse';
import { getApi } from '../utils/api-utils';
import { API_URL } from '../utils/config';

export const ACCOUNTS_PATH = '/api/accounts';
export const ACCOUNTS_LOGIN_PATH = '/login';
export const ACCOUNTS_REGISTER_PATH = '/register';
export const ACCOUNTS_TOKEN_PATH = '/token';

const api = getApi(API_URL + ACCOUNTS_PATH);

export const login = async (loginDto: LoginDto): Promise<TokenResponse> =>
  (await api.post(ACCOUNTS_LOGIN_PATH, loginDto))?.data;

export const register = async (registerDto: RegisterDto) => (await api.post(ACCOUNTS_REGISTER_PATH, registerDto))?.data;

export const checkToken = async (): Promise<boolean> => (await api.get(ACCOUNTS_TOKEN_PATH))?.data;
