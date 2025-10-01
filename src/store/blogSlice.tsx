import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../utils/axios';

export interface Blog {
    _id: string;
    blogTitle: string;
    blogDescription: string;
    createdBy: {
        fullName: string;
        _id: string;
    }; // Assuming ObjectId is represented as string in frontend
    slugName: string;
    blogImage: string;
    blogBanner: string;
    blogSeoDetails: {
        _id: string,
    }
}

// Slice State
interface BlogState {
    allBlogs: Blog[];
    loading: boolean;
    error: string | null;
}

// Initial State
const initialState: BlogState = {
    allBlogs: [],
    loading: false,
    error: null,
};

export const fetchAllBlogs = createAsyncThunk<Blog[], void, { rejectValue: string }>('blog/fetchAllBlogs', async (__, thunkAPI) => {
    try {
        const response = await axios.get('/blogs/', { withCredentials: true });
        return response.data.data as Blog[];
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch Blogs';
        return thunkAPI.rejectWithValue(message);
    }
});

export const create = createAsyncThunk<
    Blog, // Return type of fulfilled
    FormData, // Accept FormData for file upload
    { rejectValue: string } // Custom error type
>('auth/create', async (formData, thunkAPI) => {
    try {
        const res = await axios.post(`/blogs/createBlog`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.data;
    } catch (err: any) {
        console.error('create failed:', err);
        const message = err.response?.data?.message || err.message || 'create failed';
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateBlog = createAsyncThunk<
    Blog, // Return type of fulfilled
    FormData, // Accept FormData for file upload
    { rejectValue: string } // Custom error type
>('blog/update', async (formData, thunkAPI) => {
    try {
        const _id = formData.get('_id');
        const res = await axios.put(`/blogs/updateBlog/${_id}`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.data;
    } catch (err: any) {
        console.error('Update failed:', err);
        const message = err.response?.data?.message || err.message || 'Update failed';
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteBlog = createAsyncThunk<
    Blog, // Return type of fulfilled // Accept  for id in string
    { rejectValue: string } // Custom error type
>('blog/delete', async (id, thunkAPI) => {
    try {
        const res = await axios.delete(`/blogs/deleteBlog/${id}`, {
            withCredentials: true,
        });
        return res.data.data;
    } catch (err: any) {
        console.error('Update failed:', err);
        const message = err.response?.data?.message || err.message || 'Delete failed';
        return thunkAPI.rejectWithValue(message);
    }
});

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.allBlogs = action.payload;
            })
            .addCase(fetchAllBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'failed to fetch blogs';
            });
    },
});

export default blogSlice.reducer;
