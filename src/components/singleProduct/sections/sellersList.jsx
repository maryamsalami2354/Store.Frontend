// src/components/singleProduct/sections/sellersList.jsx
import React from 'react';
import { Star, ShoppingBag, Shield, Truck, Award } from 'react-feather';

const SellersList = ({ sellers = [], product, onAddToCart }) => {
    const formatPrice = (price) => {
        if (!price) return '۰';
        return Number(String(price).replace(/[^\d]/g, '')).toLocaleString('fa-IR');
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 lg:p-6">
            {/* Title با خط زیرین */}
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-[#002874]/10 dark:bg-[#4C6FB6]/20">
                    <Award size={20} className="text-[#002874]  dark:text-[#4C6FB6]" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    فروشندگان این کالا
                </h2>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
                    {sellers.length} فروشنده
                </span>
            </div>

            {/* جدول فروشندگان */}
            <div className="space-y-3">
                {sellers.map((seller, idx) => (
                    <div
                        key={seller.id}
                        className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            {/* اطلاعات فروشنده */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#002874] to-[#4C6FB6] rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                                        {seller.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{seller.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="flex items-center gap-1">
                                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                                <span className="text-xs text-gray-500">{seller.satisfaction}٪ رضایت</span>
                                            </div>
                                            <span className="text-gray-300 dark:text-gray-600">|</span>
                                            <span className="text-xs text-green-600 font-medium">{seller.performance}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ویژگی‌ها */}
                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Truck size={14} className="text-[#002874]  dark:text-[#4C6FB6]" />
                                        <span>{seller.delivery}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Shield size={14} className="text-[#002874]  dark:text-[#4C6FB6]" />
                                        <span>{seller.warranty}</span>
                                    </div>
                                </div>
                            </div>

                            {/* قیمت و دکمه خرید */}
                            <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-2 flex-shrink-0">
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-extrabold text-[#002874]  dark:text-[#4C6FB6]">
                                            {formatPrice(seller.price)}
                                        </span>
                                        <span className="text-xs text-gray-500">تومان</span>
                                    </div>
                                    {seller.discount > 0 && (
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <del className="text-xs text-gray-400">{formatPrice(seller.oldPrice)}</del>
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                                                ٪{seller.discount}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => onAddToCart?.(1, product)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] transition whitespace-nowrap"
                                >
                                    <ShoppingBag size={16} />
                                    <span className="hidden sm:inline">افزودن به سبد</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellersList;
