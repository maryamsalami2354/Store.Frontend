// src/components/seller/sellerProducts/ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2 } from 'react-feather';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const statusConfig = {
    active: { label: 'فعال', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    inactive: { label: 'غیرفعال', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
    outofstock: { label: 'ناموجود', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const ProductCard = ({ variant, product, categoryName, onDelete, onEdit }) => {
    const navigate = useNavigate();
    const status = statusConfig[product.status] || statusConfig.active;

    // 🔴 حالت ROW (دسکتاپ) - باید <tr> برگرداند
    if (variant === 'row') {
        return (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                <td className="px-4 py-3">
                    <LazyLoadImage
                        src={product.image}
                        alt={product.name}
                        effect="blur"
                        wrapperClassName="w-10 h-10 block"
                        className="w-10 h-10 object-cover rounded-lg"
                        placeholder={<div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />}
                    />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{categoryName}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{product.price} تومان</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{product.stock || 0}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{product.discount}%</td>
                <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${product.id}`);
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-[#002874]  dark:text-gray-400 dark:hover:text-[#4C6FB6] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            title="مشاهده محصول"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(product);
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            title="ویرایش محصول"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(product);
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            title="حذف محصول"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    // 🟢 حالت CARD (موبایل) - باید <div> برگرداند
    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex gap-3">
                <LazyLoadImage
                    src={product.image}
                    alt={product.name}
                    effect="blur"
                    wrapperClassName="w-16 h-16 block flex-shrink-0"
                    className="w-16 h-16 object-cover rounded-xl"
                    placeholder={<div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />}
                />
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{categoryName}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{product.price} تومان</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">موجودی: {product.stock || 0}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">تخفیف: {product.discount}%</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.id}`);
                        }}
                        className="p-2 rounded-lg text-gray-500 hover:text-[#002874]  dark:text-gray-400 dark:hover:text-[#4C6FB6] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        title="مشاهده محصول"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(product);
                        }}
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        title="ویرایش محصول"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(product);
                        }}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        title="حذف محصول"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;