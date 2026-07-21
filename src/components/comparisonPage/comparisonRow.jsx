// =============================================================================
// FILE: comparisonRow.jsx
// =============================================================================
import React from 'react';
import { Star, Check, X, Truck } from 'react-feather';
import { getColorHex } from '../../utils/helpers/colorHelpers.js';

const ComparisonRow = ({ label, products = [], specKey, type = 'text' }) => {
    const renderCell = (product) => {
        switch (type) {
            case 'price':
                return (
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
            {product.price} تومان
          </span>
                );

            case 'colors':
                return (
                    <div className="flex items-center justify-center gap-1">
                        {(product.colors || []).slice(0, 4).map((color, i) => (
                            <span
                                key={i}
                                className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                style={{ backgroundColor: getColorHex(color) }}
                            />
                        ))}
                        {(product.colors || []).length > 4 && (
                            <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
                        )}
                    </div>
                );

            case 'rating':
                return (
                    <div className="flex items-center justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star
                                key={i}
                                size={12}
                                className={i <= Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}
                            />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                    </div>
                );

            case 'discount':
                return product.discount > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg">
            {product.discount}% تخفیف
          </span>
                ) : (
                    <span className="text-xs text-gray-400">ندارد</span>
                );

            case 'weight':
                return (
                    <span className="text-sm text-gray-700 dark:text-gray-300">
            {product.weight ? `${product.weight} کیلوگرم` : '—'}
          </span>
                );

            case 'shipping':
                return product.shipping?.freeShipping ? (
                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
            <Truck size={14} />
            رایگان
          </span>
                ) : (
                    <span className="text-xs text-gray-400">پستی</span>
                );

            default:
                return (
                    <span className="text-sm text-gray-700 dark:text-gray-300">
            {product[specKey] || '—'}
          </span>
                );
        }
    };

    return (
        <>
            {/* Label */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 text-sm font-medium text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800 flex items-center">
                {label}
            </div>

            {/* Cells */}
            {products.map(product => (
                <div
                    key={product.id}
                    className="p-4 flex items-center justify-center border-t border-gray-100 dark:border-gray-800"
                >
                    {renderCell(product)}
                </div>
            ))}
        </>
    );
};

export default ComparisonRow;
