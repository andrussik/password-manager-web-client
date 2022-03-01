import { Group } from '../models/Group';
import { UserGroup } from '../models/UserGroup';
import { getApi } from '../utils/api-utils';
import { API_URL } from '../utils/config';

export const GROUPS_PATH = '/api/groups';
export const GROUPS_UPDATE_NAME_PATH = '/update/name';

const api = getApi(API_URL + GROUPS_PATH);

export const saveGroup = async (group: Group): Promise<UserGroup> => (await api.post('', group))?.data;

export const updateGroupName = async (group: Group): Promise<void> =>
  (await api.post(GROUPS_UPDATE_NAME_PATH, group))?.data;

export const removeGroup = async (id: string): Promise<void> => (await api.delete(`/${id}`))?.data;
