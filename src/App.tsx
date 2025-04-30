import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

import Login from "./components/Login";
import ArticoliList from "./components/ArticoliList";
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Paleo Community</h1>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/articoli" element={<ArticoliList />} />
        </Route>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/articoli" : "/login"} />}
        />
      </Routes>
    </div>
  );
};

export default App;
