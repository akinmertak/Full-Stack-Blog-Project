'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '@/lib/features/blogSlice';
import BlogCard from '@/components/BlogCard';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const dispatch = useDispatch();
  const { items: blogs, status } = useSelector((state) => state.blogs);
  const searchParams = useSearchParams();
  const search = searchParams.get('search');

  useEffect(() => {
    dispatch(fetchBlogs(search || ''));
  }, [dispatch, search]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950" PageTransition >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold mb-4">En Son Yazılar</h1>
          <p className="text-gray-500">Teknoloji ve yazılım dünyasından güncel içerikler.</p>
        </header>

        {/* Blog Grid */}
        {status === 'loading' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}