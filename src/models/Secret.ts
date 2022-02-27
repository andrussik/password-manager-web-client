export interface Secret {
  id: string;
  name: string;
  username: string;
  password: string;

  userId?: string;
  groupId?: string;
}