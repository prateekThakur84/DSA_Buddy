import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';

// Fetch Users (Paginated List)
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async ({ page = 1, search = '', role = 'all' }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/auth/admin/users`, {
        params: { page, search, role }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Update User Role
export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/auth/admin/users/${userId}/role`, { role });
      return { userId, role, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/auth/admin/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Delete failed');
    }
  }
);

// Fetch Single User Details (Profile + Stats)
export const fetchUserDetails = createAsyncThunk(
  'admin/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/auth/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    pagination: { current: 1, total: 1, totalRecords: 0 },
    currentUser: null, // Stores the specific user being viewed in detail
    userStats: null,   // Stores the stats for the detail view
    loading: false,
    error: null,
    actionLoading: null, // Stores ID of user currently being updated/deleted
  },
  reducers: {
    clearAdminError: (state) => { 
      state.error = null; 
    },
    // Used to clear data when unmounting the UserDetail page
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.userStats = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Users List ---
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // --- Update Role ---
      .addCase(updateUserRole.pending, (state, action) => {
        state.actionLoading = action.meta.arg.userId;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.actionLoading = null;
        // Update the user in the list if they exist there
        const userIndex = state.users.findIndex(u => u._id === action.payload.userId);
        if (userIndex !== -1) {
          state.users[userIndex].role = action.payload.role;
        }
        // Also update the currentUser if we are currently viewing them
        if (state.currentUser && state.currentUser._id === action.payload.userId) {
          state.currentUser.role = action.payload.role;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload;
      })

      // --- Delete User ---
      .addCase(deleteUser.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionLoading = null;
        state.users = state.users.filter(u => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload;
      })

      // --- Fetch User Details (Added) ---
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.userStats = action.payload.stats;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, clearCurrentUser } = adminSlice.actions;
export default adminSlice.reducer;