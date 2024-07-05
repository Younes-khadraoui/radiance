import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserProvider";

interface ProtectedRouteProps {
  element: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  adminOnly = false,
}) => {
  const isAuthenticated = localStorage.getItem("authToken") !== null;
  const { user } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.admin) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
