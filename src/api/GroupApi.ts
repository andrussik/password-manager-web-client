import { Group } from '../models/Group';
import { UserGroup } from '../models/UserGroup';
import { getServiceApi } from '../utils/service-api';
import { API_URL } from '../utils/config';
import { PatchDocument } from '../models/PatchDocument';

export const GROUPS_PATH = '/api/groups';
export const GROUPS_UPDATE_NAME_PATH = '/update/name';

const api = getServiceApi(API_URL + GROUPS_PATH);

export const postGroup = async (group: Group): Promise<UserGroup> => (await api.post('', group))?.data;

export const patchGroup = async ({ id, operations }: PatchDocument): Promise<void> =>
  (await api.patch(id, operations))?.data;

export const updateGroupName = async (group: Group): Promise<void> =>
  (await api.post(GROUPS_UPDATE_NAME_PATH, group))?.data;

export const deleteGroup = async (id: string): Promise<void> => (await api.delete(`/${id}`))?.data;
