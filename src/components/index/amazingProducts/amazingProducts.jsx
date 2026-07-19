import React, { useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify'; // اضافه شده
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Clock, ShoppingBag,
    Heart, Star, Flame, ArrowLeft
} from 'lucide-react';
import ProductSkeletonSlider from '../../skeleton/ProductSkeletonSlider/ProductSkeletonSlider';
import productsData from '../../../../public/jsons/products.json';
import useCartActions from '../../../hooks/useCartActions.js';
import { getCatalogProducts } from '../../../services/catalogApi.js';

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

const SKELETON_COUNT = 5;
const RATING_STARS = [1, 2, 3, 4, 5];
// =============================================================================
// HOOKS
// =============================================================================
const useCountdown = (targetDate) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    React.useEffect(() => {
        const calculate = () => {
            const diff = new Date(targetDate) - new Date();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const totalSeconds = Math.floor(diff / 1000);
            const totalMinutes = Math.floor(totalSeconds / 60);
            const totalHours = Math.floor(totalMinutes / 60);
            const days = Math.floor(totalHours / 24);

            setTimeLeft({
                days: days,
                hours: totalHours % 24,
                minutes: totalMinutes % 60,
                seconds: totalSeconds % 60
            });
        };
        calculate();
        const timer = setInterval(calculate, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return timeLeft;
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================
const CountdownTimer = ({ targetDate }) => {
    const { days, hours, minutes, seconds } = useCountdown(targetDate);
    const isUrgent = days === 0 && hours < 2;

    return (
        <div className={`flex items-center gap-0.5 px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg backdrop-blur-sm transition-all ${
            isUrgent ? 'bg-red-500/10 dark:bg-red-500/20' : 'bg-[#002874]/10 dark:bg-[#4C6FB6]/20'
        }`}>
            <Clock className={`hidden xs:block size-3 sm:size-3.5 ${
                isUrgent ? 'text-red-500 animate-pulse' : 'text-[#002874]  dark:text-[#4C6FB6]'
            }`} />
            <div className="flex items-center gap-0.5" dir="ltr">
                <div className="flex flex-col items-center">
                    <span className="font-mono text-[10px] sm:text-xs font-bold tabular-nums">
                        {days.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-gray-500 dark:text-gray-400 font-medium">روز</span>
                </div>
                <span className="text-[7px] sm:text-[10px] text-gray-400 mx-0.5">:</span>
                <div className="flex flex-col items-center">
                    <span className="font-mono text-[10px] sm:text-xs font-bold tabular-nums">
                        {hours.toString().padStart(2, '۰')}
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-gray-500 dark:text-gray-400 font-medium">ساعت</span>
                </div>
                <span className="text-[7px] sm:text-[10px] text-gray-400 mx-0.5">:</span>
                <div className="flex flex-col items-center">
                    <span className="font-mono text-[10px] sm:text-xs font-bold tabular-nums">
                        {minutes.toString().padStart(2, '۰')}
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-gray-500 dark:text-gray-400 font-medium">دقیقه</span>
                </div>
                <span className="text-[7px] sm:text-[10px] text-gray-400 mx-0.5">:</span>
                <div className="flex flex-col items-center">
                    <span className="font-mono text-[10px] sm:text-xs font-bold tabular-nums">
                        {seconds.toString().padStart(2, '۰')}
                    </span>
                    <span className="text-[7px] sm:text-[9px] text-gray-500 dark:text-gray-400 font-medium">ثانیه</span>
                </div>
            </div>
        </div>
    );
};

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
const ProductCard = ({ product, onAddToCart, onToggleWishlist }) => {
    const navigate = useNavigate(); // اضافه شده
    const [isHovered, setIsHovered] = useState(false);
    const { addProductToCart } = useCartActions();

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

    const stockCount = Number(product.stock || 0);
    const isOutOfStock = stockCount <= 0;
    const availabilityLabel = isOutOfStock ? 'ناموجود' : `موجودی: ${stockCount.toLocaleString('fa-IR')} عدد`;
    const availabilityBadgeClass = isOutOfStock
        ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';

    const handleAddToCart = useCallback((e) => {
        e.stopPropagation();
        if (isOutOfStock) {
            toast.info('این محصول فعلا ناموجود است');
            return;
        }
        onAddToCart?.(product);
        addProductToCart(product);
    }, [addProductToCart, isOutOfStock, onAddToCart, product]);

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
                        {hasDiscount && (
                            <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded-md shadow-sm">
                                {product.discount}%-
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-12 sm:top-14 end-2 z-10 p-1 sm:p-1.5 rounded-full transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                    } bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 shadow-sm`}
                    aria-label="افزودن به علاقه‌مندی‌ها"
                >
                    <Heart size={14} className="sm:size-4" />
                </button>

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

                <div className="mb-1 sm:mb-1.5">
                    <StarRating rating={product.rating} />
                </div>

                <h3 className="text-xs sm:text-sm leading-4 sm:leading-5 line-clamp-2 min-h-[32px] sm:min-h-[40px] text-gray-800 dark:text-gray-200 group-hover:text-[#002874]  dark:group-hover:text-[#4C6FB6] transition-colors duration-200 font-medium">
                    {product.name}
                </h3>

                <div className="mt-2">
                    <span className={`inline-flex max-w-full items-center rounded-lg px-2 py-1 text-[10px] sm:text-[11px] font-bold leading-4 ${availabilityBadgeClass}`}>
                        {availabilityLabel}
                    </span>
                </div>

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
                        disabled={isOutOfStock}
                        className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                            isOutOfStock
                                ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-800 opacity-100 scale-100'
                                : isHovered
                                ? 'opacity-100 scale-100 bg-[#002874] text-white hover:bg-[#001d5a] '
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
const AmazingProducts = ({
                             title = "پیشنهاد شگفت‌انگیز",
                             subtitle = "تا ۵۰٪ تخفیف",
                             linkText = "مشاهده همه",
                             linkHref = "/amazing",
                             countdownTarget = "2030-04-25T23:59:59",
                             products: propProducts,
                             isLoading: propLoading,
                             onAddToCart,
                             onToggleWishlist
                         }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const navigate = useNavigate();


    // مستقیم از import استفاده کن - محصولات شگفت‌انگیز رو فیلتر کن
    const allProducts = productsData.products || [];
    const amazingProductsList = propProducts || allProducts
        .filter(p => p.isAmazing)
        .sort((a, b) => Number((b.stock || 0) > 0) - Number((a.stock || 0) > 0));

    const [products, setProducts] = useState(amazingProductsList);
    const [isLoading, setIsLoading] = useState(propLoading ?? !propProducts);

    const handleSwiper = useCallback((swiper) => {
        setSwiperInstance(swiper);
    }, []);

    React.useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            if (propProducts) {
                setProducts(propProducts);
                setIsLoading(propLoading ?? false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await getCatalogProducts({
                    page: 1,
                    pageSize: 20,
                    onlyAmazing: true,
                    sort: 'discounted'
                });
                const apiProducts = response.products || [];
                if (isMounted) setProducts(apiProducts.length ? apiProducts : amazingProductsList);
            } catch (error) {
                console.warn('Could not load amazing products from API:', error);
                if (isMounted) setProducts(amazingProductsList);
            } finally {
                if (isMounted) setIsLoading(propLoading ?? false);
            }
        };

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, [propProducts, propLoading]);

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

    if (!products?.length && !isLoading) return null;

    return (
        <section className="py-3 sm:py-5" aria-labelledby="amazing-products-title">

            <h2 id="amazing-products-title" className="sr-only">{title}</h2>

            <div className="">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-orange-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    <div
                        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"

                    />

                    <div className="relative flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 xl:p-5">
                        <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
                            <div className="relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-[#002874] to-[#4C6FB6] dark:from-[#4C6FB6] dark:to-[#002874] rounded-lg sm:rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg shadow-[#002874]/30 dark:shadow-[#4C6FB6]/30">
                                <Flame size={16} className="sm:size-5 xl:size-6 text-white" />
                                <div className="absolute inset-0 rounded-lg sm:rounded-xl xl:rounded-2xl bg-gradient-to-br from-[#002874]/50 to-[#4C6FB6]/50 blur-lg -z-10 animate-pulse opacity-50" />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base xl:text-xl font-bold text-gray-900 dark:text-white">
                                    {title}
                                </h2>
                                <p className="text-[10px] sm:text-xs xl:text-sm text-gray-500 dark:text-gray-400">
                                    {subtitle}
                                </p>
                            </div>
                            <div className="hidden lg:flex items-center gap-2 ml-2 sm:ml-4 pl-2 sm:pl-4 border-r border-gray-200 dark:border-gray-700">
                                <CountdownTimer targetDate={countdownTarget} />
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
                        ) : (
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
                        )}
                    </div>

                    <div className="lg:hidden flex items-center justify-center pb-3 sm:pb-4 px-3 sm:px-4">
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#002874]/5 dark:bg-[#4C6FB6]/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                            <Clock size={14} className="sm:size-4 text-[#002874]  dark:text-[#4C6FB6]" />
                            <CountdownTimer targetDate={countdownTarget} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AmazingProducts;
