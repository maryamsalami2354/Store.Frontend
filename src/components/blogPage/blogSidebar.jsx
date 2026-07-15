// =============================================================================
// FILE: blogSidebar.jsx
// =============================================================================
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Clock, Eye, TrendingUp } from 'react-feather';

const BlogSidebar = ({ post, categories = [], allPosts = [] }) => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');

    // هندلر سرچ - با Enter یا دکمه
    const handleSearch = () => {
        if (searchInput.trim()) {
            navigate(`/blogs?q=${encodeURIComponent(searchInput.trim())}`);
            setSearchInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const popularPosts = useMemo(() => {
        return [...allPosts]
            .filter(p => p.id !== post?.id)
            .sort((a, b) => b.views - a.views)
            .slice(0, 4);
    }, [allPosts, post]);

    const recentPosts = useMemo(() => {
        return [...allPosts]
            .filter(p => p.id !== post?.id)
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 3);
    }, [allPosts, post]);

    return (
        <div className="space-y-4">

            {/* Search */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="جستجو در مقالات..."
                        className="w-full py-2.5 pr-10 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#002874] text-white hover:bg-[#001d5a] transition-colors"
                    >
                        <Search size={14} />
                    </button>
                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-[#002874] dark:bg-[#4C6FB6] rounded-full"></span>
                    دسته‌بندی‌ها
                </h3>
                <div className="space-y-1">
                    {categories.slice(0, 6).map(cat => (
                        <Link
                            key={cat.id}
                            to={`/blogs?category=${cat.slug}`}
                            className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm transition-colors ${
                                post?.categorySlug === cat.slug
                                    ? 'bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874] dark:text-[#4C6FB6] font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            <span>{cat.name}</span>
                            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">{cat.count}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#002874] dark:text-[#4C6FB6]" />
                    پرطرفدارترین
                </h3>
                <div className="space-y-3">
                    {popularPosts.map((p, idx) => (
                        <Link key={p.id} to={`/blog/${p.id}`} className="flex gap-3 group">
              <span className="text-2xl font-extrabold text-gray-200 dark:text-gray-700 flex-shrink-0 leading-none">
                {idx + 1}
              </span>
                            <div className="min-w-0">
                                <h4 className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors">
                                    {p.title}
                                </h4>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <Eye size={10} /> {p.views.toLocaleString('fa-IR')}
                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-[#002874] dark:text-[#4C6FB6]" />
                    جدیدترین
                </h3>
                <div className="space-y-3">
                    {recentPosts.map(p => (
                        <Link key={p.id} to={`/blog/${p.id}`} className="flex gap-3 group">
                            <img src={p.coverImage} alt={p.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                            <div className="min-w-0">
                                <h4 className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors">
                                    {p.title}
                                </h4>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 block">
                  {new Date(p.publishedAt).toLocaleDateString('fa-IR')}
                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default BlogSidebar;