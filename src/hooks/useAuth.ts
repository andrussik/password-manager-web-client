import { useContext } from 'react';
import { UserContext } from '../UserContext';

export default function useAuth() {
  const { isAuthenticated } = useContext(UserContext);
 
  return isAuthenticated;
}
