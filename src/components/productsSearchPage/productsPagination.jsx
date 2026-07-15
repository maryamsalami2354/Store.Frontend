import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

const ProductsPagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) pages.push('...');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push('...');

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2">
            {/* Prev Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="صفحه قبلی"
            >
                <ChevronRight size={18} />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                    <span key={`dots-${idx}`} className="px-1 text-gray-400">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                                ? 'bg-[#002874] dark:bg-[#4C6FB6] text-white shadow-lg shadow-[#002874]/30 dark:shadow-[#4C6FB6]/30'
                                : 'bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                    >
                        {page.toLocaleString('fa-IR')}
                    </button>
                )
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="صفحه بعدی"
            >
                <ChevronLeft size={18} />
            </button>
        </div>
    );
};

export default ProductsPagination;