'use client';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/lib/features/authSlice';
import { LogOut, User, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
// 1. ADIM: ThemeToggle bileşenini içe aktar
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // URL'deki search parametresini input'a yansıt
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  // Debounce işlemi
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Debounced term değiştiğinde URL'i güncelle
  useEffect(() => {
    if (debouncedTerm !== (searchParams.get('search') || '')) {
      if (debouncedTerm) {
        router.push(`/?search=${debouncedTerm}`);
      } else {
        router.push('/');
      }
    }
  }, [debouncedTerm, router, searchParams]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Blog Sayfası
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1.5 w-1/3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Bloglarda ara..."
            className="bg-transparent border-none outline-none px-2 w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Auth Buttons & Theme Toggle */}
        <div className="flex items-center gap-4">

          {/* 2. ADIM: Butonu tam buraya, Auth kontrollerinin başına koyuyoruz */}
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-4 border-l dark:border-gray-700 pl-4">
              <Link href="/admin" className="text-sm font-medium hover:text-blue-500 transition">Panel</Link>
              <button
                onClick={() => dispatch(logout())}
                className="flex items-center gap-1 text-red-500 text-sm font-medium"
              >
                <LogOut size={16} /> Çıkış
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium hover:text-blue-500 transition px-2">
                Giriş Yap
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition">
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}