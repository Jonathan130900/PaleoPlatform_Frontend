import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";
import { Discussione } from "../types/Discussione";
import { Topic } from "../types/Topic";

interface DiscussioniState {
  discussioni: Discussione[];
  topics: Topic[];
  discussione: Discussione | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DiscussioniState = {
  discussioni: [],
  topics: [],
  discussione: null,
  status: "idle",
  error: null,
};

export const fetchDiscussioni = createAsyncThunk(
  "discussioni/fetchDiscussioni",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/Discussioni/all");
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Errore nel prendere tutte le discussioni");
    }
  }
);

export const fetchTopics = createAsyncThunk(
  "discussioni/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/Topics/all");
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Errore nel prendere tutti i topics");
    }
  }
);

export const fetchDiscussioneById = createAsyncThunk(
  "discussioni/fetchDiscussioneById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/Discussioni/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Errore nel prendere la discussione");
    }
  }
);

export const createDiscussione = createAsyncThunk(
  "discussioni/createDiscussione",
  async (
    data: { titolo: string; contenuto: string; topicId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/Discussioni", data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Errore nel pubblicare la discussione");
    }
  }
);

export const voteOnDiscussion = createAsyncThunk(
  "discussioni/voteOnDiscussion",
  async (
    data: { discussionId: number; isUpvote: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `/Discussioni/${data.discussionId}/vota`,
        {
          isUpvote: data.isUpvote,
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Errore nel votare la discussione");
    }
  }
);

const discussioniSlice = createSlice({
  name: "discussioni",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscussioni.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchDiscussioni.fulfilled,
        (state, action: PayloadAction<Discussione[]>) => {
          state.status = "succeeded";
          state.discussioni = action.payload;
        }
      )
      .addCase(fetchDiscussioni.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        fetchTopics.fulfilled,
        (state, action: PayloadAction<Topic[]>) => {
          state.topics = action.payload;
        }
      )
      .addCase(fetchDiscussioneById.pending, (state) => {
        state.status = "loading";
        state.discussione = null;
      })
      .addCase(
        fetchDiscussioneById.fulfilled,
        (state, action: PayloadAction<Discussione>) => {
          state.status = "succeeded";
          state.discussione = action.payload;
        }
      )
      .addCase(fetchDiscussioneById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(
        createDiscussione.fulfilled,
        (state, action: PayloadAction<Discussione>) => {
          state.discussioni.unshift(action.payload);
        }
      )
      .addCase(
        voteOnDiscussion.fulfilled,
        (
          state,
          action: PayloadAction<{ upvotes: number; downvotes: number }> & {
            meta: { arg: { discussionId: number } };
          }
        ) => {
          const { upvotes, downvotes } = action.payload;
          if (state.discussione) {
            state.discussione.upvotes = upvotes;
            state.discussione.downvotes = downvotes;
          }
          state.discussioni = state.discussioni.map((d) => {
            if (d.id === action.meta.arg.discussionId) {
              return { ...d, upvotes, downvotes };
            }
            return d;
          });
        }
      );
  },
});

export default discussioniSlice.reducer;
