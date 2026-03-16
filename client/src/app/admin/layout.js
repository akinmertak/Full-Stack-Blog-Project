import AdminGuard from "@/components/AdminGuard";
import Link from "next/link";
import { LayoutDashboard, FileText, FolderTree, Users, LogOut } from "lucide-react";

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold mb-8 text-blue-600">Admin Panel</h2>
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <LayoutDashboard size={20}/> Dashboard
            </Link>
            <Link href="/admin/blogs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <FileText size={20}/> Bloglar
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <FolderTree size={20}/> Kategoriler
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}