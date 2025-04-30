import { AppDispatch } from "../redux/store";
import { loginSuccess, logout as logoutAction } from "../redux/authSlice";
import axiosInstance from "../axiosInstance";

export const loginUtente =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axiosInstance.post("/login", { email, password });
      const { token, utente } = response.data;
      localStorage.setItem("token", token);
      dispatch(loginSuccess(utente));
    } catch (error) {
      console.error("Login error:", error);
    }
  };

export const logout = () => (dispatch: AppDispatch) => {
  localStorage.removeItem("token");
  dispatch(logoutAction());
};
