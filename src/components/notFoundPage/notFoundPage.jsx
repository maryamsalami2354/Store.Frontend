// =============================================================================
// FILE: notFoundPage.jsx
// =============================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Frown } from 'react-feather';

const NotFoundPage = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center max-w-lg">

            {/* 404 Number */}
            <div className="relative inline-block mb-6">
                <h1 className="text-[120px] sm:text-[160px] font-extrabold leading-none text-[#002874]/10 dark:text-[#4C6FB6]/10 select-none">
                    ۴۰۴
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Frown size={64} className="text-[#002874] dark:text-[#4C6FB6] opacity-40" />
                </div>
            </div>

            {/* Message */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                صفحه‌ای پیدا نشد!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد، حذف شده یا آدرس آن تغییر کرده است.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                    to="/"
                    className="flex items-center gap-2 px-6 py-3 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] transition-colors w-full sm:w-auto justify-center"
                >
                    <Home size={18} />
                    بازگشت به خانه
                </Link>
                <Link
                    to="/search"
                    className="flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center"
                >
                    <Search size={18} />
                    جستجوی محصولات
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-6 py-3 text-gray-500 dark:text-gray-400 hover:text-[#002874] dark:hover:text-[#4C6FB6] rounded-xl font-medium text-sm transition-colors w-full sm:w-auto justify-center"
                >
                    <ArrowLeft size={18} />
                    صفحه قبل
                </button>
            </div>

            {/* Quick Links */}
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">صفحات پرطرفدار:</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {[
                        { to: '/amazing', label: 'شگفت‌انگیز' },
                        { to: '/most-viewed', label: 'پربازدید' },
                        { to: '/brands', label: 'برندها' },
                        { to: '/categories', label: 'دسته‌بندی‌ها' },
                        { to: '/blog', label: 'بلاگ' },
                        { to: '/contact', label: 'تماس با ما' },
                    ].map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-600 dark:text-gray-400 hover:border-[#002874]/30 hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    </div>
);

export default NotFoundPage;