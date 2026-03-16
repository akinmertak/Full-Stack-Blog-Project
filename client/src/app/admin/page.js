'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, deleteBlog } from '@/lib/features/blogSlice';
import { Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { items: blogs } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      dispatch(deleteBlog(id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Yönetimi</h1>
        <Link href="/admin/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={20}/> Yeni Yazı Ekle
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 text-sm">
            <tr>
              <th className="p-4">Başlık</th>
              <th className="p-4">Tarih</th>
              <th className="p-4">Durum</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <td className="p-4 font-medium">{blog.title}</td>
                <td className="p-4 text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase">Yayında</span>
                </td>
                <td className="p-4 text-right flex justify-end gap-3">
                  <button className="text-blue-500 hover:text-blue-700"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(blog._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}