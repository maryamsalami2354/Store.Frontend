// src/components/index2/FlashDeals.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, Clock, ShoppingBag, Heart, Star, Flame, ArrowLeft } from 'lucide-react';
import useCartActions from '../../hooks/useCartActions.js';
import { compareProductAvailability, getProductAvailability } from '../../utils/helpers/productAvailability.js';
import { getCatalogProducts } from '../../services/catalogApi.js';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'react-lazy-load-image-component/src/effects/blur.css';

// =============================================================================
// CONSTANTS
// =============================================================================
const BREAKPOINTS = {
    320: { slidesPerView: 1.2, spaceBetween: 8 },
    480: { slidesPerView: 2, spaceBetween: 12 },
    640: { slidesPerView: 2.5, spaceBetween: 14 },
    768: { slidesPerView: 3, spaceBetween: 14 },
    1024: { slidesPerView: 4, spaceBetween: 16 },
    1400: { slidesPerView: 5, spaceBetween: 20 }
};

const RATING_STARS = [1, 2, 3, 4, 5];

// =============================================================================
// COUNTDOWN TIMER (Fixed – now matches AmazingProducts)
// =============================================================================
const useCountdown = (targetDate) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
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

// =============================================================================
// STAR RATING
// =============================================================================
const StarRating = ({ rating = 4 }) => (
    <div className="flex items-center gap-0.5">
        {RATING_STARS.map((i) => (
            <Star
                key={i}
                size={10}
                className={`sm:size-3 ${i <= Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
            />
        ))}
        <span className="text-[9px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-medium ms-0.5">({rating})</span>
    </div>
);

// =============================================================================
// PRODUCT CARD
// =============================================================================
const ProductCard = ({ product, onAddToCart, onToggleWishlist }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addProductToCart } = useCartActions();
    const { isOutOfStock, label: availabilityLabel, badgeClass: availabilityBadgeClass } = getProductAvailability(product);

    const handleClick = () => navigate(`/product/${product.id}`);
    const handleWishlistClick = (e) => {
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        onToggleWishlist?.(product.id);
        toast.success(`${product.name} به علاقه‌مندی‌ها اضافه شد`);
    };
    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (isOutOfStock) {
            toast.info('این محصول فعلا ناموجود است');
            return;
        }
        onAddToCart?.(product);
        addProductToCart(product);
    };

    const hasDiscount = product.discount > 0;

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
            className="relative cursor-pointer group h-full"
        >
            <div className={`relative p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 h-full flex flex-col bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 ${
                isHovered
                    ? 'shadow-lg sm:shadow-xl shadow-[#002874]/10 dark:shadow-[#4C6FB6]/20 -translate-y-1 border-[#002874]/20 dark:border-[#4C6FB6]/30'
                    : 'shadow-sm hover:shadow-md'
            }`}>
                <div className="absolute top-2 left-2 z-10">
                    {hasDiscount && (
                        <span className="bg-red-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                            {product.discount}% تخفیف
                        </span>
                    )}
                </div>

                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all duration-300 ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    } bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/30 shadow-md ${
                        isWishlisted ? 'text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'
                    }`}
                    aria-label="افزودن به علاقه‌مندی‌ها"
                >
                    <Heart size={14} className="sm:size-4" fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                <div className="relative pt-10 pb-2 overflow-hidden flex-shrink-0">
                    <LazyLoadImage
                        src={product.image}
                        alt={product.name}
                        effect="blur"
                        wrapperClassName="w-full h-24 sm:h-28 md:h-32"
                        className="w-full h-24 sm:h-28 md:h-32 object-contain transition-all duration-500 group-hover:scale-110"
                        placeholder={<div className="w-full h-24 sm:h-28 md:h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />}
                    />
                </div>

                <div className="mb-1 sm:mb-1.5">
                    <StarRating rating={product.rating} />
                </div>

                <h3 className="text-xs sm:text-sm leading-4 sm:leading-5 line-clamp-2 min-h-[32px] sm:min-h-[40px] text-gray-800 dark:text-gray-200 group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors duration-200 font-medium">
                    {product.name}
                </h3>
                <span className={`mt-1 inline-flex w-fit items-center rounded-full border px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold ${availabilityBadgeClass}`}>
                    {availabilityLabel}
                </span>

                <div className="mt-auto pt-2 sm:pt-3 flex items-end justify-between gap-1 sm:gap-2">
                    <div className="flex-1 min-w-0">
                        {product.oldPrice && (
                            <span className="text-[9px] sm:text-[11px] text-gray-400 dark:text-gray-500 line-through block mb-0.5">
                                {product.oldPrice}
                            </span>
                        )}
                        <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate block">
                            {product.price}
                            <span className="text-[8px] sm:text-[10px] ms-0.5 font-normal text-gray-500 dark:text-gray-400">تومان</span>
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
// MAIN COMPONENT (FlashDeals)
// =============================================================================
const FlashDeals = ({
                        title = "پیشنهادات لحظه‌ای",
                        subtitle = "فرصت رو از دست نده!",
                        linkText = "مشاهده همه",
                        linkHref = "/flash-deals",
                        countdownTarget = "2030-04-25T23:59:59", // تاریخ درست (آینده)
                        onAddToCart,
                        onToggleWishlist
                    }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [swiperReady, setSwiperReady] = useState(false);

    const allProducts = [];
    const fallbackFlashProducts = allProducts.filter(p => p.isAmazing === true).sort(compareProductAvailability).slice(0, 12);
    const [flashProducts, setFlashProducts] = useState(fallbackFlashProducts);

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            try {
                const response = await getCatalogProducts({
                    page: 1,
                    pageSize: 20,
                    onlyAmazing: true,
                    sort: 'discounted'
                });
                const apiProducts = response.products || [];
                if (isMounted && apiProducts.length) setFlashProducts(apiProducts.slice(0, 12));
            } catch (error) {
                console.warn('Could not load flash deals from API:', error);
                if (isMounted) setFlashProducts(fallbackFlashProducts);
            }
        };

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (swiperReady) {
            const timer = setTimeout(() => {
                if (navigationPrevRef.current && navigationNextRef.current) {
                    const prevBtn = navigationPrevRef.current;
                    const nextBtn = navigationNextRef.current;
                    prevBtn.classList.remove('swiper-button-disabled', 'opacity-40', 'cursor-not-allowed');
                    nextBtn.classList.remove('swiper-button-disabled', 'opacity-40', 'cursor-not-allowed');
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [swiperReady, flashProducts]);

    if (!flashProducts.length) return null;

    return (
        <section className="py-3 sm:py-5">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-orange-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800">

                {/* Header */}
                <div className="relative flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 xl:p-5">
                    <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
                        <div className="relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg sm:rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <Flame size={16} className="sm:size-5 xl:size-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm sm:text-base xl:text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                            <p className="text-[10px] sm:text-xs xl:text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                        </div>
                        <div className="hidden lg:flex items-center gap-2 mr-2 sm:mr-4 pr-2 sm:pr-4 border-r border-gray-200 dark:border-gray-700">
                            <CountdownTimer targetDate={countdownTarget} />
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 xl:gap-3">
                        <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100/80 dark:bg-[#111] p-0.5 sm:p-1 rounded-lg sm:rounded-xl">
                            <button
                                ref={navigationPrevRef}
                                className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1c20] hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-all duration-200"
                                aria-label="قبلی"
                            >
                                <ChevronRight size={16} className="sm:size-5" />
                            </button>
                            <div className="hidden sm:block w-px h-4 sm:h-5 bg-gray-300 dark:bg-gray-700 mx-0.5" />
                            <button
                                ref={navigationNextRef}
                                className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1c20] hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-all duration-200"
                                aria-label="بعدی"
                            >
                                <ChevronLeft size={16} className="sm:size-5" />
                            </button>
                        </div>
                        <Link
                            to={linkHref}
                            className="flex items-center gap-1 px-2 sm:px-3 xl:px-4 py-1.5 sm:py-2 xl:py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs xl:text-sm font-medium rounded-lg sm:rounded-xl hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-500 dark:hover:text-orange-500 hover:shadow-sm transition-all duration-200 group"
                        >
                            <span className="hidden xs:inline">{linkText}</span>
                            <ArrowLeft size={14} className="sm:size-4 transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                    </div>
                </div>

                {/* Swiper Slider */}
                <div className="relative px-3 sm:px-4 xl:px-5 pb-3 sm:pb-4 xl:pb-5">
                    <Swiper
                        modules={[Navigation, FreeMode]}
                        spaceBetween={10}
                        slidesPerView={1.2}
                        freeMode={{ enabled: true, sticky: true }}
                        breakpoints={BREAKPOINTS}
                        dir="rtl"
                        className="!overflow-visible"
                        observer={true}
                        observeParents={true}
                        navigation={{
                            prevEl: navigationPrevRef.current,
                            nextEl: navigationNextRef.current,
                        }}
                        onInit={(swiper) => {
                            setTimeout(() => {
                                if (swiper.navigation) {
                                    swiper.navigation.update();
                                }
                                setSwiperReady(true);
                            }, 50);
                        }}
                        onSlideChange={(swiper) => {
                            if (swiper.navigation) {
                                swiper.navigation.update();
                            }
                        }}
                    >
                        {flashProducts.map((product) => (
                            <SwiperSlide key={product.id} className="!h-auto">
                                <ProductCard
                                    product={product}
                                    onAddToCart={onAddToCart}
                                    onToggleWishlist={onToggleWishlist}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Mobile Timer */}
                <div className="lg:hidden flex items-center justify-center pb-3 sm:pb-4 px-3 sm:px-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-[#002874]/5 dark:bg-[#4C6FB6]/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                        <CountdownTimer targetDate={countdownTarget} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FlashDeals;
