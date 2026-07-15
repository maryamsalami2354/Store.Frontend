// =============================================================================
// FILE: brandsFeatured.jsx
// =============================================================================
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star } from 'react-feather';
import brandsCard from './brandsCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const BREAKPOINTS = {
    320: { slidesPerView: 1.5, spaceBetween: 10 },
    480: { slidesPerView: 2, spaceBetween: 12 },
    640: { slidesPerView: 2.5, spaceBetween: 14 },
    768: { slidesPerView: 3, spaceBetween: 16 },
    1024: { slidesPerView: 4, spaceBetween: 16 },
    1280: { slidesPerView: 5, spaceBetween: 18 },
};

const BrandsFeatured = ({ brands = [] }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [swiper, setSwiper] = useState(null);

    const handleSwiper = useCallback((s) => setSwiper(s), []);

    useEffect(() => {
        if (swiper && prevRef.current && nextRef.current) {
            if (swiper.navigation) swiper.navigation.destroy();
            swiper.params.navigation = { prevEl: prevRef.current, nextEl: nextRef.current };
            swiper.navigation.init();
            swiper.navigation.update();
        }
    }, [swiper]);

    if (!brands.length) return null;

    return (
        <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <Star size={18} className="text-amber-400 fill-amber-400" />
                    برندهای ویژه
                </h2>
                <div className="flex items-center gap-1">
                    <button ref={prevRef} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <ChevronRight size={16} />
                    </button>
                    <button ref={nextRef} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Navigation, FreeMode, Autoplay]}
                onSwiper={handleSwiper}
                spaceBetween={12}
                slidesPerView={1.5}
                freeMode
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={BREAKPOINTS}
                dir="rtl"
                className="!overflow-visible"
            >
                {brands.map(brand => (
                    <SwiperSlide key={brand.id} className="!h-auto">
                        {React.createElement(brandsCard, { brand, viewMode: 'grid' })}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BrandsFeatured;