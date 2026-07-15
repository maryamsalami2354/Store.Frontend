// =============================================================================
// FILE: blogComments.jsx
// =============================================================================
import React, { useState } from 'react';
import { MessageCircle, User, Send } from 'react-feather';

const sampleComments = [
    { id: 1, name: 'علی', avatar: '', text: 'مقاله خیلی مفیدی بود. ممنون از شما.', date: '۱۴۰۴/۰۱/۲۵' },
    { id: 2, name: 'مریم', avatar: '', text: 'لطفاً در مورد موضوعات بیشتری بنویسید.', date: '۱۴۰۴/۰۱/۲۶' },
];

const BlogComments = ({ post, onSubmit }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            onSubmit();
            setCommentText('');
        }
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageCircle size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
                نظرات ({post.comments || 0})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#002874]/10 dark:bg-[#4C6FB6]/20 flex items-center justify-center flex-shrink-0">
                        <User size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
                    </div>
                    <div className="flex-1">
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="نظر خود را بنویسید..."
                rows={3}
                className="w-full p-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent resize-none"
            />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={14} />
                            ارسال نظر
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {sampleComments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{comment.name[0]}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{comment.name}</span>
                                <span className="text-xs text-gray-400 dark:text-gray-500">{comment.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogComments;