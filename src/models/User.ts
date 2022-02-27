import { Secret } from "./Secret";
import { UserGroup } from "./UserGroup";

export interface User {
  id: string;
  email: string;
  key: string;
  secrets: Secret[];
  groups: UserGroup[];
}