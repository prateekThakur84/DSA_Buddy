import problemsReducer from './slices/problemsSlice';
import currentProblemReducer from './slices/currentProblemSlice';
import authReducer from './slices/authSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import adminReducer from './slices/adminSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemsReducer,        // Add this
    currentProblem: currentProblemReducer, // Add this
    subscription: subscriptionReducer,
    admin: adminReducer,
  },
});
