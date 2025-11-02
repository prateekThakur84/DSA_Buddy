import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";

// Fetch all problems (cached)
export const fetchAllProblems = createAsyncThunk(
  "problems/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    
    try {
      // Check if we already have problems and they're fresh
      const { problems, lastFetched } = getState().problems;
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
      
      // console.log("calling problem/getAllproblems");
      if (
        problems.length > 0 &&
        lastFetched &&
        Date.now() - lastFetched < CACHE_DURATION
      ) {
        return { cached: true, data: problems };
      }


      const response = await axiosClient.get("/problem/getAllProblem");
      // console.log(response);
      
      return { cached: false, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch problems"
      );
    }
  }
);

// Fetch solved problems (cached)
export const fetchSolvedProblems = createAsyncThunk(
  "problems/fetchSolved",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Check cache
      const { solvedProblems, solvedLastFetched } = getState().problems;
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

      if (
        solvedProblems.length > 0 &&
        solvedLastFetched &&
        Date.now() - solvedLastFetched < CACHE_DURATION
      ) {
        return { cached: true, data: solvedProblems };
      }

      const response = await axiosClient.get("/problem/problemSolvedByUser");
      const solvedIds = response.data.map((problem) => problem._id);
      return { cached: false, data: solvedIds };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch solved problems"
      );
    }
  }
);

const problemsSlice = createSlice({
  name: "problems",
  initialState: {
    problems: [],
    solvedProblems: [],
    loading: false,
    error: null,
    lastFetched: null,
    solvedLastFetched: null,
  },
  reducers: {
    clearProblems: (state) => {
      state.problems = [];
      state.lastFetched = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Manually mark a problem as solved (optimistic update)
    markProblemSolved: (state, action) => {
      if (!state.solvedProblems.includes(action.payload)) {
        state.solvedProblems.push(action.payload);
      }
    },
    // Force refresh (clear cache timestamps)
    invalidateCache: (state) => {
      state.lastFetched = null;
      state.solvedLastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Problems
      .addCase(fetchAllProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProblems.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cached) {
          state.problems = action.payload.data;
          state.lastFetched = Date.now();
        }
      })
      .addCase(fetchAllProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Solved Problems
      .addCase(fetchSolvedProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolvedProblems.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.cached) {
          state.solvedProblems = action.payload.data;
          state.solvedLastFetched = Date.now();
        }
      })
      .addCase(fetchSolvedProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProblems, clearError, markProblemSolved, invalidateCache } =
  problemsSlice.actions;

export default problemsSlice.reducer;
