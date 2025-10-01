import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../utils/axios';

export interface Seo {
    // SEO
    _id: string;
    page_title: string;
    metaTitle: string,
    createdBy: {
        _id: string,
        fullName: string,
    };
    metaDes: string;
    metaKeywords: string;
    cannicalUrl: string;
    ogTitle: string;
    ogDes: string;
    OgImageUrl: string;
    OgType: string;
    OgImageType: string;
    OgImageWidth: string;
    OgImageHeight: string;
    hreflang: string;
    mobileFriendly: string;
    xmlSitemap: string;
    ampUrl: string;
    copyright: boolean;
    contentAuthor: number;
    googleSiteVerification: boolean;
    schemaMaprkup: string;
    cspHeader: string;
    enableHTTP3: boolean;
    enableBrotli: boolean;
    securityTxt: string;
    robotsMeta: {
        index: boolean;
        follow: boolean;
    };
}

// Slice State
interface SeoState {
    allSeos: Seo[];
    loading: boolean;
    error: string | null;
}

const initialState: SeoState = {
    allSeos: [],
    loading: false,
    error: null,
};

export const fetchAllSeo = createAsyncThunk<Seo[], void, { rejectValue: string }>('blog/fetchAllSeo', async (__, thunkAPI) => {
    try {
        const response = await axios.get('/seo/getAllSeos', { withCredentials: true });
        return response.data.data as Seo[];
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch Blogs';
        return thunkAPI.rejectWithValue(message);
    }
});

export const createSeo = createAsyncThunk<
    Seo, // Return type of fulfilled
    { data: Seo},
    { rejectValue: string } // Custom error type
>('seo/create', async (data, thunkAPI) => {
    try {
        console.log(data)
        const res = await axios.post(`/seo/create`, data, {
            withCredentials: true,
        });
        return res.data.data;
    } catch (err: any) {
        console.error('create failed:', err);
        const message = err.response?.data?.message || err.message || 'create failed';
        return thunkAPI.rejectWithValue(message);
    }
});
export const updateSeo = createAsyncThunk<
    Seo, // Return type of fulfilled
    { id: string, data: Seo },
    { rejectValue: string } // Custom error type
>('seo/update', async ({id, data}, thunkAPI) => {
    try {
        const res = await axios.put(`/seo/updateSeo/${id}`, data, {
            withCredentials: true,
        });
        return res.data.data;
    } catch (err: any) {
        console.error('create failed:', err);
        const message = err.response?.data?.message || err.message || 'create failed';
        return thunkAPI.rejectWithValue(message);
    }
});
export const deleteSeo = createAsyncThunk<
    Seo, // Return type of fulfilled
    { rejectValue: string } // Custom error type
>('seo/delete', async (id, thunkAPI) => {
    try {
        const res = await axios.delete(`/seo/deleteSeo/${id}`, {
            withCredentials: true,
        });
        return res.data.data;
    } catch (err: any) {
        console.error('create failed:', err);
        const message = err.response?.data?.message || err.message || 'create failed';
        return thunkAPI.rejectWithValue(message);
    }
});


const seoSlice = createSlice({
    name:'seo',
    initialState,
    reducers:{},
    extraReducers: (builder) =>{
        builder
        .addCase(fetchAllSeo.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllSeo.fulfilled,(state, action)=>{
            state.loading = false;
            state.allSeos = action.payload;
        })
        .addCase(fetchAllSeo.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || "failed to fetch Seos";
        })
    }
})

export default seoSlice.reducer;