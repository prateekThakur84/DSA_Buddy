import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";

export const fetchPlans = createAsyncThunk(
  "subscription/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/payment/plans");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch plans"
      );
    }
  }
);

export const fetchPaymentPages = createAsyncThunk(
  "subscription/fetchPaymentPages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/payment/payment-pages");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment pages"
      );
    }
  }
);

export const createSubscription = createAsyncThunk(
  "subscription/create",
  async ({ planType }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/payment/create-subscription", {
        planType,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create subscription"
      );
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "subscription/verifyPayment",
  async (paymentDetails, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/payment/verify-payment",
        paymentDetails
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Payment verification failed"
      );
    }
  }
);

export const getSubscriptionStatus = createAsyncThunk(
  "subscription/getStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/payment/subscription-status");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscription status"
      );
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  "subscription/cancel",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/payment/cancel-subscription");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel subscription"
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    plans: [],
    currentSubscription: null,
    usageLimits: null,
    isPremium: false,
    loading: false,
    error: null,
    paymentLoading: false,
    paymentSuccess: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSubscriptionState: (state) => {
      state.currentSubscription = null;
      state.usageLimits = null;
      state.isPremium = false;
      state.paymentSuccess = false;
    },
    setPaymentSuccess: (state, action) => {
      state.paymentSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload.plans;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubscription.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state) => {
        state.paymentLoading = false;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.isPremium = true;
        state.paymentSuccess = true;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSubscriptionStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload.subscription;
        state.usageLimits = action.payload.usageLimits;
        state.isPremium = action.payload.subscription.isPremium;
      })
      .addCase(getSubscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.loading = false;
        if (state.currentSubscription) {
          state.currentSubscription.status = "cancelled";
        }
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPaymentPages.fulfilled, (state, action) => {
        state.paymentPages = action.payload.paymentPages;
      });
  },
});

export const { clearError, resetSubscriptionState, setPaymentSuccess } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
