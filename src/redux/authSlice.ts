import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Utente } from "../types/Utente";
import { Commento } from "../types/Commento";

interface AuthState {
  user: (Utente & { comments?: Commento[]; role: string[] }) | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        token: string;
        id: number;
        username: string;
        email: string;
        role: string | string[];
      }>
    ) {
      const roleArray =
        typeof action.payload.role === "string"
          ? [action.payload.role]
          : action.payload.role;

      state.user = {
        ...action.payload,
        role: roleArray,
      };
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    addComment(state, action: PayloadAction<Commento>) {
      if (state.user) {
        state.user.comments = [...(state.user.comments || []), action.payload];
      }
    },
    removeComment(state, action: PayloadAction<number>) {
      if (state.user?.comments) {
        state.user.comments = state.user.comments.filter(
          (c) => c.id !== action.payload
        );
      }
    },
    setComments(state, action: PayloadAction<Commento[]>) {
      if (state.user) {
        state.user.comments = action.payload;
      }
    },
  },
});

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const { loginSuccess, logout, addComment, removeComment, setComments } =
  authSlice.actions;
export default authSlice.reducer;
