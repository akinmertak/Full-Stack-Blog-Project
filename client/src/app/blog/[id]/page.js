'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchBlogById, likeBlog, addComment } from '@/lib/features/blogSlice';
import Navbar from '@/components/Navbar';
import { Heart, MessageCircle, Calendar, User as UserIcon } from 'lucide-react';

export default function BlogDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBlog: blog, status } = useSelector((state) => state.blogs);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    dispatch(fetchBlogById(id));
  }, [id, dispatch]);

  if (status === 'loading' || !blog) return <div className="text-center py-20">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <article className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex gap-2 mb-4 justify-center">
            {blog.categories?.map(cat => (
              <span key={cat._id} className="text-blue-600 font-bold text-xs uppercase">{cat.name}</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{blog.title}</h1>
          <div className="flex items-center gap-6 text-gray-500 text-sm justify-center">
            <div className="flex items-center gap-2"><UserIcon size={16} /> {blog.author?.username}</div>
            <div className="flex items-center gap-2"><Calendar size={16} /> {new Date(blog.createdAt).toLocaleDateString()}</div>
          </div>
        </header>

        {/* Cover Image */}
        <img src={blog.coverImage} alt={blog.title} className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl mb-12 shadow-2xl" />

        {/* Content - HTML Render */}
        <div
          className="prose prose-lg md:prose-xl dark:prose-invert w-full max-w-4xl mx-auto mb-12 px-4 break-words 
             [&_p]:inline [&_p]:mr-1 [&_div]:inline [&_div]:mr-1"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <hr className="dark:border-gray-800 mb-8" />

        {/* Interactions */}
        <div className="flex items-center gap-8 mb-12">
          <button
            onClick={() => dispatch(likeBlog(id))}
            className="flex items-center gap-2 group"
          >
            <Heart className="group-hover:text-red-500 transition-colors" />
            <span className="font-bold">{blog.likes?.length || 0} Beğeni</span>
          </button>
          <div className="flex items-center gap-2">
            <MessageCircle />
            <span className="font-bold">{blog.comments?.length || 0} Yorum</span>
          </div>
        </div>

        {/* Yorumlar Bölümü */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Yorumlar</h3>
          <div className="space-y-6 mb-8">
            {blog.comments?.map((c, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                <p className="font-bold text-sm mb-1">{c.user?.username || 'Ziyaretçi'}</p>
                <p className="text-gray-600 dark:text-gray-400">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <textarea
              placeholder="Fikrini paylaş..."
              className="w-full p-4 rounded-xl border dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              onClick={() => {
                dispatch(addComment({ id, text: commentText }));
                setCommentText('');
              }}
              className="bg-black dark:bg-white dark:text-black text-white py-3 px-8 rounded-full font-bold self-end"
            >
              Gönder
            </button>
          </div>
        </section>
      </article>
    </div>
  );
}