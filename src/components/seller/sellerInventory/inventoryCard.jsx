// src/components/seller/sellerInventory/inventoryCard.jsx
import React from 'react';
import { Edit3, CheckCircle, AlertTriangle, XCircle } from 'react-feather';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const statusConfig = {
    available: { label: 'موجود', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    'low-stock': { label: 'نیاز به شارژ', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertTriangle },
    'out-of-stock': { label: 'ناموجود', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

const getStatus = (stock = 0, minStock = 5) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= minStock) return 'low-stock';
    return 'available';
};

const InventoryCard = ({ variant, product = {}, onAdjust }) => {
    const stock = product?.stock ?? 0;
    const minStock = product?.minStock ?? 5;
    const statusKey = getStatus(stock, minStock);
    const status = statusConfig[statusKey];
    const StatusIcon = status?.icon || CheckCircle;

    if (variant === 'row') {
        return (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        <LazyLoadImage
                            src={product?.image || '/images/products/placeholder.jpg'}
                            effect="blur"
                            wrapperClassName="w-10 h-10 block flex-shrink-0"
                            className="w-10 h-10 object-cover rounded-lg"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{product?.name || 'بدون نام'}</span>
                    </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{product?.sku || `SKU-${product?.id || '?'}`}</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">{stock}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{minStock}</td>
                <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status?.color || ''}`}>
            <StatusIcon size={12} /> {status?.label || 'نامشخص'}
          </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{product?.lastUpdated || '---'}</td>
                <td className="px-4 py-3 text-center">
                    <button onClick={() => onAdjust?.(product)} className="p-2 rounded-lg text-gray-500 hover:text-[#002874]  dark:hover:text-[#4C6FB6] hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="تنظیم موجودی">
                        <Edit3 size={16} />
                    </button>
                </td>
            </tr>
        );
    }

    // variant === 'card'
    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-3">
                <LazyLoadImage
                    src={product?.image || '/images/products/placeholder.jpg'}
                    effect="blur"
                    wrapperClassName="w-12 h-12 block flex-shrink-0"
                    className="w-12 h-12 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product?.name || 'بدون نام'}</p>
                    <p className="text-xs text-gray-500">کد: {product?.sku || `SKU-${product?.id || '?'}`}</p>
                </div>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
                <span>موجودی: <strong>{stock}</strong></span>
                <span>حداقل: <strong>{minStock}</strong></span>
            </div>
            <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status?.color || ''}`}>
          <StatusIcon size={12} /> {status?.label || 'نامشخص'}
        </span>
                <button onClick={() => onAdjust?.(product)} className="p-2 rounded-lg text-gray-500 hover:text-[#002874]  dark:hover:text-[#4C6FB6]">
                    <Edit3 size={16} />
                </button>
            </div>
        </div>
    );
};

export default InventoryCard;