// =============================================================================
// FILE: blogRelatedPosts.jsx
// =============================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Clock, Eye } from 'react-feather';

const BlogRelatedPosts = ({ posts = [] }) => {
    if (!posts.length) return null;

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-[#002874] dark:bg-[#4C6FB6] rounded-full"></span>
                مقالات مرتبط
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {posts.map(p => (
                    <Link key={p.id} to={`/blog/${p.id}`} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors">
                        <img src={p.coverImage} alt={p.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                        <div className="min-w-0">
                            <h4 className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors">{p.title}</h4>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                                <span className="flex items-center gap-1"><Clock size={10} />{p.readTime} دقیقه</span>
                                <span className="flex items-center gap-1"><Eye size={10} />{p.views.toLocaleString('fa-IR')}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BlogRelatedPosts;