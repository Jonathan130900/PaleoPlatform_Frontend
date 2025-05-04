import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import ArticoliList from "./components/ArticoliList";
import PrivateRoute from "./components/PrivateRoute";
import { loginSuccess } from "./redux/authSlice";
import { DecodedToken } from "./types/DecodedToken";
import { Utente } from "./types/Utente";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user: Utente = JSON.parse(storedUser);
      const decoded: DecodedToken = jwtDecode(user.token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (!isExpired) {
        dispatch(loginSuccess(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/articoli" element={<ArticoliList />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
