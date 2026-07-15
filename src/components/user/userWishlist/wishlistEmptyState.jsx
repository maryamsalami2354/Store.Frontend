// src/components/user/userWishlist/wishlistEmptyState.jsx
import React from 'react';
import { Heart } from 'react-feather';
import { Link } from 'react-router-dom';

const WishlistEmptyState = ({ hasSearch }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <Heart size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        {hasSearch ? (
            <>
                <p className="text-gray-500 dark:text-gray-400 mb-2">محصولی با این مشخصات یافت نشد</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">عبارت جستجو را تغییر دهید</p>
            </>
        ) : (
            <>
                <p className="text-gray-500 dark:text-gray-400 mb-4">لیست علاقه‌مندی‌های شما خالی است</p>
                <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition">
                    رفتن به فروشگاه
                </Link>
            </>
        )}
    </div>
);

export default WishlistEmptyState;