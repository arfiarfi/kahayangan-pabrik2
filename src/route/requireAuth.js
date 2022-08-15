import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const authStore = useSelector((state) => state.auth);

  let location = useLocation();

  if (!authStore.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
