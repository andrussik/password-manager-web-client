import { createContext, ReactNode, useState } from "react";
import { NavMenuKeys } from "../../components/nav-menu/NavMenu";
import { DecryptedSecret } from "../../models/DecryptedSecret";
import { Group } from "../../models/Group";
import { UserGroup } from "../../models/UserGroup";

interface ContextProps {
  editingSecret: DecryptedSecret | undefined;
  setEditingSecret: (secret: DecryptedSecret | undefined) => void;

  editingGroup: Group | undefined;
  setEditingGroup: (group: Group | undefined) => void;

  selectedUserGroup: UserGroup | undefined;
  setSelectedUserGroup: (group: UserGroup | undefined) => void;

  activeKey: string;
  setActiveKey: (key: string) => void;
}

export const HomeContext = createContext<ContextProps>({} as ContextProps);

interface ProviderProps {
  children: ReactNode;
}

const HomeProvider = ({ children }: ProviderProps) => {
  const [editingSecret, setEditingSecret] = useState<DecryptedSecret>();
  const [editingGroup, setEditingGroup] = useState<Group>();
  const [selectedUserGroup, setSelectedUserGroup] = useState<UserGroup>();
  const [activeKey, setActiveKey] = useState<string>(NavMenuKeys.MY_VAULT);

  const value = {
    editingSecret,
    setEditingSecret,

    editingGroup,
    setEditingGroup,

    selectedUserGroup,
    setSelectedUserGroup,

    activeKey,
    setActiveKey
  };
  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>
}

export default HomeProvider;