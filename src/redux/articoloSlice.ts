import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Articolo } from "../types/Articolo";

interface ArticoliState {
  articoli: Articolo[];
  loading: boolean;
}

const initialState: ArticoliState = {
  articoli: [],
  loading: false,
};

export const fetchArticoli = createAsyncThunk("articoli/fetch", async () => {
  const response = await axios.get<Articolo[]>(
    "https://localhost:7224/api/articoli"
  );
  return response.data;
});

const articoloSlice = createSlice({
  name: "articoli",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticoli.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchArticoli.fulfilled,
        (state, action: PayloadAction<Articolo[]>) => {
          state.loading = false;
          state.articoli = action.payload;
        }
      );
  },
});

export default articoloSlice.reducer;
