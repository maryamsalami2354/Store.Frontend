// =============================================================================
// FILE: userGiftCardsEmpty.jsx
// =============================================================================
import React from 'react';
import { Gift, RotateCcw } from 'react-feather';

const UserGiftCardsEmpty = ({ hasFilter }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            {hasFilter ? <RotateCcw size={32} className="text-gray-400" /> : <Gift size={32} className="text-gray-400" />}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {hasFilter ? 'کارت هدیه‌ای با این وضعیت یافت نشد' : 'کارت هدیه‌ای ندارید'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {hasFilter ? 'فیلتر وضعیت را تغییر دهید.' : 'می‌توانید برای دوستان خود کارت هدیه ارسال کنید.'}
        </p>
    </div>
);

export default UserGiftCardsEmpty;