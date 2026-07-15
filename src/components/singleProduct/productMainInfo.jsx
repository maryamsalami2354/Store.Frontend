// src/components/singleProduct/productMainInfo.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Share2, BarChart2, RefreshCw, ChevronLeft, ChevronDown, Zap, Shield, Truck, Award, Package, Headphones, Wifi, Volume2, Sun, Tool } from 'react-feather';

const ProductMainInfo = ({ product }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null); // اضافه شد

    const formatPrice = (price) => {
        if (!price) return '۰';
        return Number(String(price).replace(/[^\d]/g, '')).toLocaleString('fa-IR');
    };

    // آیکون‌های تصادفی برای ویژگی‌ها
    const featureIcons = [Zap, Shield, Truck, Award, Package, Headphones, Wifi, Volume2, Sun, Tool];

    const features = (product?.tags || []).map((tag, idx) => ({
        text: tag,
        icon: featureIcons[idx % featureIcons.length],
        color: [
            'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
            'text-green-600 bg-green-100 dark:bg-green-900/30',
            'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
            'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
            'text-red-600 bg-red-100 dark:bg-red-900/30',
            'text-teal-600 bg-teal-100 dark:bg-teal-900/30',
            'text-pink-600 bg-pink-100 dark:bg-pink-900/30',
            'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30',
            'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
            'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30',
        ][idx % 10],
    }));

    // اضافه کردن ویژگی‌های ثابت برای شلوغ‌تر شدن
    if (features.length < 8) {
        const defaults = ['طراحی ارگونومیک', 'کیفیت ساخت بالا', 'گارانتی معتبر', 'پشتیبانی ۲۴ ساعته'];
        defaults.forEach((d, i) => {
            if (!features.find(f => f.text === d)) {
                features.push({
                    text: d,
                    icon: featureIcons[(features.length + i) % featureIcons.length],
                    color: [
                        'text-green-600 bg-green-100 dark:bg-green-900/30',
                        'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
                        'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
                        'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
                    ][i],
                });
            }
        });
    }

    return (
        <div className="space-y-5">
            {/* دسته‌بندی و برند */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Link to={`/category/${product?.categoryId}`} className="text-[#002874]  dark:text-[#4C6FB6] hover:underline font-medium">دسته‌بندی</Link>
                <span>/</span>
                {product?.brandId && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-lg">برند {product.brandId}</span>}
            </div>

            {/* عنوان */}
            <div>
                <h1 className="text-xl lg:text-2xl font-extrabold text-gray-900 dark:text-white leading-9">
                    {product?.name}
                </h1>
                {product?.shortDescription && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 leading-6">{product.shortDescription}</p>
                )}
            </div>

            {/* امتیاز */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-1.5">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{product?.rating || 0}</span>
                    <span className="text-xs text-gray-500">از ۵</span>
                </div>
                <span className="text-xs text-gray-500">({Math.floor((product?.rating || 0) * 25)} دیدگاه)</span>
                <Link to="#reviews" className="text-xs text-[#002874]  dark:text-[#4C6FB6] hover:underline flex items-center gap-1">
                    مشاهده نظرات <ChevronLeft size={12} />
                </Link>
            </div>

            {/* انتخاب رنگ */}
            {product?.colors?.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">انتخاب رنگ:</p>
                        <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg">
              {product.colors.length} رنگ
            </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        {product.colors.map((color, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedColor(color)}
                                className={`group flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                                    selectedColor === color
                                        ? 'border-[#002874] dark:border-[#4C6FB6] bg-[#002874]/5 dark:bg-[#4C6FB6]/10'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                                }`}
                            >
                                <span
                                    className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                                    style={{ backgroundColor: color.toLowerCase() === 'مشکی' ? '#1a1a1a' :
                                            color.toLowerCase() === 'سفید' ? '#ffffff' :
                                                color.toLowerCase() === 'قرمز' ? '#ef4444' :
                                                    color.toLowerCase() === 'آبی' ? '#3b82f6' :
                                                        color.toLowerCase() === 'سبز' ? '#22c55e' :
                                                            color.toLowerCase() === 'زرد' ? '#eab308' : color }}
                                ></span>
                                <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                  {color}
                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ویژگی‌ها - باکس خاکستری شلوغ */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Award size={16} className="text-[#002874]  dark:text-[#4C6FB6]" />
                        ویژگی‌های کلیدی
                    </p>
                    <button
                        onClick={() => setShowAllFeatures(!showAllFeatures)}
                        className="text-xs text-[#002874]  dark:text-[#4C6FB6] hover:underline flex items-center gap-1"
                    >
                        {showAllFeatures ? 'بستن' : 'نمایش همه'}
                        <ChevronDown size={12} className={`transition-transform ${showAllFeatures ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <div className={`grid grid-cols-2 gap-2 ${showAllFeatures ? '' : 'max-h-32 overflow-hidden'}`}>
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-xl hover:shadow-sm transition-all group"
                            >
                                <div className={`p-1.5 rounded-lg ${feature.color} flex-shrink-0`}>
                                    <Icon size={14} />
                                </div>
                                <span className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1 group-hover:text-[#002874]  dark:group-hover:text-[#4C6FB6] transition-colors">
                  {feature.text}
                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default ProductMainInfo;