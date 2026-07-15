// src/components/seller/sellerProducts/productsPagination.jsx
import React from 'react';
import { ChevronRight, ChevronLeft } from 'react-feather';

const ProductsPagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
                <ChevronRight size={18} />
            </button>

            {getPageNumbers().map((page, idx) => (
                <React.Fragment key={idx}>
                    {page === '...' ? (
                        <span className="px-2 text-gray-400">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition ${
                                currentPage === page
                                    ? 'bg-[#002874] text-white dark:bg-[#4C6FB6]'
                                    : 'bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            {page.toLocaleString('fa-IR')}
                        </button>
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
                <ChevronLeft size={18} />
            </button>
        </div>
    );
};

export default ProductsPagination;