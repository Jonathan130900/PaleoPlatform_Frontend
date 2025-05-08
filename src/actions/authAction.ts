import { AppDispatch } from "../redux/store";
import { loginSuccess, logout as logoutAction } from "../redux/authSlice";
import axiosInstance from "../axiosInstance";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/DecodedToken";
import { Commento } from "../types/Commento";

// Utility function to get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("jwtToken") || localStorage.getItem("token");
};

// Fetch comments for an article
export const fetchComments = async (
  articoloId: number
): Promise<Commento[]> => {
  const token = getAuthToken();
  const response = await fetch(`/api/Commenti/articolo/${articoloId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch comments");
  return await response.json();
};

// Login action
export const loginUtente =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axiosInstance.post("/Auth/login", {
        email,
        password,
      });
      const { token, utente } = response.data;
      const decoded = jwtDecode<DecodedToken>(token);

      // Store tokens
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("token", token);

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
            ] ||
            utente.username ||
            "User",
          email:
            decoded[
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
            ] || utente.email,
          role: [
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],
          ],
          ...utente,
        })
      );
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

// Logout action
export const logout = () => (dispatch: AppDispatch) => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("token");
  dispatch(logoutAction());
};

// Refresh token
export const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await axiosInstance.post("/Auth/refresh-token");
    const { token } = response.data;
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("token", token);
    return token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
};
