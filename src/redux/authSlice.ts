import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Utente } from "../types/Utente";

interface AuthState {
  user: Utente | null;
  loading: boolean;
  isAuthenticated: boolean;
  username: string | null;
  role: string[] | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  username: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<Utente & { username: string }>) {
      state.user = action.payload;
      state.username = action.payload.username;
      state.role = action.payload.role || null;
      state.isAuthenticated = true;
      state.loading = false;

      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.username = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
