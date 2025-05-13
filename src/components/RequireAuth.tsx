import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { JSX } from "react";

interface RequireAuthProps {
  children: JSX.Element;
  roles?: string[];
}

const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  console.log("Current roles:", user?.role);
  console.log("Required roles:", roles);
  console.log(
    "Has access:",
    roles?.some((r) => user?.role?.includes(r))
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    roles &&
    !roles.some((requiredRole) =>
      user?.role?.some((userRole) => userRole === requiredRole)
    )
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;
