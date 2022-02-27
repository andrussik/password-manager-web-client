import { Secret } from "./Secret";

export interface UserGroup {
  id: string;
  groupId: string;
  name: string;
  role: string;
  secrets: Secret[];
}