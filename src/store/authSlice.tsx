import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from '../utils/axios';

// User interface
interface User {
    id: string;
    fullName: string;
    email: string;
    profile: string;
    status: 'active' | 'inactive' | 'blocked';
}

// Auth state
interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

// ✅ Async thunk with typed return and argument
export const login = createAsyncThunk<
    User, // Return type of fulfilled
    { email: string; password: string }, // Arguments passed in login()
    { rejectValue: string } // Custom error type
>('auth/login', async (credentials, thunkAPI) => {
    try {
        const res = await axios.post('/auth/login', credentials, {
            withCredentials: true,
        });

        // Assume user data is in res.data.data
        return res.data.data as User;
    } catch (err: any) {
        console.error('Login failed:', err);

        // Extract error message safely
        const message = err.response?.data?.message || err.message || 'Login failed';

        return thunkAPI.rejectWithValue(message);
    }
});

export const fetch = createAsyncThunk<User, void, { rejectValue: string }>('auth/me', async (__, thunkAPI) => {
    try {
        const res = await axios.get('/auth/me', { withCredentials: true });
        return res.data.data as User;
    } catch (error: any) {
        console.log(error);
        const message = error.response?.data?.message || error.message || 'Login failed';
        return thunkAPI.rejectWithValue(message);
    }
});



export const logout = createAsyncThunk<User, void, { rejectValue: string }>('auth/logout', async (__, thunkAPI) => {
    try {
        const res = await axios.post('/auth/logout', { withCredentials: true });
        return res.data.data as User;
    } catch (error: any) {
        console.log(error);
        const message = error.response?.data?.message || error.message || 'Login failed';
        return thunkAPI.rejectWithValue(message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
            })
            .addCase(fetch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetch.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(fetch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
            });
    },
});

export default authSlice.reducer;
