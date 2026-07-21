// =============================================================================
// FILE: mostVisitedCard.jsx (کامل - با نمودار، دکمه نمودار، رنگ دارک مود)
// =============================================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Star, Heart, ShoppingBag, TrendingUp, Eye, BarChart2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-lazy-load-image-component/src/effects/blur.css';
import VisitChartModal from "./visitChartModal.jsx";
import { getProductAvailability } from '../../utils/helpers/productAvailability.js';
import { getColorHex } from '../../utils/helpers/colorHelpers.js';

const StarRating = ({ rating = 4 }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
            <Star
                key={i}
                size={10}
                className={`sm:size-3 ${i <= Math.floor(rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
            />
        ))}
        <span className="text-[9px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium ms-0.5">
            ({rating})
        </span>
    </div>
);

const ColorDot = ({ color }) => (
    <span
        className="block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-gray-300 dark:border-gray-600"
        style={{ backgroundColor: getColorHex(color) }}
    />
);

const MostVisitedCard = ({ product, viewMode, onAddToCart, onToggleWishlist, navigate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const hasDiscount = product.discount > 0;
    const hasColors = product.colors?.length > 0;
    const { isOutOfStock, label: availabilityLabel, badgeClass: availabilityBadgeClass } = getProductAvailability(product);

    const handleClick = () => navigate(`/product/${product.id}`);

    const handleWishlist = (e) => {
        e.stopPropagation();
        onToggleWishlist?.();
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (isOutOfStock) {
            toast.info('این محصول فعلا ناموجود است');
            return;
        }
        onAddToCart?.(product);
    };

    const handleChartClick = (e) => {
        e.stopPropagation();
        setShowChart(true);
    };

    // =========================================================================
    // LIST VIEW
    // =========================================================================
    if (viewMode === 'list') {
        return (
            <div
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="cursor-pointer group bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 flex gap-4 hover:shadow-lg hover:border-[#002874]/20 dark:hover:border-[#4C6FB6]/20 transition-all duration-300"
            >
                {/* Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#002874]/5 to-[#4C6FB6]/10 dark:from-[#002874]/20 dark:to-[#4C6FB6]/20 p-2 relative">
                    <LazyLoadImage
                        src={product.image}
                        alt={product.name}
                        effect="blur"
                        className="w-full h-full object-contain"
                    />
                    {/* Visit Badge */}
                    <span className="absolute -top-1 -left-1 bg-[#002874] dark:bg-[#4C6FB6] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <TrendingUp size={9} />
                        {(product.visits || 0).toLocaleString('fa-IR')}
                    </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors line-clamp-1">
                        {product.name}
                    </h3>

                    {/* Rating + Visits */}
                    <div className="flex items-center gap-3 mt-1">
                        <StarRating rating={product.rating} />
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Eye size={10} className="text-[#002874] dark:text-[#4C6FB6]" />
                            {(product.visits || 0).toLocaleString('fa-IR')}
                        </span>
                    </div>
                    <span className={`mt-2 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${availabilityBadgeClass}`}>
                        {availabilityLabel}
                    </span>

                    {/* Price + Cart */}
                    <div className="flex items-end justify-between mt-2">
                        <div>
                            {product.oldPrice && (
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 line-through block">
                                    {product.oldPrice}
                                </span>
                            )}
                            <span className="font-bold text-sm text-gray-900 dark:text-white">
                                {product.price} تومان
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleChartClick}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors"
                            >
                                <BarChart2 size={16} />
                            </button>
                            <button
                                disabled={isOutOfStock}
                                onClick={handleAddToCart}
                                className={`p-2 rounded-lg transition-colors ${isOutOfStock ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600' : 'bg-[#002874] dark:bg-[#4C6FB6] text-white hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a]'}`}
                            >
                                <ShoppingBag size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // GRID VIEW
    // =========================================================================
    return (
        <>
            <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative cursor-pointer group h-full"
        >
            <div
                className={`relative p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 h-full flex flex-col bg-white dark:bg-[#111111] border ${
                    isHovered
                        ? 'shadow-lg sm:shadow-xl shadow-[#002874]/10 dark:shadow-[#4C6FB6]/20 -translate-y-1 border-[#002874]/20 dark:border-[#4C6FB6]/30'
                        : 'shadow-sm hover:shadow-md border-gray-100 dark:border-gray-800'
                }`}
            >
                {/* ============================================================= */}
                {/* TOP BADGES */}
                {/* ============================================================= */}
                <div className="absolute top-1 sm:top-2 start-1 sm:start-2 end-1 sm:end-2 flex items-start justify-between z-10">
                    {/* Colors */}
                    {hasColors && (
                        <div className="flex flex-col gap-0.5">
                            {product.colors.slice(0, 3).map((color, i) => (
                                <ColorDot key={i} color={color} />
                            ))}
                            {product.colors.length > 3 && (
                                <span className="text-[8px] text-gray-500 dark:text-gray-400">
                                    +{product.colors.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Discount + Visits Badge */}
                    <div className="flex flex-col gap-0.5 sm:gap-1 items-end">
                        {/* Visits Badge */}
                        <span className="bg-[#002874] text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <TrendingUp size={9} className="sm:size-3" />
                            {(product.visits || 0).toLocaleString('fa-IR')}
                        </span>
                        {/* Discount Badge */}
                        {hasDiscount && (
                            <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-md shadow-sm">
                                {product.discount}%-
                            </span>
                        )}
                    </div>
                </div>

                {/* ============================================================= */}
                {/* ACTION BUTTONS (هاور می‌شن) */}
                {/* ============================================================= */}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-12 sm:top-14 end-2 z-10 p-1 sm:p-1.5 rounded-full transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                    } bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 shadow-sm`}
                    aria-label="افزودن به علاقه‌مندی‌ها"
                >
                    <Heart size={14} className="sm:size-4" />
                </button>

                {/* Chart Button */}
                <button
                    onClick={handleChartClick}
                    className={`absolute top-12 sm:top-14 end-11 sm:end-12 z-10 p-1 sm:p-1.5 rounded-full transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                    } bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-[#002874] dark:hover:text-[#4C6FB6] shadow-sm`}
                    aria-label="نمایش نمودار بازدید"
                >
                    <BarChart2 size={14} className="sm:size-4" />
                </button>

                {/* ============================================================= */}
                {/* PRODUCT IMAGE */}
                {/* ============================================================= */}
                {/* PRODUCT IMAGE */}
                <div className="relative pt-12 sm:pt-16 pb-2 sm:pb-3 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <LazyLoadImage
                        src={product.image}
                        alt={product.name}
                        effect="blur"
                        className="w-auto h-24 sm:h-28 md:h-32 max-w-full object-contain transition-all duration-500 group-hover:scale-110"
                        placeholder={
                            <div className="w-full h-24 sm:h-28 md:h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
                        }
                    />
                </div>

                {/* ============================================================= */}
                {/* RATING */}
                {/* ============================================================= */}
                <div className="mb-1 sm:mb-1.5">
                    <StarRating rating={product.rating} />
                </div>

                {/* ============================================================= */}
                {/* VISITS CHART + COUNT (فقط با هاور) */}
                {/* ============================================================= */}

                {/* ============================================================= */}
                {/* PRODUCT TITLE */}
                {/* ============================================================= */}
                <h3 className="text-xs sm:text-sm leading-4 sm:leading-5 line-clamp-2 min-h-[32px] sm:min-h-[40px] text-gray-800 dark:text-gray-200 group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors duration-200 font-medium">
                    {product.name}
                </h3>
                <span className={`mt-1 inline-flex w-fit items-center rounded-full border px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold ${availabilityBadgeClass}`}>
                    {availabilityLabel}
                </span>

                {/* ============================================================= */}
                {/* PRICE + ADD TO CART */}
                {/* ============================================================= */}
                <div className="mt-auto pt-2 sm:pt-3 flex items-end justify-between gap-1 sm:gap-2">
                    <div className="flex-1 min-w-0">
                        {product.oldPrice && (
                            <span className="text-[9px] sm:text-[11px] text-gray-400 dark:text-gray-500 line-through block mb-0.5">
                                {product.oldPrice}
                            </span>
                        )}
                        <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate block">
                            {product.price}
                            <span className="text-[8px] sm:text-[10px] ms-0.5 font-normal text-gray-500 dark:text-gray-400">
                                تومان
                            </span>
                        </span>
                    </div>
                    <button
                        disabled={isOutOfStock}
                        onClick={handleAddToCart}
                        className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                            isOutOfStock
                                ? 'opacity-100 scale-100 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600'
                                : isHovered
                                ? 'opacity-100 scale-100 bg-[#002874] text-white hover:bg-[#001d5a]'
                                : 'opacity-0 scale-90 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                        }`}
                        aria-label="افزودن به سبد خرید"
                    >
                        <ShoppingBag size={14} className="sm:size-4" />
                    </button>
                </div>
            </div>
        </div>
            <VisitChartModal
                isOpen={showChart}
                onClose={() => setShowChart(false)}
                product={product}
            />
        </>

    );
};

export default MostVisitedCard;
