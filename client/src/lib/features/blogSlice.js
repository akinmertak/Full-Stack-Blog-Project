import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

const API_URL = '/blogs';

// Thunk: Blogları Getir
export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async (search) => {
  const params = {};
  if (search) params.search = search;
  const response = await axios.get(API_URL, { params });
  return response.data;
});

const blogSlice = createSlice({
  name: 'blogs',
  initialState: { items: [], currentBlog: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Blogs
      .addCase(fetchBlogs.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch Single Blog
      .addCase(fetchBlogById.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentBlog = action.payload.blog; // Backend { blog, similarBlogs } dönüyor
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create Blog
      .addCase(createBlog.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Delete Blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.items = state.items.filter(blog => blog._id !== action.payload);
      })
      // Update Blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.items.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentBlog && state.currentBlog._id === action.payload._id) {
          state.currentBlog = action.payload;
        }
      });
  },
});

// Thunk: Tekil Blog Getir
export const fetchBlogById = createAsyncThunk('blogs/fetchById', async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
});

// Thunk: Blog Beğen
export const likeBlog = createAsyncThunk('blogs/like', async (id) => {
  const response = await axios.post(`${API_URL}/${id}/like`);
  return response.data; // Yeni beğeni sayısını döner
});

// Thunk: Yorum Ekle
export const addComment = createAsyncThunk('blogs/addComment', async ({ id, text }) => {
  const response = await axios.post(`${API_URL}/${id}/comments`, { text });
  return response.data;
});

export const deleteBlog = createAsyncThunk('blogs/delete', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id; // Silinen id'yi dön ki state'den çıkaralım
});

// Thunk: Blog Güncelle
export const updateBlog = createAsyncThunk('blogs/update', async ({ id, blogData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, blogData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Thunk: Yeni Blog Ekle
export const createBlog = createAsyncThunk('blogs/create', async (blogData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, blogData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export default blogSlice.reducer;