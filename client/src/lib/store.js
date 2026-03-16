import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './features/blogSlice';
import authReducer from './features/authSlice';
import categoryReducer from './features/categorySlice';

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    auth: authReducer,
    categories: categoryReducer,
  },
});