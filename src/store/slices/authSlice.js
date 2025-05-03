import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/api';

const getUserDataFromStorage = () => {
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  isAuthenticated: !!localStorage.getItem('auth_token'),
  userType: localStorage.getItem('user_type') || null,
  userData: getUserDataFromStorage(),
  isLoading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.signIn(credentials);
      
      let userType = null;
      if (response.data.data?.user?.role === 'school_admin') {
        userType = 'school';
      } else if (response.data.data?.user?.role === 'company_admin') {
        userType = 'company';
      } else if (response.data.data?.school) {
        userType = 'school';
      } else if (response.data.data?.company) {
        userType = 'company';
      } else {
        userType = 'school';
      }
      
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_type', userType);
      localStorage.setItem('user_data', JSON.stringify(response.data.data));
      
      return {
        token: response.data.token,
        userType,
        userData: response.data.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to sign in';
      return rejectWithValue(errorMessage);
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await authService.signUp(formData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to sign up';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_data');
      return null;
    } catch (error) {
      return rejectWithValue('Failed to logout');
    }
  }
);

export const verifyUser = createAsyncThunk(
  'auth/verifyUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getMe();
      
      const storedUserData = getUserDataFromStorage();
      const currentUserId = storedUserData?.user?.id;
      
      if (!currentUserId || currentUserId !== response.data.user.id) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_data');
        return rejectWithValue('User session invalid');
      }
      
      return response.data;
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_data');
      return rejectWithValue('Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.userType = action.payload.userType;
        state.userData = action.payload.userData;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.userType = null;
        state.userData = null;
      })
      .addCase(verifyUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.userType = null;
        state.userData = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
