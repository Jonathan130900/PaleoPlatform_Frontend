import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const MainLayout: React.FC = () => {
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          await axiosInstance.get("/Auth/validate-token");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          localStorage.removeItem("jwtToken");
          window.location.reload();
        }
      }
    };
    validateToken();
  }, []);

  return (
    <div className="container-fluid">
      <Outlet />
    </div>
  );
};

export default MainLayout;
