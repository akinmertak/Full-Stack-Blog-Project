'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog } from '@/lib/features/blogSlice';
import { fetchCategories } from '@/lib/features/categorySlice';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // Editör stilleri

// SSR (Server Side Rendering) hatasını önlemek için editörü dinamik import ediyoruz
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function NewBlog() {
  const [formData, setFormData] = useState({
    title: '',
    coverImage: '',
    categories: [],
    tags: ''
  });
  const [content, setContent] = useState('');
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.blogs);
  const { items: categoriesList } = useSelector((state) => state.categories || { items: [] });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogData = { 
      ...formData, 
      content, 
      tags: formData.tags.split(',').map(tag => tag.trim()) 
    };
    
    const result = await dispatch(createBlog(blogData));
    if (result.meta.requestStatus === 'fulfilled') {
      router.push('/admin'); // Başarılıysa listeye dön
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Yeni Blog Yazısı</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm">
        {/* Başlık */}
        <div>
          <label className="block text-sm font-medium mb-2">Yazı Başlığı</label>
          <input 
            type="text"
            className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Etkileyici bir başlık girin..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        {/* Kapak Resmi URL */}
        <div>
          <label className="block text-sm font-medium mb-2">Kapak Resmi URL</label>
          <input 
            type="text"
            className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://images.unsplash.com/..."
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            required
          />
        </div>

        {/* Kategoriler */}
        <div>
          <label className="block text-sm font-medium mb-2">Kategoriler</label>
          <select 
            multiple
            className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 h-32"
            value={formData.categories}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setFormData({ ...formData, categories: selected });
            }}
          >
            {categoriesList?.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Birden fazla seçim yapmak için Ctrl (Windows) veya Cmd (Mac) tuşuna basılı tutun.</p>
        </div>

        {/* Zengin Metin Editörü (Quill) */}
        <div>
          <label className="block text-sm font-medium mb-2">İçerik</label>
          <div className="h-80 mb-12">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent}
              className="h-full rounded-xl overflow-hidden"
            />
          </div>
        </div>

        {/* Etiketler */}
        <div>
          <label className="block text-sm font-medium mb-2">Etiketler (Virgülle ayırın)</label>
          <input 
            type="text"
            className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="yazılım, teknoloji, rehber"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
        >
          {loading ? 'Yayınlanıyor...' : 'Yazıyı Yayınla'}
        </button>
      </form>
    </div>
  );
}