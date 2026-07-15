// =============================================================================
// FILE: comparisonActions.jsx
// =============================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, ShoppingBag } from 'react-feather';
import { toast } from 'react-toastify';

const ComparisonActions = ({ products = [] }) => {
    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success('لینک مقایسه کپی شد');
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 pb-6">
            <button
                onClick={handleShare}
                className="flex items-center mt-3 gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                <Share2 size={16} />
                اشتراک‌گذاری مقایسه
            </button>
            <div className="md:flex items-center gap-2">
                {products.map(product => (
                    <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="flex items-center mt-3 gap-1.5 px-4 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors"
                    >
                        <ShoppingBag size={16} />
                        خرید {product.name.split(' ').slice(0, 2).join(' ')}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ComparisonActions;