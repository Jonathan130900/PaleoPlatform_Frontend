import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import { refreshToken, getAuthToken } from "./actions/authAction";
import { loginSuccess } from "./redux/authSlice";
import { DecodedToken } from "./types/DecodedToken";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import ArticoliList from "./components/ArticoliList";
import ArticoloDetail from "./components/ArticoloDetail";
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
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
              role:
                typeof decoded[
                  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ] === "string"
                  ? [
                      decoded[
                        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                      ],
                    ]
                  : decoded[
                      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    ] || ["user"],
            })
          );
        } else {
          const newToken = await refreshToken();
          if (newToken) {
            const newDecoded = jwtDecode<DecodedToken>(newToken);
            dispatch(
              loginSuccess({
                token: newToken,
                id: Number(
                  newDecoded[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                  ]
                ),
                username:
                  newDecoded[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                  ],
                email:
                  newDecoded[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                  ],
                role:
                  typeof newDecoded[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                  ] === "string"
                    ? [
                        newDecoded[
                          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                        ],
                      ]
                    : newDecoded[
                        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                      ] || ["user"],
              })
            );
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("token");
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/articoli" element={<ArticoliList />} />
          <Route path="/articolo/:id" element={<ArticoloDetail />} />
          <Route element={<PrivateRoute />}></Route>
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default App;
