import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'react-feather';

const CategoryNotFound = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">دسته‌بندی یافت نشد</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">دسته‌بندی مورد نظر شما موجود نیست.</p>
            <Link to="/categories" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] transition-colors">
                مشاهده همه دسته‌بندی‌ها
            </Link>
        </div>
    </div>
);

export default CategoryNotFound;