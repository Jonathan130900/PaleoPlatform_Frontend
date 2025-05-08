import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Articolo } from "../types/Articolo";

interface ArticoliState {
  articoli: Articolo[];
  articoloDettaglio: Articolo | null;
  loading: boolean;
  error: string | null;
}

const initialState: ArticoliState = {
  articoli: [],
  articoloDettaglio: null,
  loading: false,
  error: null,
};

export const fetchArticoli = createAsyncThunk("articoli/fetch", async () => {
  const response = await axios.get<Articolo[]>(
    "https://localhost:7224/api/articoli"
  );
  return response.data;
});

export const fetchArticoloById = createAsyncThunk(
  "articoli/fetchArticoloById",
  async (id: number) => {
    const response = await axios.get<Articolo>(
      `https://localhost:7224/api/articoli/${id}`
    );
    return response.data;
  }
);

const articoloSlice = createSlice({
  name: "articoli",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all articoli
      .addCase(fetchArticoli.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchArticoli.fulfilled,
        (state, action: PayloadAction<Articolo[]>) => {
          state.loading = false;
          state.articoli = action.payload;
        }
      )
      .addCase(fetchArticoli.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Errore nel caricamento articoli";
      })

      // Fetch single articolo by ID
      .addCase(fetchArticoloById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.articoloDettaglio = null;
      })
      .addCase(
        fetchArticoloById.fulfilled,
        (state, action: PayloadAction<Articolo>) => {
          state.loading = false;
          state.articoloDettaglio = action.payload;
        }
      )
      .addCase(fetchArticoloById.rejected, (state, action) => {
        state.loading = false;
        state.articoloDettaglio = null;
        state.error = action.error.message || "Errore nel caricamento articolo";
      });
  },
});

export default articoloSlice.reducer;
