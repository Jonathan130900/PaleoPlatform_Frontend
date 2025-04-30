import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Utente } from "../types/Utente";

interface AuthState {
  user: Utente | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post<Utente>(
      "https://localhost:7224/api/Auth/login",
      credentials
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<Utente>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<Utente>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
