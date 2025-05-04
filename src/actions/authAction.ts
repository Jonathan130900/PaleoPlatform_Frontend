// authAction.ts
import { AppDispatch } from "../redux/store";
import { loginSuccess, logout as logoutAction } from "../redux/authSlice";
import axiosInstance from "../axiosInstance";
import { parseJwt } from "../utils/parseJwt";

export const loginUtente =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axiosInstance.post("/Auth/login", {
        email,
        password,
      });
      const { token, utente } = response.data;

      console.log("Login response data:", response.data);

      localStorage.setItem("token", token);

      // Use parseJwt to get extracted values
      const { name: username, email: decodedEmail, role, id } = parseJwt(token);

      console.log("Decoded token:", { username, decodedEmail, role, id });

      dispatch(loginSuccess({ ...utente, username }));
    } catch (error) {
      console.error("Login error:", error);
    }
  };

export const logout = () => (dispatch: AppDispatch) => {
  localStorage.removeItem("token");
  dispatch(logoutAction());
};
