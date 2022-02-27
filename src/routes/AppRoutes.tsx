import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from '../views/home/Home';
import Login from '../views/login/Login';
import Register from '../views/register/Register';
import Secrets from '../components/secrets/Secrets';
import Paths from './Paths';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={Paths.Login} element={<Login />} />
      <Route path={Paths.Register} element={<Register />} />
      <Route path={Paths.Home} element={<PrivateRoute element={<Home />} />} />
      <Route path={Paths.Secrets} element={<PrivateRoute element={<Secrets />} />} />
    </Routes>
  );
};

export default AppRoutes;
