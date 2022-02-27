import useAuth from "../../hooks/useAuth";

interface Props {
  children: JSX.Element
}

const Protected = ({ children }: Props) => {
  const isAuthenticated = useAuth();

  return isAuthenticated ? children : null;
}

export default Protected