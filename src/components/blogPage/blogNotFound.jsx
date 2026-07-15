// =============================================================================
// FILE: blogNotFound.jsx
// =============================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'react-feather';

const BlogNotFound = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">مقاله یافت نشد</h2>
            <Link to="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl text-sm font-medium">
                بازگشت به بلاگ
            </Link>
        </div>
    </div>
);

export default BlogNotFound;