import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from './slices/jobsSlice';

// Add other reducers as needed
const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    // other reducers...
  },
});

export default store;