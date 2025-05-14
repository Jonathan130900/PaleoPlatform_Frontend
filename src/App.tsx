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
import CreaArticolo from "./components/CreaArticolo";
import RequireAuth from "./components/RequireAuth";
import ModificaArticolo from "./components/ModificaArticolo";
import DiscussioniList from "./components/DiscussioniList";
import DiscussioneDetail from "./components/DiscussioneDetail";
import CreaDiscussioneModal from "./components/CreaDiscussioneModal";

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        localStorage.removeItem("jwtToken");
      }
    }
  }, [dispatch]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {!["/login", "/register"].includes(location.pathname) && <Navbar />}
      <main
        className="flex-grow-1"
        style={{
          paddingTop: ["/login", "/register"].includes(location.pathname)
            ? "0"
            : "80px",
          paddingBottom: ["/login", "/register"].includes(location.pathname)
            ? "0"
            : "0",
        }}
      >
        <Routes>
          <Route
            path="/crea-articolo"
            element={
              <RequireAuth roles={["Amministratore", "Moderatore"]}>
                <CreaArticolo />
              </RequireAuth>
            }
          />
          <Route
            path="/modifica-articolo/:id"
            element={
              <RequireAuth roles={["Amministratore", "Moderatore"]}>
                <ModificaArticolo />
              </RequireAuth>
            }
          />
          <Route
            path="/crea-discussione"
            element={
              <RequireAuth>
                <CreaDiscussioneModal
                  topics={[]}
                  onClose={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/articoli" element={<ArticoliList />} />
            <Route path="/articolo/:id" element={<ArticoloDetail />} />
            <Route path="/community" element={<DiscussioniList />} />
            <Route path="/discussioni/:id" element={<DiscussioneDetail />} />
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
