import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ChevronLeft, ChevronRight, Flame, ArrowLeft } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import productsData from '../../../../public/jsons/products.json';
import { compareProductAvailability, getProductAvailability } from '../../../utils/helpers/productAvailability.js';
import { getCatalogProducts } from '../../../services/catalogApi.js';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-loading-skeleton/dist/skeleton.css';

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
    1200: { slidesPerView: 4.5, spaceBetween:18 },
    1400: { slidesPerView: 5, spaceBetween: 20 },
    1600: { slidesPerView: 5.5, spaceBetween: 20 }
};

const ITEMS_PER_SLIDE = 3;

// =============================================================================
// SKELETON CARD
// =============================================================================
const NewProductCardSkeleton = () => (
    <div className="flex py-2 px-3 rounded-xl bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 items-center justify-between">
        <div className="w-1/6 border-e-2 border-gray-200 dark:border-gray-700">
            <div className="text-center">
                <Skeleton width={40} height={32} className="mx-auto" />
            </div>
        </div>

        <div className="w-3/6 space-y-1 ps-3">
            <Skeleton count={2} height={16} />
        </div>

        <figure className="w-2/6">
            <div className="text-end flex justify-end">
                <Skeleton width={64} height={64} className="sm:!w-20 sm:!h-20" />
            </div>
        </figure>
    </div>
);

// =============================================================================
// PRODUCT CARD
// =============================================================================
const NewProductCardGrid = ({ product, rank, navigate }) => {
    const handleClick = useCallback(() => {
        navigate(`/product/${product.id}`);
    }, [navigate, product.id]);
    const { label: availabilityLabel, badgeClass: availabilityBadgeClass } = getProductAvailability(product);

    return (
        <article
            onClick={handleClick}
            className="flex py-2 px-3 rounded-xl cursor-pointer
                bg-white dark:bg-[#111111]
                border border-gray-100 dark:border-gray-800
                hover:bg-gray-50 dark:hover:bg-[#1a1c20]
                hover:border-[#002874]/20 dark:hover:border-[#4C6FB6]/30
                hover:shadow-md transition-all duration-200
                items-center justify-between"
        >
            <div className="w-1/6 border-e-2 border-gray-200 dark:border-gray-700">
                <div className="text-center">
                    <span className="font-bold text-2xl sm:text-3xl text-[#002874]  dark:text-[#4C6FB6]">
                        {rank.toLocaleString('fa-IR')}
                    </span>
                </div>
            </div>

            <div className="w-3/6 space-y-1 ps-3">
                <h3 className="font-bold leading-6 line-clamp-2 text-xs sm:text-sm text-gray-900 dark:text-gray-200">
                    {product.name}
                </h3>
                <span className={`inline-flex w-fit items-center rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${availabilityBadgeClass}`}>
                    {availabilityLabel}
                </span>
            </div>

            <figure className="w-2/6">
                <div className="text-end flex justify-end">
                    <LazyLoadImage
                        src={product.image}
                        alt={product.name}
                        effect="blur"
                        className="size-16 sm:size-20 object-contain"
                        wrapperClassName="size-16 sm:size-20"
                        placeholder={
                            <div className="size-16 sm:size-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
                        }
                    />
                </div>
            </figure>
        </article>
    );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const NewProductsGrid = ({
                             title = "جدیدترین محصولات",
                             subtitle = "بروزترین محصولات بازار",
                             linkText = "مشاهده همه",
                             linkHref = "/new-products"
                         }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // شبیه‌سازی لود دیتا
    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);

            // شبیه‌سازی delay برای نمایش skeleton
            await new Promise(resolve => setTimeout(resolve, 1));

            const response = await getCatalogProducts({ page: 1, pageSize: 200, sort: 'newest' });
            const allProducts = response.products?.length ? response.products : productsData.products || [];
            const newProducts = allProducts.filter(p => p.isNew === true);
            const sortedProducts = [...newProducts].sort((a, b) => compareProductAvailability(a, b) || b.id - a.id);

            setProducts(sortedProducts);
            setIsLoading(false);
        };

        loadProducts();
    }, []);

    const groupedProducts = [];
    for (let i = 0; i < products.length; i += ITEMS_PER_SLIDE) {
        groupedProducts.push(products.slice(i, i + ITEMS_PER_SLIDE));
    }

    const handleSwiper = useCallback((swiper) => {
        setSwiperInstance(swiper);
    }, []);

    useEffect(() => {
        if (swiperInstance && navigationPrevRef.current && navigationNextRef.current) {
            swiperInstance.params.navigation.prevEl = navigationPrevRef.current;
            swiperInstance.params.navigation.nextEl = navigationNextRef.current;

            if (swiperInstance.navigation) {
                swiperInstance.navigation.destroy();
                swiperInstance.navigation.init();
                swiperInstance.navigation.update();
            }
        }
    }, [swiperInstance, groupedProducts]);

    // گروه‌بندی skeleton ها
    const skeletonGroups = [];
    for (let i = 0; i < 6; i += ITEMS_PER_SLIDE) {
        skeletonGroups.push(Array.from({ length: ITEMS_PER_SLIDE }, (_, idx) => i + idx));
    }

    return (
        <section className="py-3 sm:py-5" aria-labelledby="new-products-title">
            <h2 id="new-products-title" className="sr-only">{title}</h2>

            <div className="">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" />

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
                                modules={[FreeMode]}
                                spaceBetween={10}
                                slidesPerView={1.2}
                                freeMode={{ enabled: true, sticky: true }}
                                breakpoints={BREAKPOINTS}
                                dir="rtl"
                                className="!overflow-visible"
                            >
                                {skeletonGroups.map((group, groupIndex) => (
                                    <SwiperSlide key={groupIndex} className="!h-auto">
                                        <div className="space-y-3">
                                            {group.map((idx) => (
                                                <NewProductCardSkeleton key={idx} />
                                            ))}
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <Swiper
                                key={`swiper-${groupedProducts.length}`}
                                modules={[Navigation, FreeMode]}
                                onSwiper={handleSwiper}
                                navigation={{
                                    prevEl: navigationPrevRef.current,
                                    nextEl: navigationNextRef.current,
                                    disabledClass: 'swiper-button-disabled'
                                }}
                                spaceBetween={10}
                                slidesPerView={1.2}
                                freeMode={{ enabled: true, sticky: true }}
                                breakpoints={BREAKPOINTS}
                                dir="rtl"
                                watchOverflow={true}
                                observer={true}
                                observeParents={true}
                                className="!overflow-visible"
                            >
                                {groupedProducts.map((group, groupIndex) => (
                                    <SwiperSlide key={groupIndex} className="!h-auto">
                                        <div className="space-y-3">
                                            {group.map((product, idx) => {
                                                const globalRank = groupIndex * ITEMS_PER_SLIDE + idx + 1;
                                                return (
                                                    <NewProductCardGrid
                                                        key={product.id}
                                                        product={product}
                                                        rank={globalRank}
                                                        navigate={navigate}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewProductsGrid;
