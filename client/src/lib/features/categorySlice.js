import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

const API_URL = '/categories';

// Thunk: Kategorileri Getir
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

// Thunk: Yeni Kategori Ekle
export const createCategory = createAsyncThunk('categories/create', async (categoryData, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, categoryData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const categorySlice = createSlice({
    name: 'categories',
    initialState: { items: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Categories
            .addCase(fetchCategories.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Create Category
            .addCase(createCategory.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default categorySlice.reducer;
