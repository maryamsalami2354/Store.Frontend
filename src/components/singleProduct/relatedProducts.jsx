// src/components/singleProduct/relatedProducts.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Star } from 'react-feather';
import { toast } from 'react-toastify';
import useCartActions from '../../hooks/useCartActions.js';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'react-lazy-load-image-component/src/effects/blur.css';

const BREAKPOINTS = {
    320: { slidesPerView: 1.2, spaceBetween: 8 },
    400: { slidesPerView: 1.5, spaceBetween: 10 },
    480: { slidesPerView: 2, spaceBetween: 12 },
    640: { slidesPerView: 2.5, spaceBetween: 14 },
    768: { slidesPerView: 3, spaceBetween: 14 },
    1024: { slidesPerView: 4, spaceBetween: 16 },
    1400: { slidesPerView: 5, spaceBetween: 20 },
};

const RelatedProducts = ({ products = [] }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const { addProductToCart } = useCartActions();

    useEffect(() => {
        if (swiperInstance && navigationPrevRef.current && navigationNextRef.current) {
            if (swiperInstance.navigation) swiperInstance.navigation.destroy();
            swiperInstance.params.navigation = {
                prevEl: navigationPrevRef.current,
                nextEl: navigationNextRef.current,
                disabledClass: 'swiper-button-disabled'
            };
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);

    if (!products.length) return null;

    const formatPrice = (price) => Number((price || '0').replace(/[^\d]/g, '')).toLocaleString('fa-IR');

    return (
        <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-[#002874]/20 to-[#4C6FB6]/20">
                        <ShoppingBag size={18} className="text-[#002874]  dark:text-[#4C6FB6]" />
                    </div>
                    <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">محصولات مرتبط</h2>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button ref={navigationPrevRef} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition disabled:opacity-40">
                        <ChevronRight size={18} />
                    </button>
                    <button ref={navigationNextRef} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition disabled:opacity-40">
                        <ChevronLeft size={18} />
                    </button>
                </div>
            </div>

            {/* Swiper */}
            <div className="relative overflow-hidden pb-2">
                <Swiper
                    modules={[Navigation, FreeMode]}
                    onSwiper={setSwiperInstance}
                    spaceBetween={10}
                    slidesPerView={1.2}
                    freeMode={{ enabled: true, sticky: true }}
                    breakpoints={BREAKPOINTS}
                    dir="rtl"
                    className="!overflow-visible"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product.id} className="!h-auto">
                            <Link
                                to={`/product/${product.id}`}
                                className="group bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                            >
                                {/* تصویر */}
                                <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 p-4">
                                    <LazyLoadImage
                                        src={product.image}
                                        alt={product.name}
                                        effect="blur"
                                        wrapperClassName="w-full h-36 sm:h-44 block"
                                        className="w-full h-36 sm:h-44 object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {product.discount > 0 && (
                                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-lg">٪{product.discount}</span>
                                    )}
                                    {product.isNew && (
                                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg">جدید</span>
                                    )}
                                    {/* دکمه علاقه‌مندی */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toast.success('به علاقه‌مندی‌ها اضافه شد');
                                        }}
                                        className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
                                    >
                                        <Heart size={14} />
                                    </button>
                                </div>

                                {/* اطلاعات */}
                                <div className="p-3 flex flex-col flex-1">
                                    {/* ستاره‌ها */}
                                    <div className="flex items-center gap-0.5 mb-1.5">
                                        {[1,2,3,4,5].map(i => (
                                            <Star key={i} size={10} className={i <= Math.floor(product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                                        ))}
                                        <span className="text-[10px] text-gray-500 mr-1">({product.rating || 0})</span>
                                    </div>

                                    {/* نام محصول */}
                                    <h3 className="text-xs sm:text-sm leading-5 line-clamp-2 min-h-[40px] text-gray-800 dark:text-gray-200 group-hover:text-[#002874]  dark:group-hover:text-[#4C6FB6] transition-colors font-medium mb-2">
                                        {product.name}
                                    </h3>

                                    {/* قیمت و دکمه خرید */}
                                    <div className="mt-auto flex items-end justify-between gap-2">
                                        <div className="min-w-0">
                                            {product.oldPrice && (
                                                <span className="text-[10px] text-gray-400 line-through block">{product.oldPrice}</span>
                                            )}
                                            <span className="font-bold text-sm text-gray-900 dark:text-white block truncate">
                                                {formatPrice(product.price)}
                                                <span className="text-[10px] font-normal text-gray-500 mr-1">تومان</span>
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addProductToCart(product);
                                            }}
                                            className="flex-shrink-0 p-2 rounded-lg bg-[#002874] text-white hover:bg-[#001d5a] transition opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                                        >
                                            <ShoppingBag size={14} />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default RelatedProducts;
