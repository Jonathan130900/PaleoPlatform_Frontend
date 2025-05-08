/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import ArticoliList from "./components/ArticoliList";
import ArticoloDetail from "./components/ArticoloDetail";
import NotFound from "./components/NotFound";
import MainLayout from "./components/MainLayout";
import Register from "./components/Register";
import Footer from "./components/Footer";
import { loginSuccess } from "./redux/authSlice";
import { DecodedToken } from "./types/DecodedToken";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token) as DecodedToken;
        dispatch(
          loginSuccess({
            token,
            id: Number(
              decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
              ]
            ),
            username:
              decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
              ],
            email:
              decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
              ],
            role: decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] || ["user"],
          })
        );
      } catch (error) {
        localStorage.removeItem("jwtToken");
      }
    }
  }, [dispatch]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {!["/login", "/register"].includes(location.pathname) && <Navbar />}
      <main
        style={{
          paddingTop: !["/login", "/register"].includes(location.pathname)
            ? "56px"
            : "0",
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/articoli" element={<ArticoliList />} />
            <Route path="/articolo/:id" element={<ArticoloDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </main>
      {!["/login", "/register"].includes(location.pathname) && <Footer />}
      <ToastContainer />
    </div>
  );
};

export default App;
