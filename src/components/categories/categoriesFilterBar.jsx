// =============================================================================
// FILE: categoriesFilterBar.jsx
// =============================================================================
import React from 'react';
import { Grid, List, RotateCcw } from 'react-feather';
import CustomSelect from '../common/customSelect/customSelect.jsx';

const sortOptions = [
    { value: 'popular', label: 'پیش‌فرض' },
    { value: 'alphabet', label: 'الفبا' },
    { value: 'products', label: 'بیشترین محصول' },
    { value: 'brands', label: 'بیشترین برند' },
    { value: 'rating', label: 'بالاترین امتیاز' },
];

const CategoriesFilterBar = ({
                                 sortBy = 'popular',
                                 onSortChange,
                                 viewMode = 'grid',
                                 onViewModeChange,
                                 totalResults = 0,
                                 hasActiveFilters = false,
                                 onClearFilters
                             }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 flex items-center justify-between gap-3 mb-4">

    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
      <span className="font-bold text-gray-900 dark:text-white">{totalResults.toLocaleString('fa-IR')}</span>
        {' '}دسته‌بندی
    </span>

        <div className="flex items-center gap-2">
            <CustomSelect
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                placeholder="مرتب‌سازی"
            />

            <div className="hidden sm:flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg">
                <button onClick={() => onViewModeChange('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-[#111] text-[#002874] dark:text-[#4C6FB6] shadow-sm' : 'text-gray-400'}`}>
                    <Grid size={14} />
                </button>
                <button onClick={() => onViewModeChange('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-[#111] text-[#002874] dark:text-[#4C6FB6] shadow-sm' : 'text-gray-400'}`}>
                    <List size={14} />
                </button>
            </div>

            {hasActiveFilters && (
                <button onClick={onClearFilters} className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <RotateCcw size={12} />
                    <span className="hidden sm:inline">حذف فیلتر</span>
                </button>
            )}
        </div>
    </div>
);

export default CategoriesFilterBar;