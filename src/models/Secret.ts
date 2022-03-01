export interface Secret {
  id: string;
  name: string;
  username: string;
  password: string;
  description: string;

  userId?: string;
  groupId?: string;
}