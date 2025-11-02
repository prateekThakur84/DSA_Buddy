import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";

// Fetch problem by ID (cached by problem ID)
export const fetchProblemById = createAsyncThunk(
  "currentProblem/fetchById",
  async (problemId, { getState, rejectWithValue }) => {
    try {
      const { cachedProblems } = getState().currentProblem;
      const cached = cachedProblems[problemId];
      const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return { cached: true, problemId, data: cached.data };
      }

      const response = await axiosClient.get(
        `/problem/problemById/${problemId}`
      );
      // console.log(response);

      return { cached: false, problemId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch problem"
      );
    }
  }
);

// Fetch submissions for a problem (cached by problem ID)
export const fetchSubmissions = createAsyncThunk(
  "currentProblem/fetchSubmissions",
  async (problemId, { getState, rejectWithValue }) => {
    try {
      const { cachedSubmissions } = getState().currentProblem;
      const cached = cachedSubmissions[problemId];
      const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return { cached: true, problemId, data: cached.data };
      }

      const response = await axiosClient.get(
        `/problem/submittedProblem/${problemId}`
      );

      // Handle new response format
      let submissions = [];
      const responseData = response.data;

      if (responseData.submissions && Array.isArray(responseData.submissions)) {
        submissions = responseData.submissions;
      } else if (Array.isArray(responseData)) {
        // Backward compatibility
        submissions = responseData;
      } else if (
        responseData === "No Submission is present" ||
        responseData.message === "No Submission is present"
      ) {
        submissions = [];
      }

      return { cached: false, problemId, data: submissions };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to fetch submissions"
      );
    }
  }
);

// Run code
export const runCode = createAsyncThunk(
  "currentProblem/runCode",
  async ({ problemId, code, language }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to run code"
      );
    }
  }
);

// Submit code
export const submitCode = createAsyncThunk(
  "currentProblem/submitCode",
  async ({ problemId, code, language }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code,
          language,
        }
      );

      // After successful submission, invalidate submissions cache
      dispatch(invalidateSubmissionsCache(problemId));

      return { problemId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit code"
      );
    }
  }
);

const currentProblemSlice = createSlice({
  name: "currentProblem",
  initialState: {
    cachedProblems: {},
    cachedSubmissions: {},
    currentProblemId: null,
    currentProblem: null,
    currentSubmissions: [],
    loading: false,
    submissionsLoading: false,
    runResult: null,
    submitResult: null,
    codeRunning: false,
    error: null,
  },
  reducers: {
    setCurrentProblem: (state, action) => {
      const problemId = action.payload;
      state.currentProblemId = problemId;

      if (state.cachedProblems[problemId]) {
        state.currentProblem = state.cachedProblems[problemId].data;
      }

      if (state.cachedSubmissions[problemId]) {
        state.currentSubmissions = state.cachedSubmissions[problemId].data;
      }
    },

    clearRunResult: (state) => {
      state.runResult = null;
    },
    clearSubmitResult: (state) => {
      state.submitResult = null;
    },
    clearResults: (state) => {
      state.runResult = null;
      state.submitResult = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    invalidateProblemCache: (state, action) => {
      const problemId = action.payload;
      if (state.cachedProblems[problemId]) {
        delete state.cachedProblems[problemId];
      }
    },

    invalidateSubmissionsCache: (state, action) => {
      const problemId = action.payload;
      if (state.cachedSubmissions[problemId]) {
        delete state.cachedSubmissions[problemId];
      }
    },

    clearAllCaches: (state) => {
      state.cachedProblems = {};
      state.cachedSubmissions = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Problem By ID
      .addCase(fetchProblemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblemById.fulfilled, (state, action) => {
        state.loading = false;
        const { cached, problemId, data } = action.payload;

        if (!cached) {
          state.cachedProblems[problemId] = {
            data,
            timestamp: Date.now(),
          };
        }

        state.currentProblemId = problemId;
        state.currentProblem = data;
      })
      .addCase(fetchProblemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Submissions
      .addCase(fetchSubmissions.pending, (state) => {
        state.submissionsLoading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.submissionsLoading = false;
        const { cached, problemId, data } = action.payload;

        if (!cached) {
          state.cachedSubmissions[problemId] = {
            data,
            timestamp: Date.now(),
          };
        }

        if (problemId === state.currentProblemId) {
          state.currentSubmissions = data;
        }
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.submissionsLoading = false;
        state.error = action.payload;
        state.currentSubmissions = [];
      })

      // Run Code
      .addCase(runCode.pending, (state) => {
        state.codeRunning = true;
        state.runResult = null;
        state.error = null;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.codeRunning = false;
        state.runResult = action.payload;
      })
      .addCase(runCode.rejected, (state, action) => {
        state.codeRunning = false;
        state.error = action.payload;
      })

      // Submit Code
      .addCase(submitCode.pending, (state) => {
        state.codeRunning = true;
        state.submitResult = null;
        state.error = null;
      })
      .addCase(submitCode.fulfilled, (state, action) => {
        state.codeRunning = false;
        state.submitResult = action.payload.data;
      })
      .addCase(submitCode.rejected, (state, action) => {
        state.codeRunning = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentProblem,
  clearRunResult,
  clearSubmitResult,
  clearResults,
  clearError,
  invalidateProblemCache,
  invalidateSubmissionsCache,
  clearAllCaches,
} = currentProblemSlice.actions;

export default currentProblemSlice.reducer;
