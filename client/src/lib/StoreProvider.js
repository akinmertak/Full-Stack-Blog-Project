'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store'; // Kendi oluşturduğun store'u içe aktar

export default function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}