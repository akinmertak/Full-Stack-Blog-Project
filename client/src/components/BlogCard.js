'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BlogCard({ blog, index }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <Link href={`/blog/${blog._id}`}>
        <div className="relative h-52 overflow-hidden">
          <img 
            src={blog.coverImage || 'https://via.placeholder.com/800x400'} 
            alt={blog.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {blog.categories?.map(cat => (
              <span key={cat._id} className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-wider">
                {cat.name}
              </span>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors">
            {blog.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {/* HTML etiketlerini ve HTML entitylerini temizleyip sadece metni gösterelim */}
            {blog.content
              .replace(/<[^>]*>/g, '') // HTML taglerini temizle
              .replace(/&nbsp;/g, ' ') // &nbsp; boşluk karakterini temizle
              .replace(/&amp;/g, '&')  // &amp; karakterini & yap
              .replace(/&quot;/g, '"') // &quot; karakterini " yap
              .replace(/&#39;/g, "'")  // &#39; karakterini ' yap
              .replace(/&lt;/g, '<')   // &lt; karakterini < yap
              .replace(/&gt;/g, '>')   // &gt; karakterini > yap
              .substring(0, 100)}...
          </p>
          <div className="flex items-center justify-between border-t dark:border-gray-800 pt-4 mt-auto">
            <span className="text-xs text-gray-400 font-medium">
              {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
            </span>
            <span className="text-blue-500 text-xs font-bold uppercase tracking-widest group-hover:mr-2 transition-all">
              Oku
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}