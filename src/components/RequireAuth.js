import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const allowedRolesInAuth = Object.entries(auth.roles)
  .filter(([key, value]) => value === true)
  .map(([key]) => key);

  if (auth && auth.roles && allowedRoles.some(role => allowedRolesInAuth)) {
    return <Outlet />;
  } else if (auth && auth.email) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  } else {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
}

export default RequireAuth;