// src/components/index2/TopRatedProducts.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Heart, Award, ArrowLeft } from 'lucide-react';
import productsData from '../../../public/jsons/products.json';
import useCartActions from '../../hooks/useCartActions.js';
import { compareProductAvailability, getProductAvailability } from '../../utils/helpers/productAvailability.js';
import { getCatalogProducts } from '../../services/catalogApi.js';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const BREAKPOINTS = {
    320: { slidesPerView: 1.5, spaceBetween: 12 },
    480: { slidesPerView: 2, spaceBetween: 15 },
    640: { slidesPerView: 2.5, spaceBetween: 15 },
    768: { slidesPerView: 3, spaceBetween: 18 },
    1024: { slidesPerView: 4, spaceBetween: 20 },
    1400: { slidesPerView: 5, spaceBetween: 20 }
};

const TopRatedProducts = ({
                              title = "محصولات برتر",
                              subtitle = "با بالاترین امتیاز کاربران",
                              linkText = "مشاهده همه",
                              linkHref = "/top-rated",
                              onAddToCart,
                              onToggleWishlist
                          }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [products, setProducts] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const navigate = useNavigate();
    const { addProductToCart } = useCartActions();

    useEffect(() => {
        let isMounted = true;

        setIsMounted(true);
        const loadProducts = async () => {
            const allProducts = productsData.products || [];
            const fallbackProducts = [...allProducts]
                .sort((a, b) => compareProductAvailability(a, b) || (b.rating || 0) - (a.rating || 0))
                .slice(0, 12);

            try {
                const response = await getCatalogProducts({ page: 1, pageSize: 20, sort: 'popular' });
                const apiProducts = response.products || [];
                if (isMounted) {
                    setProducts((apiProducts.length ? apiProducts : fallbackProducts)
                        .sort((a, b) => compareProductAvailability(a, b) || (b.rating || 0) - (a.rating || 0))
                        .slice(0, 12));
                }
            } catch (error) {
                console.warn('Could not load top rated products from API:', error);
                if (isMounted) setProducts(fallbackProducts);
            }
        };

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSwiper = useCallback((swiper) => {
        if (isMounted) setSwiperInstance(swiper);
    }, [isMounted]);

    useEffect(() => {
        if (!isMounted) return;
        const timer = setTimeout(() => {
            if (swiperInstance && navigationPrevRef.current && navigationNextRef.current) {
                try {
                    if (swiperInstance.navigation) swiperInstance.navigation.destroy();
                    swiperInstance.params.navigation = {
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current,
                        disabledClass: 'swiper-button-disabled'
                    };
                    if (swiperInstance.navigation) {
                        swiperInstance.navigation.init();
                        swiperInstance.navigation.update();
                    }
                } catch (err) {
                    console.warn('Swiper navigation error:', err);
                }
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [swiperInstance, products, isMounted]);

    if (!products.length) return null;

    return (
        <section className="py-3 sm:py-5">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-yellow-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800">
                {/* Header */}
                <div className="relative flex flex-wrap items-center justify-between gap-2 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <Award size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-[#111] p-1 rounded-lg">
                            <button ref={navigationPrevRef} className="p-2 rounded-lg hover:bg-white transition-colors">
                                <ChevronRight size={18} />
                            </button>
                            <div className="w-px h-5 bg-gray-300 mx-0.5" />
                            <button ref={navigationNextRef} className="p-2 rounded-lg hover:bg-white transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                        </div>
                        <Link to={linkHref} className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:border-amber-500 hover:text-amber-500 transition-all">
                            <span className="hidden sm:inline">{linkText}</span>
                            <ArrowLeft size={14} />
                        </Link>
                    </div>
                </div>

                {/* Swiper Slider - عکس‌ها داخل باکس می‌مانند */}
                <div className="relative px-4 pb-5">
                    <Swiper
                        modules={[Navigation, FreeMode]}
                        onSwiper={handleSwiper}
                        spaceBetween={12}
                        slidesPerView={1.5}
                        freeMode={{ enabled: true, sticky: true }}
                        breakpoints={BREAKPOINTS}
                        dir="rtl"
                        className="!overflow-visible"
                        observer={true}
                        observeParents={true}
                    >
                        {products.map((product) => {
                            const { isOutOfStock, label: availabilityLabel, badgeClass: availabilityBadgeClass } = getProductAvailability(product);

                            return (
                            <SwiperSlide key={product.id} className="!h-auto">
                                <div
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    className="cursor-pointer bg-white dark:bg-[#111111] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    {/* بخش عکس - با پس‌زمینه و padding برای جلوگیری از خروج عکس */}
                                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 p-6 flex items-center justify-center h-52">
                                        <LazyLoadImage
                                            src={product.image}
                                            alt={product.name}
                                            effect="blur"
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                            placeholder={<div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />}
                                        />
                                        {/* نشان امتیاز */}
                                        <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                                            <Star size={10} className="fill-white" />
                                            {product.rating}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleWishlist?.(product.id);
                                                toast.success(`${product.name} به علاقه‌مندی‌ها اضافه شد`);
                                            }}
                                            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-md text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                                        >
                                            <Heart size={14} />
                                        </button>
                                        {/* برچسب تخفیف */}
                                        {product.discount > 0 && (
                                            <div className="absolute bottom-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                                                {product.discount}% تخفیف
                                            </div>
                                        )}
                                    </div>

                                    {/* متن محصول */}
                                    <div className="p-3">
                                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 min-h-[42px] group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors">
                                            {product.name}
                                        </h3>
                                        <span className={`mt-2 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${availabilityBadgeClass}`}>
                                            {availabilityLabel}
                                        </span>
                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                                            <div>
                                                {product.oldPrice && (
                                                    <span className="text-[10px] text-gray-400 line-through block">
                                                        {product.oldPrice}
                                                    </span>
                                                )}
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {product.price}
                                                    <span className="text-[9px] mr-0.5 font-normal text-gray-500">تومان</span>
                                                </span>
                                            </div>
                                            <button
                                                disabled={isOutOfStock}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isOutOfStock) {
                                                        toast.info('این محصول فعلا ناموجود است');
                                                        return;
                                                    }
                                                    onAddToCart?.(product);
                                                    addProductToCart(product);
                                                }}
                                                className={`p-2 rounded-lg transition-colors shadow-md ${isOutOfStock ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600' : 'bg-[#002874] text-white hover:bg-[#001d5a]'}`}
                                            >
                                                <ShoppingBag size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default TopRatedProducts;
