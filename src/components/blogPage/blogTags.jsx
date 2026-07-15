// =============================================================================
// FILE: blogTags.jsx
// =============================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'react-feather';

const BlogTags = ({ tags = [] }) => {
    if (!tags.length) return null;

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
                <Tag size={14} className="text-gray-400" />
                {tags.map(tag => (
                    <Link
                        key={tag}
                        to={`/blog?tag=${tag}`}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-lg hover:bg-[#002874]/10 dark:hover:bg-[#4C6FB6]/20 hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors"
                    >
                        {tag}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BlogTags;