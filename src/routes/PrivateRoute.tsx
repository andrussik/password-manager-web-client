import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { UserContext } from '../UserContext';
import Paths from './Paths';

interface Props {
  element: JSX.Element
}

const PrivateRoute = ({ element }: Props) => {
  const isAuthenticated = useAuth();

  return isAuthenticated ? element : <Navigate to={Paths.Login} />
};

export default PrivateRoute;
