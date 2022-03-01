import jwtDecode from 'jwt-decode';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useMutation, useQuery } from 'react-query';
import { checkToken } from './api/AccountApi';
import { get } from './api/UserApi';
import { TokenResponse } from './models/api/TokenResponse';
import { DecryptedSecret } from './models/DecryptedSecret';
import { User } from './models/User';
import forge from 'node-forge';
import { decryptData, getEncryptKey, getIv } from './utils/crypto-utils';
import { Secret } from './models/Secret';
import { UserGroup } from './models/UserGroup';

interface ContextProps {
  user?: User;

  isAuthenticated: boolean | undefined;
  setAuthenticated: (tokenResponse: TokenResponse, passwordHash: string) => void;

  logOut: () => void;

  addSecret: (secret: Secret) => void;
  removeSecret: (id: string) => void;

  addUserGroup: (userGroup: UserGroup) => void;
  removeUserGroup: (id: string) => void;

  getDecryptedUserSecrets: () => DecryptedSecret[] | undefined;
  getDecryptedGroupSecrets: (groupId?: string) => DecryptedSecret[] | undefined;
}

export const UserContext = createContext<ContextProps>({} as ContextProps);

interface ProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [tokenExpiresAtUnix, setTokenExpiresAtUnix] = useState<number>();

  const { isFetched } = useQuery(checkToken.name, checkToken, {
    onSettled: isValidToken => {
      setIsAuthenticated(isValidToken === true);
    },
  });

  const { mutateAsync: userMutateAsync } = useMutation(get.name, get, {
    onSuccess: userData => {
      setUser(userData);
    },
  });

  const setAuthenticated = async (tokenResponse: TokenResponse, passwordHash: string) => {
    const exp = jwtDecode<any>(tokenResponse.token)['exp'] as number;
    setTokenExpiresAtUnix(exp);

    localStorage.setItem('token', tokenResponse.token);

    sessionStorage.setItem('key', getEncryptKey(passwordHash));
    sessionStorage.setItem('iv', getIv(passwordHash));

    setIsAuthenticated(true);
  };

  const logOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    setTokenExpiresAtUnix(undefined);
    setIsAuthenticated(false);
  };

  const addSecret = (secret: Secret) => (secret.userId != null ? addUserSecret(secret) : addGroupSecret(secret));

  const addUserSecret = (secret: Secret) => {
    const secrets =
      user!.secrets?.findIndex(x => x.id === secret.id) != -1
        ? user!.secrets?.map(x => (x.id === secret.id ? secret : x))
        : [...(user!.secrets ?? []), secret];

    setUser({
      ...user!,
      secrets: secrets,
    });
  };

  const addGroupSecret = (secret: Secret) => {
    const groups =
      user!.groups.find(x => x.groupId === secret.groupId)?.secrets?.findIndex(x => x.id === secret.id) != -1
        ? user!.groups?.map(group =>
            group.id === secret.groupId
              ? { ...group, secrets: group.secrets.map(x => (x.id === secret.id ? secret : x)) }
              : group
          )
        : user!.groups?.map(group =>
            group.groupId === secret.groupId
              ? {
                  ...group,
                  secrets: [...(group!.secrets ?? []), secret],
                }
              : group
          );

    setUser({
      ...user!,
      groups: groups,
    });
  };

  const removeSecret = (id: string) => {
    setUser({
      ...user!,
      secrets: user!.secrets.filter(x => x.id !== id),
      groups: user!.groups?.map(group => {
        return {
          ...group,
          secrets: group.secrets.filter(x => x.id !== id),
        };
      }),
    });
  };

  const addUserGroup = (userGroup: UserGroup) => {
    const groups =
      user!.groups?.findIndex(x => x.id === userGroup.id) != -1
        ? user!.groups?.map(x => (x.id === userGroup.id ? userGroup : x))
        : [...(user!.groups ?? []), userGroup];

    setUser({
      ...user!,
      groups: groups,
    });
  };

  const removeUserGroup = (id: string) => {
    setUser({
      ...user!,
      groups: user!.groups.filter(x => x.id !== id),
    });
  };

  const getDecryptedUserSecrets = () => {
    return user?.secrets?.map(secret => {
      return {
        ...secret,
        name: decryptData(
          secret.name,
          forge.util.decode64(sessionStorage.getItem('key')!),
          forge.util.decode64(sessionStorage.getItem('iv')!)
        ),
        username: decryptData(
          secret.username,
          forge.util.decode64(sessionStorage.getItem('key')!),
          forge.util.decode64(sessionStorage.getItem('iv')!)
        ),
        password: decryptData(
          secret.password,
          forge.util.decode64(sessionStorage.getItem('key')!),
          forge.util.decode64(sessionStorage.getItem('iv')!)
        ),
        description: decryptData(
          secret.description,
          forge.util.decode64(sessionStorage.getItem('key')!),
          forge.util.decode64(sessionStorage.getItem('iv')!)
        ),
      } as DecryptedSecret;
    });
  };

  const getDecryptedGroupSecrets = (groupId?: string) => {
    return user?.groups
      ?.find(x => x.groupId === groupId)
      ?.secrets?.map(secret => {
        return {
          ...secret,
          name: decryptData(
            secret.name,
            forge.util.decode64(sessionStorage.getItem('key')!),
            forge.util.decode64(sessionStorage.getItem('iv')!)
          ),
          username: decryptData(
            secret.username,
            forge.util.decode64(sessionStorage.getItem('key')!),
            forge.util.decode64(sessionStorage.getItem('iv')!)
          ),
          password: decryptData(
            secret.password,
            forge.util.decode64(sessionStorage.getItem('key')!),
            forge.util.decode64(sessionStorage.getItem('iv')!)
          ),
          description: decryptData(
            secret.description,
            forge.util.decode64(sessionStorage.getItem('key')!),
            forge.util.decode64(sessionStorage.getItem('iv')!)
          ),
        };
      });
  };

  const onIdle = () => {
    if (!isAuthenticated) return;

    logOut();
  };

  useIdleTimer({ onIdle, timeout: 1000 * 60 * 10 });

  const checkTokenExpiry = () => {
    window.setInterval(() => {
      if (!isAuthenticated || tokenExpiresAtUnix === undefined) return;

      let currentDateUnix = Math.round(+new Date() / 1000);

      if (tokenExpiresAtUnix < currentDateUnix) {
        logOut();
      }
    }, 1000 * 60);
  };
  checkTokenExpiry();

  useEffect(() => {
    if (isAuthenticated) (async () => await userMutateAsync())();
  }, [isAuthenticated]);

  const value = {
    user,

    isAuthenticated,
    setAuthenticated,

    logOut,

    addSecret,
    removeSecret,

    addUserGroup,
    removeUserGroup,

    getDecryptedUserSecrets,
    getDecryptedGroupSecrets,
  };

  if (!isFetched) return null;

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
