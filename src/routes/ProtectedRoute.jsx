import React from "react";
import { Navigate } from "react-router-dom";
import {toast} from "react-toastify";
import { getCookie } from "../utils/helpers/cookie";
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');

      setIsAuthenticated(!!token);

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>در حال بررسی...</div>;
  }

  if (!isAuthenticated) {
    toast.warn("شما باید ورود کنید")
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;