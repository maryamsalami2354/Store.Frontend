// =============================================================================
// FILE: comparisonEmpty.jsx (اصلاح‌شده - دکمه افزودن کار می‌کنه)
// =============================================================================
import React from 'react';
import { BarChart2, Plus } from 'react-feather';

const ComparisonEmpty = ({ onAdd }) => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <BarChart2 size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">مقایسه خالی است</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                محصولی به لیست مقایسه اضافه نکرده‌اید. می‌توانید تا ۴ محصول را با هم مقایسه کنید.
            </p>
            <button
                onClick={onAdd}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] transition-colors"
            >
                <Plus size={18} />
                افزودن محصول
            </button>
        </div>
    </div>
);

export default ComparisonEmpty;