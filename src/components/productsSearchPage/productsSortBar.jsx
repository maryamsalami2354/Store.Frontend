import React from 'react';
import { ChevronDown, Sliders } from 'react-feather';
import CustomSelect from "../common/customSelect/customSelect.jsx";

const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'oldest', label: 'قدیمی‌ترین' },
    { value: 'cheapest', label: 'ارزان‌ترین' },
    { value: 'expensive', label: 'گران‌ترین' },
    { value: 'popular', label: 'محبوب‌ترین' },
    { value: 'discounted', label: 'بیشترین تخفیف' }
];

const ProductsSortBar = ({
                             sortBy = 'newest',
                             onSortChange,
                             totalProducts = 0,
                             showingProducts = 0,
                             currentPage = 1,
                             totalPages = 1,
                             onPageChange
                         }) => {
    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                    <Sliders size={16} className="text-gray-400" />
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">مرتب‌سازی:</span>
                    <div className="relative">
                        <CustomSelect
                            options={sortOptions}
                            value={sortBy}
                            onChange={onSortChange}
                            placeholder="مرتب‌سازی"
                        />
                    </div>
                </div>

                {/* Results Info */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <span>
            نمایش {showingProducts.toLocaleString('fa-IR')} از {totalProducts.toLocaleString('fa-IR')} محصول
          </span>
                    {totalPages > 1 && (
                        <span className="hidden sm:inline">
              | صفحه {currentPage.toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}
            </span>
                    )}
                </div>

                {/* Quick Page Navigation - Mobile */}
                {totalPages > 1 && (
                    <div className="flex items-center gap-1 sm:hidden">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            قبلی
                        </button>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentPage}/{totalPages}
            </span>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-2 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            بعدی
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsSortBar;