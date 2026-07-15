// =============================================================================
// FILE: comparisonProductHeader.jsx
// =============================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { X } from 'react-feather';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ComparisonProductHeader = ({ product, onRemove }) => (
    <div className="p-4 text-center relative group">
        <button
            onClick={() => onRemove(product.id)}
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all z-10"
        >
            <X size={14} />
        </button>

        <Link to={`/product/${product.id}`} className="block">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-xl bg-gradient-to-br from-[#002874]/5 to-[#4C6FB6]/10 dark:from-[#002874]/20 dark:to-[#4C6FB6]/20 p-3 mb-3 flex items-center justify-center">
                <LazyLoadImage
                    src={product.image}
                    alt={product.name}
                    effect="blur"
                    className="w-full h-full object-contain"
                />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors">
                {product.name}
            </h3>
        </Link>
    </div>
);

export default ComparisonProductHeader;