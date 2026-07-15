// =============================================================================
// FILE: userReturnsEmpty.jsx
// =============================================================================
import React from 'react';
import { RotateCcw, Package } from 'react-feather';

const UserReturnsEmpty = ({ hasFilter }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            {hasFilter ? <RotateCcw size={32} className="text-gray-400" /> : <Package size={32} className="text-gray-400" />}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {hasFilter ? 'درخواستی با این وضعیت یافت نشد' : 'درخواست مرجوعی ندارید'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {hasFilter ? 'فیلتر وضعیت را تغییر دهید.' : 'شما تاکنون درخواست مرجوعی ثبت نکرده‌اید.'}
        </p>
    </div>
);

export default UserReturnsEmpty;