import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from 'react-loading-skeleton';
import { ChevronLeft, ChevronRight, Grid, ArrowLeft } from 'lucide-react';
import { getCatalogCategories } from '../../../services/catalogApi.js';
import 'react-loading-skeleton/dist/skeleton.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ErrorOnFetchApi from "../../common/ErrorOnFetchApi/index.js";

// =============================================================================
// CONSTANTS
// =============================================================================
const BREAKPOINTS = {
    320: { slidesPerView: 1.5, spaceBetween: 8 },
    360: { slidesPerView: 1.8, spaceBetween: 10 },
    400: { slidesPerView: 2, spaceBetween: 10 },
    480: { slidesPerView: 2.3, spaceBetween: 12 },
    560: { slidesPerView: 2.8, spaceBetween: 12 },
    640: { slidesPerView: 3, spaceBetween: 14 },
    768: { slidesPerView: 3.5, spaceBetween: 14 },
    900: { slidesPerView: 4, spaceBetween: 16 },
    1024: { slidesPerView: 4.5, spaceBetween: 16 },
    1200: { slidesPerView: 5, spaceBetween: 18 },
    1400: { slidesPerView: 5.5, spaceBetween: 20 },
    1600: { slidesPerView: 6, spaceBetween: 20 }
};

const SKELETON_COUNT = 6;

// =============================================================================
// COMPONENTS
// =============================================================================
const CategoryCard = ({ category }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <Link
            to={`/category/${category.id}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative cursor-pointer group h-full block"
        >
            <div
                className={`relative p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 h-full flex flex-col bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 ${
                    isHovered
                        ? 'shadow-lg sm:shadow-xl shadow-[#002874]/10 dark:shadow-[#4C6FB6]/20 -translate-y-1 border-[#002874]/20 dark:border-[#4C6FB6]/30'
                        : 'shadow-sm hover:shadow-md'
                }`}
            >
                <div className="relative pt-8 sm:pt-10 pb-2 sm:pb-3 overflow-hidden flex-shrink-0">
                    <div className="aspect-square p-5 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#002874]/5 to-[#4C6FB6]/5 dark:from-[#002874]/20 dark:to-[#4C6FB6]/20">
                        <LazyLoadImage
                            src={category.banner || '/images/placeholder-category.jpg'}
                            alt={category.name}
                            effect="blur"
                            wrapperClassName="w-full h-full"
                            className="object-contain transition-all duration-500 group-hover:scale-110"
                            placeholder={<div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />}
                        />
                    </div>
                </div>
                <h3 className="text-xs sm:text-sm text-center text-gray-800 dark:text-gray-200 group-hover:text-[#002874]  dark:group-hover:text-[#4C6FB6] transition-colors font-medium mt-1 line-clamp-1">
                    {category.name}
                </h3>
                {category.subcategories?.length > 0 && (
                    <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 text-center mt-0.5">
                        {category.subcategories.length} زیردسته
                    </p>
                )}
            </div>
        </Link>
    );
};

const CategorySkeletonCard = () => (
    <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 shadow-sm h-full">
        <div className="relative pt-8 sm:pt-10 pb-2 sm:pb-3">
            <Skeleton className="aspect-square w-full rounded-xl" />
        </div>
        <Skeleton width="80%" height={16} className="mt-2 mx-auto" />
        <Skeleton width="40%" height={12} className="mt-1 mx-auto" />
    </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const CategoriesSlider = () => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [navigationReady, setNavigationReady] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getCatalogCategories();
                setCategories(data.categories || []);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message || 'خطا در دریافت دسته‌بندی‌ها');
            } finally {
                setIsLoading(false);
            }
        };
        loadCategories();
    }, []);

    const handleSwiper = useCallback((swiper) => {
        setSwiperInstance(swiper);
        // تاخیر کوچک برای اطمینان از رندر کامل
        setTimeout(() => {
            setNavigationReady(true);
        }, 100);
    }, []);

    useEffect(() => {
        if (swiperInstance && navigationPrevRef.current && navigationNextRef.current && navigationReady) {
            // تنظیم ناوبری با رفرنس‌های جدید
            if (swiperInstance.params.navigation) {
                swiperInstance.params.navigation.prevEl = navigationPrevRef.current;
                swiperInstance.params.navigation.nextEl = navigationNextRef.current;
            }

            // راه‌اندازی مجدد ناوبری
            if (swiperInstance.navigation) {
                swiperInstance.navigation.destroy();
                swiperInstance.navigation.init();
                swiperInstance.navigation.update();
            }
        }
    }, [swiperInstance, navigationReady, categories]); // اضافه کردن categories به dependency

    const handleRetry = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getCatalogCategories();
            setCategories(data.categories || []);
        } catch (err) {
            setError(err.message || 'خطا در دریافت دسته‌بندی‌ها');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // خطا
    if (error) {
        return (
            <ErrorOnFetchApi message={error.message} onRetry={handleRetry} />
        );
    }

    // بارگذاری اولیه (اسکلتون)
    if (isLoading) {
        return (
            <section className="py-3 sm:py-5">
                <div className="">
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800">
                        <div className="relative flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 xl:p-5">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Skeleton width={40} height={40} circle />
                                <div>
                                    <Skeleton width={100} height={20} />
                                    <Skeleton width={60} height={12} className="mt-1" />
                                </div>
                            </div>
                            <Skeleton width={120} height={32} />
                        </div>
                        <div className="relative px-3 sm:px-4 xl:px-5 pb-3 sm:pb-4 xl:pb-5">
                            <Swiper
                                modules={[Navigation, FreeMode]}
                                spaceBetween={10}
                                slidesPerView={1.5}
                                freeMode
                                breakpoints={BREAKPOINTS}
                                dir="rtl"
                            >
                                {[...Array(SKELETON_COUNT)].map((_, i) => (
                                    <SwiperSlide key={i}>
                                        <CategorySkeletonCard />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // داده‌ای وجود ندارد
    if (!categories.length) return null;

    // نمایش داده‌ها
    return (
        <section className="py-3 sm:py-5">
            <div className="">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800">
                    <div className="relative flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 xl:p-5">
                        <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
                            <div className="relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-[#002874] to-[#4C6FB6] rounded-lg sm:rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg shadow-[#002874]/30">
                                <Grid size={16} className="sm:size-5 xl:size-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base xl:text-xl font-bold text-gray-900 dark:text-white">
                                    دسته‌بندی‌های
                                </h2>
                                <p className="text-[10px] sm:text-xs xl:text-sm text-gray-500 dark:text-gray-400">
                                    محصولات متنوع
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 xl:gap-3">
                            <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100/80 dark:bg-[#111] p-0.5 sm:p-1 rounded-lg sm:rounded-xl">
                                <button
                                    ref={navigationPrevRef}
                                    className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1c20] hover:text-[#002874]  disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="اسلاید قبلی"
                                >
                                    <ChevronRight size={16} />
                                </button>
                                <div className="hidden sm:block w-px h-4 sm:h-5 bg-gray-300 dark:bg-gray-700 mx-0.5" />
                                <button
                                    ref={navigationNextRef}
                                    className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1a1c20] hover:text-[#002874]  disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="اسلاید بعدی"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                            </div>
                            <Link
                                to="/categories"
                                className="flex items-center gap-1 px-2 sm:px-3 xl:px-4 py-1.5 sm:py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs font-medium rounded-lg hover:border-[#002874] hover:text-[#002874]  group"
                            >
                                <span className="hidden xs:inline">مشاهده همه</span>
                                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                            </Link>
                        </div>
                    </div>
                    <div className="relative px-3 sm:px-4 xl:px-5 pb-3 sm:pb-4 xl:pb-5">
                        <Swiper
                            key={`swiper-${categories.length}`} // کلید منحصربفرد برای بازسازی Swiper
                            modules={[Navigation, FreeMode]}
                            onSwiper={handleSwiper}
                            navigation={{
                                prevEl: navigationPrevRef.current,
                                nextEl: navigationNextRef.current,
                                disabledClass: 'swiper-button-disabled'
                            }}
                            spaceBetween={10}
                            slidesPerView={1.5}
                            freeMode={{
                                enabled: true,
                                momentum: true,
                                momentumRatio: 0.5
                            }}
                            breakpoints={BREAKPOINTS}
                            dir="rtl"
                            watchOverflow={true}
                            observer={true}
                            observeParents={true}
                        >
                            {categories.map((cat) => (
                                <SwiperSlide key={cat.id}>
                                    <CategoryCard category={cat} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoriesSlider;
