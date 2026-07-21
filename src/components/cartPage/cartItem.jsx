import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Plus, Minus, Trash2, Heart, Shield, Circle } from 'react-feather';
import { toast } from 'react-toastify';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { toAssetUrl } from '../../services/authApi.js';
import { getColorHex, getColorName } from '../../utils/helpers/colorHelpers.js';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    const productId = item.productId || item.id;
    const name = item.name || item.productName || 'محصول';
    const itemPrice = Number(item.priceValue ?? item.unitPriceSnapshot ?? 0);
    const itemTotal = itemPrice * Number(item.quantity || 0);

    return (
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
                to={`/product/${productId}`}
                className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#002874]/5 to-[#4C6FB6]/10 dark:from-[#002874]/20 dark:to-[#4C6FB6]/20 p-3 flex items-center justify-center overflow-hidden"
            >
                <LazyLoadImage
                    src={toAssetUrl(item.image)}
                    alt={name}
                    effect="blur"
                    className="w-full h-full object-contain"
                />
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <Link to={`/product/${productId}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors line-clamp-2">
                        {name}
                    </Link>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                        aria-label="حذف از سبد خرید"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    {item.selectedColor && (
                        <span className="flex items-center gap-1.5">
                            <Circle size={12} />
                            <span className="inline-block w-3 h-3 rounded-full border" style={{ backgroundColor: getColorHex(item.selectedColor) }} />
                            {getColorName(item.selectedColor)}
                        </span>
                    )}
                    <span className="flex items-center gap-1.5">
                        <Shield size={12} />
                        {item.selectedWarranty || 'گارانتی اصالت و سلامت فیزیکی کالا'}
                    </span>
                    {item.brandName && <span>{item.brandName}</span>}
                </div>

                <div className="flex items-end justify-between mt-3">
                    <div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {itemPrice.toLocaleString('fa-IR')} تومان
                        </span>
                        <div className="font-bold text-base text-gray-900 dark:text-white">
                            {itemTotal.toLocaleString('fa-IR')}
                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 mr-1">تومان</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#111] hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors"
                            aria-label="افزایش تعداد"
                        >
                            <Plus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                            {Number(item.quantity || 0).toLocaleString('fa-IR')}
                        </span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#111] hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="کاهش تعداد"
                        >
                            <Minus size={14} />
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => toast.success('به علاقه‌مندی‌ها اضافه شد')}
                    className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                >
                    <Heart size={12} />
                    انتقال به علاقه‌مندی‌ها
                </button>
            </div>
        </div>
    );
};

export default CartItem;
