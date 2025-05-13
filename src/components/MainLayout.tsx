import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { paleoTheme } from "../styles/theme";

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
    <div
      className="container-fluid pt-4"
      style={{
        backgroundColor: paleoTheme.colors.background,
        minHeight: "100vh",
        paddingTop: "80px",
      }}
    >
      <Outlet />
    </div>
  );
};

export default MainLayout;
