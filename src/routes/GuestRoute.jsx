import React from "react";
import { Navigate } from "react-router-dom";
import {toast} from "react-toastify";

const GuestRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const isAuth = !!token;
      setIsAuthenticated(isAuth);
      setLoading(false);

      if (isAuth) {
        toast.warn("شما از قبل ورود کرده اید");
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>در حال بررسی...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestRoute;