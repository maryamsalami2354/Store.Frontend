// =============================================================================
// FILE: sellerProfileProducts.jsx (اصلاح نهایی - toast فقط توی کارت)
// =============================================================================
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ShoppingBag, Heart, Star } from 'react-feather';
import { toast } from 'react-toastify';
import useCartActions from '../../hooks/useCartActions.js';
import { getProductAvailability } from '../../utils/helpers/productAvailability.js';
import 'react-lazy-load-image-component/src/effects/blur.css';

const RATING_STARS = [1, 2, 3, 4, 5];

const StarRating = ({ rating = 4 }) => (
    <div className="flex items-center gap-0.5">
        {RATING_STARS.map((i) => (
            <Star key={i} size={10} className={`sm:size-3 ${i <= Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
        ))}
        <span className="text-[9px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium ms-0.5">({rating})</span>
    </div>
);

const ColorDot = ({ color }) => (
    <span className="block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border ring-1 ring-transparent" style={{ backgroundColor: color }} />
);

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const { addProductToCart } = useCartActions();
    const hasDiscount = product.discount > 0;
    const hasColors = product.colors?.length > 0;
    const { isOutOfStock, label: availabilityLabel, badgeClass: availabilityBadgeClass } = getProductAvailability(product);

    const goToProduct = (e) => {
        e.stopPropagation();
        navigate(`/product/${product.id}`);
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        toast.success(`${product.name} به علاقه‌مندی‌ها اضافه شد`);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (isOutOfStock) {
            toast.info('این محصول فعلا ناموجود است');
            return;
        }
        await addProductToCart(product);
    };

    return (
        <div
            onClick={goToProduct}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative cursor-pointer group h-full"
        >
            <div className={`relative p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 h-full flex flex-col bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 ${
                isHovered ? 'shadow-lg sm:shadow-xl shadow-[#002874]/10 dark:shadow-[#4C6FB6]/20 -translate-y-1 border-[#002874]/20 dark:border-[#4C6FB6]/30' : 'shadow-sm hover:shadow-md'
            }`}>
                {/* Colors & Badges */}
                <div className="absolute top-1 sm:top-2 start-1 sm:start-2 end-1 sm:end-2 flex items-start justify-between z-10">
                    {hasColors && <div className="flex flex-col gap-0.5">{product.colors.map((color, i) => <ColorDot key={i} color={color} />)}</div>}
                    <div className="flex flex-col gap-0.5 sm:gap-1 items-end">
                        {product.isNew && <span className="bg-emerald-500 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-md">جدید</span>}
                        {hasDiscount && <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-md shadow-sm">{product.discount}%-</span>}
                    </div>
                </div>

                {/* Wishlist Button */}
                <button onClick={handleWishlist} className={`absolute top-12 sm:top-14 end-2 z-10 p-1 sm:p-1.5 rounded-full transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'} bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 shadow-sm`}>
                    <Heart size={14} className="sm:size-4" />
                </button>

                {/* Product Image */}
                <div className="relative pt-12 sm:pt-16 pb-2 sm:pb-3 overflow-hidden flex-shrink-0">
                    <LazyLoadImage src={product.image} alt={product.name} effect="blur" wrapperClassName="w-full h-24 sm:h-28 md:h-32" className="w-full h-24 sm:h-28 md:h-32 object-contain transition-all duration-500 group-hover:scale-110" />
                </div>

                {/* Rating */}
                <div className="mb-1 sm:mb-1.5"><StarRating rating={product.rating} /></div>

                {/* Product Title */}
                <h3 className="text-xs sm:text-sm leading-4 sm:leading-5 line-clamp-2 min-h-[32px] sm:min-h-[40px] text-gray-800 dark:text-gray-200 group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors duration-200 font-medium">{product.name}</h3>
                <span className={`mt-1 inline-flex w-fit items-center rounded-full border px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold ${availabilityBadgeClass}`}>
                    {availabilityLabel}
                </span>

                {/* Price & Add to Cart */}
                <div className="mt-auto pt-2 sm:pt-3 flex items-end justify-between gap-1 sm:gap-2">
                    <div className="flex-1 min-w-0">
                        {product.oldPrice && <span className="text-[9px] sm:text-[11px] text-gray-400 dark:text-gray-500 line-through block mb-0.5">{product.oldPrice}</span>}
                        <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate block">{product.price}<span className="text-[8px] sm:text-[10px] ms-0.5 font-normal text-gray-500 dark:text-gray-400"> تومان</span></span>
                    </div>
                    <button disabled={isOutOfStock} onClick={handleAddToCart} className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${isOutOfStock ? 'opacity-100 scale-100 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600' : isHovered ? 'opacity-100 scale-100 bg-[#002874] text-white hover:bg-[#001d5a] ' : 'opacity-0 scale-90 bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        <ShoppingBag size={14} className="sm:size-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const SellerProfileProducts = ({ products = [] }) => {
    if (!products.length) return null;
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
    );
};

export default SellerProfileProducts;
