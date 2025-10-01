import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from '../utils/axios';

// Define User interface if not defined elsewhere
export interface User {
  _id: string;
  fullName: string;
  email: string;
  profile: string;
  password: string,
  status: 'active' | 'inactive' | 'blocked';
}

// Define the slice state shape
interface UserState {
  allUsers: User[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  allUsers: [],
  loading: false,
  error: null,
};

// Async thunk for fetching all users
export const fetchAllUser = createAsyncThunk<User[], void, { rejectValue: string }>(
  'user/fetchAllUser',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/auth/', { withCredentials: true });
      // Assuming the users data is in response.data.data
      return response.data.data as User[];
    } catch (error: any) {
      // Extract error message safely
      const message = error.response?.data?.message || error.message || 'Failed to fetch users';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const update = createAsyncThunk<
    User, // Return type of fulfilled
    FormData, // Accept FormData for file upload
    { rejectValue: string } // Custom error type
>(
    'auth/update',
    async (formData, thunkAPI) => {
        try {
            const _id = formData.get('_id');
            const res = await axios.put(`/auth/update/${_id}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.data;
        } catch (err: any) {
            console.error('Update failed:', err);
            const message = err.response?.data?.message || err.message || 'Update failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const create = createAsyncThunk<
    User, // Return type of fulfilled
    FormData, // Accept FormData for file upload
    { rejectValue: string } // Custom error type
>(
    'auth/create',
    async (formData, thunkAPI) => {
        try {
            const res = await axios.post(`/auth/create`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.data;
        } catch (err: any) {
            console.error('create failed:', err);
            const message = err.response?.data?.message || err.message || 'create failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // add any sync reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUser.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.allUsers = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      });
  },
});

export default userSlice.reducer;
