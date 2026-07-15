import React, { useState, useRef, useCallback } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify';
import {
    ChevronLeft, ChevronRight, ShoppingBag,
    Heart, Star, TrendingUp, ArrowLeft, Eye
} from 'lucide-react';
import ProductSkeletonSlider from '../../skeleton/ProductSkeletonSlider/ProductSkeletonSlider';
import productsData from '../../../../public/jsons/products.json';
import useCartActions from '../../../hooks/useCartActions.js';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'react-lazy-load-image-component/src/effects/blur.css';

// =============================================================================
// CONSTANTS
// =============================================================================
const BREAKPOINTS = {
    320: { slidesPerView: 1.2, spaceBetween: 8 },
    360: { slidesPerView: 1.4, spaceBetween: 10 },
    400: { slidesPerView: 1.6, spaceBetween: 10 },
    480: { slidesPerView: 2, spaceBetween: 12 },
    560: { slidesPerView: 2.2, spaceBetween: 12 },
    640: { slidesPerView: 2.5, spaceBetween: 14 },
    768: { slidesPerView: 3, spaceBetween: 14 },
    900: { slidesPerView: 3.5, spaceBetween: 16 },
    1024: { slidesPerView: 4, spaceBetween: 16 },
    1200: { slidesPerView: 4.5, spaceBetween: 18 },
    1400: { slidesPerView: 5, spaceBetween: 20 },
    1600: { slidesPerView: 5.5, spaceBetween: 20 }
};

const RATING_STARS = [1, 2, 3, 4, 5];

// =============================================================================
// SUB-COMPONENTS
// =============================================================================
const StarRating = ({ rating = 4 }) => (
    <div className="flex items-center gap-0.5">
        {RATING_STARS.map((i) => (
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
        style={{ backgroundColor: color }}
    />
);

// =============================================================================
// PRODUCT CARD
// =============================================================================
const ProductCard = ({ product, onAddToCart, onToggleWishlist , navigate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { addProductToCart } = useCartActions();

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);
    const handleClick = useCallback(() => {
        navigate(`/product/${product.id}`);
    }, [navigate, product.id]);

    const handleWishlistClick = useCallback((e) => {
        e.stopPropagation();
        onToggleWishlist?.(product.id);
         toast.success(`${product.name} به علاقه‌مندی‌ها اضافه شد`);
    }, [onToggleWishlist, product.id, product.name]);

    const handleAddToCart = useCallback((e) => {
        e.stopPropagation();
        onAddToCart?.(product);
        addProductToCart(product);
    }, [addProductToCart, onAddToCart, product]);
    const hasDiscount = product.discount > 0;
    const hasColors = product.colors?.length > 0;

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className="relative cursor-pointer group h-full"
        >
            <div className={`relative p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 h-full flex flex-col bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 ${
                isHovered
                    ? 'shadow-lg sm:shadow-xl shadow-[#002874]/10 dark:shadow-[#4C6FB6]/20 -translate-y-1 border-[#002874]/20 dark:border-[#4C6FB6]/30'
                    : 'shadow-sm hover:shadow-md'
            }`}>
                {/* Colors & Badges */}
                <div className="absolute top-1 sm:top-2 start-1 sm:start-2 end-1 sm:end-2 flex items-start justify-between z-10">
                    {hasColors && (
                        <div className="flex flex-col gap-0.5">
                            {product.colors.slice(0, 3).map((color, i) => (
                                <ColorDot key={i} color={color} />
                            ))}
                            {product.colors.length > 3 && (
                                <span className="text-[8px] text-gray-500 dark:text-gray-400">+{product.colors.length - 3}</span>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col gap-0.5 sm:gap-1 items-end">
                        {hasDiscount && (
                            <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-md shadow-sm">
                                {product.discount}%-
                            </span>
                        )}
                    </div>
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-12 sm:top-14 end-2 z-10 p-1 sm:p-1.5 rounded-full transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                    } bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 shadow-sm`}
                    aria-label="افزودن به علاقه‌مندی‌ها"
                >
                    <Heart size={14} className="sm:size-4" />
                </button>

                {/* Product Image */}
                <div className="relative pt-12 sm:pt-16 pb-2 sm:pb-3 overflow-hidden flex-shrink-0">
                    <LazyLoadImage
                        src={product.image}
                        alt={product.name}
                        effect="blur"
                        wrapperClassName="w-full h-24 sm:h-28 md:h-32"
                        className="w-full h-24 sm:h-28 md:h-32 object-contain transition-all duration-500 group-hover:scale-110"
                        placeholder={
                            <div className="w-full h-24 sm:h-28 md:h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
                        }
                    />
                </div>

                {/* Rating */}
                <div className="mb-1 sm:mb-1.5">
                    <StarRating rating={product.rating} />
                </div>

                {/* Product Title */}
                <h3 className="text-xs sm:text-sm leading-4 sm:leading-5 line-clamp-2 min-h-[32px] sm:min-h-[40px] text-gray-800 dark:text-gray-200 group-hover:text-[#002874]  dark:group-hover:text-[#4C6FB6] transition-colors duration-200 font-medium">
                    {product.name}
                </h3>

                {/* Price & Add to Cart */}
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
                        onClick={handleAddToCart}
                        className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                            isHovered
                                ? 'opacity-100 scale-100 bg-[#002874] text-white hover:bg-[#001d5a]'
                                : 'opacity-0 scale-90 bg-gray-100 dark:bg-gray-800 text-gray-400'
                        }`}
                        aria-label="افزودن به سبد خرید"
                    >
                        <ShoppingBag size={14} className="sm:size-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const MostViewedProducts = ({
                                title = "پر بازدیدترین محصولات",
                                subtitle = "محصولات محبوب کاربران",
                                linkText = "مشاهده همه",
                                linkHref = "/most-viewed",
                                onAddToCart,
                                onToggleWishlist
                            }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const navigate = useNavigate()
    // مستقیم از import استفاده کن - مرتب‌سازی بر اساس rating
    const allProducts = productsData.products || [];
    const mostViewedProducts = [...allProducts]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 12);

    const [products] = useState(mostViewedProducts);

    const handleSwiper = useCallback((swiper) => {
        setSwiperInstance(swiper);
    }, []);

    React.useEffect(() => {
        if (swiperInstance && navigationPrevRef.current && navigationNextRef.current) {
            if (swiperInstance.navigation) {
                swiperInstance.navigation.destroy();
            }
            swiperInstance.params.navigation = {
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
                disabledClass: 'swiper-button-disabled'
            };
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);

    return (
        <section className="py-3 sm:py-5" aria-labelledby="most-viewed-products-title">
            <h2 id="most-viewed-products-title" className="sr-only">{title}</h2>

            <div className="">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    {/* Pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"

                    />

                    {/* Header */}
                    <div className="relative flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 xl:p-5">
                        <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
                            <div className="relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-[#002874] to-[#4C6FB6] dark:from-[#4C6FB6] dark:to-[#002874] rounded-lg sm:rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg shadow-[#002874]/30 dark:shadow-[#4C6FB6]/30">
                                <TrendingUp size={16} className="sm:size-5 xl:size-6 text-white" />
                                <div className="absolute inset-0 rounded-lg sm:rounded-xl xl:rounded-2xl bg-gradient-to-br from-[#002874]/50 to-[#4C6FB6]/50 blur-lg -z-10 animate-pulse opacity-50" />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base xl:text-xl font-bold text-gray-900 dark:text-white">
                                    {title}
                                </h2>
                                <p className="text-[10px] sm:text-xs xl:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Eye size={12} className="inline" />
                                    {subtitle}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 xl:gap-3">
                            <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100/80 dark:bg-[#111] p-0.5 sm:p-1 rounded-lg sm:rounded-xl">
                                <button
                                    ref={navigationPrevRef}
                                    className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1c20] hover:text-[#002874]  dark:hover:text-[#4C6FB6] transition-all duration-200 disabled:opacity-40"
                                    aria-label="قبلی"
                                >
                                    <ChevronRight size={16} className="sm:size-5" />
                                </button>
                                <div className="hidden sm:block w-px h-4 sm:h-5 bg-gray-300 dark:bg-gray-700 mx-0.5" />
                                <button
                                    ref={navigationNextRef}
                                    className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1c20] hover:text-[#002874]  dark:hover:text-[#4C6FB6] transition-all duration-200 disabled:opacity-40"
                                    aria-label="بعدی"
                                >
                                    <ChevronLeft size={16} className="sm:size-5" />
                                </button>
                            </div>
                            <Link
                                to={linkHref}
                                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 xl:px-4 py-1.5 sm:py-2 xl:py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs xl:text-sm font-medium rounded-lg sm:rounded-xl hover:border-[#002874] dark:hover:border-[#4C6FB6] hover:text-[#002874]  dark:hover:text-[#4C6FB6] hover:shadow-sm transition-all duration-200 group"
                            >
                                <span className="hidden xs:inline">{linkText}</span>
                                <ArrowLeft size={14} className="sm:size-4 transition-transform group-hover:-translate-x-0.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Swiper Slider */}
                    <div className="relative px-3 sm:px-4 xl:px-5 pb-3 sm:pb-4 xl:pb-5">
                        {products.length > 0 ? (
                            <Swiper
                                modules={[Navigation, FreeMode]}
                                onSwiper={handleSwiper}
                                spaceBetween={10}
                                slidesPerView={1.2}
                                freeMode={{ enabled: true, sticky: true }}
                                breakpoints={BREAKPOINTS}
                                dir="rtl"
                                className="!overflow-visible"
                            >
                                {products.map((product) => (
                                    <SwiperSlide key={product.id} className="!h-auto">
                                        <ProductCard
                                            product={product}
                                            onAddToCart={onAddToCart}
                                            onToggleWishlist={onToggleWishlist}
                                            navigate={navigate}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                                محصولی یافت نشد
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MostViewedProducts;
