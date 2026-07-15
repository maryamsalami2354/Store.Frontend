// =============================================================================
// FILE: bestSellersFilterBar.jsx
// =============================================================================
import React from 'react';
import { Grid, List } from 'react-feather';
import CustomSelect from '../common/customSelect/customSelect';

const sortOptions = [
    { value: 'rating', label: 'بیشترین امتیاز' },
    { value: 'sales', label: 'بیشترین فروش' },
    { value: 'products', label: 'بیشترین محصولات' },
];

const BestSellersFilterBar = ({ sortBy, onSortChange, viewMode, onViewModeChange, total }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 flex items-center justify-between gap-3 mb-4">
    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
      <span className="font-bold text-gray-900 dark:text-white">{total.toLocaleString('fa-IR')}</span> فروشنده
    </span>
        <div className="flex items-center gap-2">
            <CustomSelect options={sortOptions} value={sortBy} onChange={onSortChange} placeholder="مرتب‌سازی" />
            <div className="hidden sm:flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg">
                <button onClick={() => onViewModeChange('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-[#111] text-[#002874] dark:text-[#4C6FB6] shadow-sm' : 'text-gray-400'}`}><Grid size={14} /></button>
                <button onClick={() => onViewModeChange('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-[#111] text-[#002874] dark:text-[#4C6FB6] shadow-sm' : 'text-gray-400'}`}><List size={14} /></button>
            </div>
        </div>
    </div>
);

export default BestSellersFilterBar;