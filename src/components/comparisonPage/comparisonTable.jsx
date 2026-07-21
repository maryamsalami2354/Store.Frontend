// =============================================================================
// FILE: comparisonTable.jsx (اصلاح‌شده - responsive جدول)
// =============================================================================
import React from 'react';
import ComparisonProductHeader from './comparisonProductHeader';
import ComparisonRow from './comparisonRow';
import { getColorHex } from '../../utils/helpers/colorHelpers.js';

const specs = [
    { label: 'قیمت', key: 'price', type: 'price' },
    { label: 'رنگ‌بندی', key: 'colors', type: 'colors' },
    { label: 'امتیاز', key: 'rating', type: 'rating' },
    { label: 'تخفیف', key: 'discount', type: 'discount' },
    { label: 'وضعیت', key: 'status', type: 'text' },
    { label: 'برند', key: 'brandId', type: 'text' },
    { label: 'وزن', key: 'weight', type: 'weight' },
    { label: 'ارسال رایگان', key: 'shipping', type: 'shipping' },
    { label: 'گارانتی', key: 'warranty', type: 'text' },
];

const ComparisonTable = ({ products = [], onRemove }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">

        {/* Desktop Table */}
        <div className="hidden md:block">
            <div className="grid divide-x divide-gray-100 dark:divide-gray-800" style={{ gridTemplateColumns: `120px repeat(${products.length}, 1fr)` }}>

                {/* Top-left empty cell */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 font-bold text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    مشخصات
                </div>

                {/* Product headers */}
                {products.map(product => (
                    <ComparisonProductHeader key={product.id} product={product} onRemove={onRemove} />
                ))}

                {/* Spec rows */}
                {specs.map(spec => (
                    <ComparisonRow key={spec.key} label={spec.label} products={products} specKey={spec.key} type={spec.type} />
                ))}
            </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((product, idx) => (
                <div key={product.id} className="p-4">
                    {/* Product Header */}
                    <ComparisonProductHeader product={product} onRemove={onRemove} />

                    {/* Specs */}
                    <div className="mt-4 space-y-2">
                        {specs.map(spec => (
                            <div key={spec.key} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{spec.label}</span>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    <ComparisonRowCell product={product} specKey={spec.key} type={spec.type} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

    </div>
);

// Helper component for mobile cell rendering
const ComparisonRowCell = ({ product, specKey, type }) => {
    switch (type) {
        case 'price':
            return <span className="text-[#002874] dark:text-[#4C6FB6] font-bold">{product.price} تومان</span>;
        case 'colors':
            return (
                <div className="flex items-center gap-1">
                    {(product.colors || []).slice(0, 4).map((color, i) => (
                        <span key={i} className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" style={{ backgroundColor: getColorHex(color) }} />
                    ))}
                </div>
            );
        case 'rating':
            return <span className="text-amber-500">{product.rating} از ۵</span>;
        case 'discount':
            return product.discount > 0 ? (
                <span className="text-red-500 font-bold">{product.discount}%</span>
            ) : <span className="text-gray-400">—</span>;
        case 'weight':
            return <span>{product.weight ? `${product.weight} kg` : '—'}</span>;
        case 'shipping':
            return product.shipping?.freeShipping ? (
                <span className="text-green-600 dark:text-green-400">رایگان</span>
            ) : <span className="text-gray-400">—</span>;
        default:
            return <span>{product[specKey] || '—'}</span>;
    }
};

export default ComparisonTable;
