import { PatchOperation } from "./PatchOperation"

export type PatchDocument = {
  id: any;
  operations: PatchOperation[];
}