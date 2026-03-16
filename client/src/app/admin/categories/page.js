'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory } from '@/lib/features/categorySlice';

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { items: categories, status, error } = useSelector((state) => state.categories);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    await dispatch(createCategory({ name: newCategory }));
    setNewCategory('');
    // Re-fetch or just rely on state update if reducer handles it
    dispatch(fetchCategories()); 
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kategoriler</h1>

      {/* Yeni Kategori Ekleme Formu */}
      <form onSubmit={handleAddCategory} className="mb-8 flex gap-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Yeni Kategori Adı"
          className="p-2 border rounded flex-1 dark:bg-gray-800 dark:border-gray-700"
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ekle
        </button>
      </form>

      {/* Kategori Listesi */}
      {status === 'loading' && <p>Yükleniyor...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category._id} className="p-4 bg-white dark:bg-gray-900 rounded shadow border dark:border-gray-800 flex justify-between items-center">
            <span className="font-medium">{category.name}</span>
            {/* Silme/Düzenleme butonları eklenebilir */}
          </div>
        ))}
        {categories.length === 0 && status === 'succeeded' && (
          <p className="text-gray-500">Henüz kategori bulunmuyor.</p>
        )}
      </div>
    </div>
  );
}
