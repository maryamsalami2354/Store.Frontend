import React, { useState, useEffect, useRef, useCallback } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
    ChevronLeft, ChevronRight, ShoppingBag,
    Heart, Star, Sparkles, ArrowLeft
} from 'lucide-react';
import ProductSkeletonSlider from '../../skeleton/ProductSkeletonSlider/ProductSkeletonSlider';
import useCartActions from '../../../hooks/useCartActions.js';
import { compareProductAvailability, getProductAvailability } from '../../../utils/helpers/productAvailability.js';
import { getCatalogProducts } from '../../../services/catalogApi.js';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'react-lazy-load-image-component/src/effects/blur.css';
import {toast} from "react-toastify";

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

const SKELETON_COUNT = 5;
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

const ColorDot = ({ color, isActive = false }) => (
    <span
        className={`block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border transition-transform duration-200 ${
            isActive
                ? 'ring-1 sm:ring-2 ring-[#002874] dark:ring-[#4C6FB6] scale-110'
                : 'ring-1 ring-transparent hover:ring-gray-300 dark:hover:ring-gray-600'
        }`}
        style={{ backgroundColor: color }}
    />
);

// =============================================================================
// PRODUCT CARD
// =============================================================================
const ProductCard = ({ product, onAddToCart, onToggleWishlist ,navigate }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { addProductToCart } = useCartActions();
    const { isOutOfStock, label: availabilityLabel, badgeClass: availabilityBadgeClass } = getProductAvailability(product);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);
    const handleClick = useCallback(() => {
        navigate(`/product/${product.id}`);  // از props استفاده کن
    }, [navigate, product.id]);
    const handleWishlistClick = useCallback((e) => {
        e.stopPropagation();
        onToggleWishlist?.(product.id);
         toast.success(`${product.name} به علاقه‌مندی‌ها اضافه شد`);
    }, [onToggleWishlist, product.id, product.name]);

    const handleAddToCart = useCallback((e) => {
        e.stopPropagation();
        if (isOutOfStock) {
            toast.info('این محصول فعلا ناموجود است');
            return;
        }
        onAddToCart?.(product);
        addProductToCart(product);
    }, [addProductToCart, isOutOfStock, onAddToCart, product]);

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
                {/* Colors & New Badge */}
                <div className="absolute top-1 sm:top-2 start-1 sm:start-2 end-1 sm:end-2 flex items-start justify-between z-10">
                    {hasColors && (
                        <div className="flex flex-col gap-0.5">
                            {product.colors.map((color, i) => (
                                <ColorDot key={i} color={color} />
                            ))}
                        </div>
                    )}
                    <div className="flex flex-col gap-0.5 sm:gap-1 items-end">
                        {product.isNew && (
                            <span className="bg-emerald-500 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-md">
                                جدید
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
                <span className={`mt-1 inline-flex w-fit items-center rounded-full border px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold ${availabilityBadgeClass}`}>
                    {availabilityLabel}
                </span>

                {/* Price & Add to Cart */}
                <div className="mt-auto pt-2 sm:pt-3 flex items-end justify-between gap-1 sm:gap-2">
                    <div className="flex-1 min-w-0">
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
                                ? 'opacity-100 scale-100 bg-[#002874] text-white hover:bg-[#001d5a] dark:hover:bg-[#001d5a]'
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
const NewestProducts = ({
                            title = "جدیدترین محصولات",
                            subtitle = "تازه‌های بازار",
                            linkText = "مشاهده همه",
                            linkHref = "/newest",
                            products: propProducts,
                            isLoading: propIsLoading = false,
                            onAddToCart,
                            onToggleWishlist
                        }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(propIsLoading);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        // اگر محصولات از طریق prop ارسال شده باشند
        if (propProducts !== undefined) {
            const newProducts = propProducts.filter(p => p.isNew === true).sort(compareProductAvailability);
            setProducts(newProducts);
            setIsLoading(false);
            return;
        }

        // در غیر این صورت از API دریافت می‌کنیم
        const loadProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getCatalogProducts({ page: 1, pageSize: 20, sort: 'newest' });
                // فرض بر این است که data شامل آرایه‌ای از محصولات است
                const apiProducts = response.products || [];
                const fallbackProducts = ([]).filter(p => p.isNew === true);
                const newProducts = (apiProducts.length ? apiProducts : fallbackProducts)
                    .filter(p => p.isNew === true)
                    .sort(compareProductAvailability);
                setProducts(newProducts);
            } catch (err) {
                console.error('Error fetching newest products:', err);
                setError('خطا در بارگذاری محصولات جدید');
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, [propProducts]);

    const handleSwiper = useCallback((swiper) => {
        setSwiperInstance(swiper);
    }, []);

    useEffect(() => {
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

    // شرط return null را حذف می‌کنیم تا هدر همیشه نمایش یابد
    // if (!products?.length && !isLoading) return null;

    return (
        <section className="py-3 sm:py-5" aria-labelledby="newest-products-title">
            <h2 id="newest-products-title" className="sr-only">{title}</h2>

            <div className="">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-emerald-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    {/* Pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
                    
                    />

                    {/* Header */}
                    <div className="relative flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 xl:p-5">
                        <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
                            <div className="relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-emerald-600 to-teal-500 dark:from-emerald-700 dark:to-teal-600 rounded-lg sm:rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 dark:shadow-emerald-700/30">
                                <Sparkles size={16} className="sm:size-5 xl:size-6 text-white" />
                                <div className="absolute inset-0 rounded-lg sm:rounded-xl xl:rounded-2xl bg-gradient-to-br from-emerald-600/50 to-teal-500/50 blur-lg -z-10 animate-pulse opacity-50" />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base xl:text-xl font-bold text-gray-900 dark:text-white">
                                    {title}
                                </h2>
                                <p className="text-[10px] sm:text-xs xl:text-sm text-gray-500 dark:text-gray-400">
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
                                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 xl:px-4 py-1.5 sm:py-2 xl:py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs xl:text-sm font-medium rounded-lg sm:rounded-xl hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-500 hover:shadow-sm transition-all duration-200 group"
                            >
                                <span className="hidden xs:inline">{linkText}</span>
                                <ArrowLeft size={14} className="sm:size-4 transition-transform group-hover:-translate-x-0.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Swiper Slider */}
                    <div className="relative px-3 sm:px-4 xl:px-5 pb-3 sm:pb-4 xl:pb-5">
                        {isLoading ? (
                            <Swiper
                                modules={[Navigation, FreeMode]}
                                onSwiper={handleSwiper}
                                spaceBetween={10}
                                slidesPerView={1.2}
                                freeMode={{ enabled: true, sticky: true }}
                                navigation={{
                                    prevEl: navigationPrevRef.current,
                                    nextEl: navigationNextRef.current
                                }}
                                breakpoints={BREAKPOINTS}
                                dir="rtl"
                                className="!overflow-visible"
                            >
                                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                                    <SwiperSlide key={i} className="!h-auto">
                                        <ProductSkeletonSlider />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : error ? (
                            <div className="text-center py-8 text-red-500 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        ) : products.length > 0 ? (
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
                                محصول جدیدی یافت نشد
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewestProducts;
