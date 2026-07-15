// =============================================================================
// FILE: sellerTicketsEmpty.jsx
// =============================================================================
import React from 'react';
import { MessageSquare, RotateCcw } from 'react-feather';

const SellerTicketsEmpty = ({ hasFilter }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            {hasFilter ? <RotateCcw size={32} className="text-gray-400" /> : <MessageSquare size={32} className="text-gray-400" />}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{hasFilter ? 'تیکتی با این شرایط یافت نشد' : 'تیکتی ندارید'}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{hasFilter ? 'فیلتر را تغییر دهید.' : 'هنوز تیکتی ثبت نشده است.'}</p>
    </div>
);

export default SellerTicketsEmpty;