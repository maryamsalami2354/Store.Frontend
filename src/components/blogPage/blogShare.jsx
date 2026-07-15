// =============================================================================
// FILE: blogShare.jsx
// =============================================================================
import React from 'react';
import { Link, Copy, Twitter, Send } from 'react-feather';

const BlogShare = ({ post, onShare }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-white">اشتراک‌گذاری</span>
            <div className="flex items-center gap-2">
                <button onClick={onShare} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-[#002874]/10 dark:hover:bg-[#4C6FB6]/20 hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors">
                    <Copy size={16} />
                </button>
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors">
                    <Twitter size={16} />
                </button>
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors">
                    <Send size={16} />
                </button>
            </div>
        </div>
    </div>
);

export default BlogShare;