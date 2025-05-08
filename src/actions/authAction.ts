import { AppDispatch } from "../redux/store";
import { loginSuccess } from "../redux/authSlice";
import axiosInstance from "../axiosInstance";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/DecodedToken";
import { Commento } from "../types/Commento";

export const getAuthToken = (): string | null => {
  return localStorage.getItem("jwtToken");
};

export const loginUtente =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axiosInstance.post("/Auth/login", {
        email,
        password,
      });
      const { token } = response.data;

      localStorage.setItem("jwtToken", token);

      const decoded = jwtDecode<DecodedToken>(token);
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

      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

export const logout = () => async (dispatch: AppDispatch) => {
  try {
    const token = getAuthToken();
    if (token) {
      await axiosInstance.post("/Auth/logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("jwtToken");
    dispatch({ type: "auth/logout" });
    window.location.href = "/login";
  }
};

export const fetchComments =
  (postId: number) => async (): Promise<Commento[]> => {
    const response = await axiosInstance.get(`/Commenti/articolo/${postId}`);
    return response.data;
  };
