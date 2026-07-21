// =============================================================================
// FILE: categoryTopBrands.jsx (اصلاح‌شده - ریسپانسیو + overflow)
// =============================================================================
import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { Award } from 'react-feather';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/free-mode';

const CategoryTopBrands = ({ categoryProducts = [] }) => {
    const availableBrands = useMemo(() => {
        const brandsMap = new Map();

        categoryProducts.forEach(product => {
            if (!product.brandId) return;

            const current = brandsMap.get(product.brandId) || {
                id: product.brandId,
                name: product.brandName || 'نامشخص',
                logo: product.brandLogo,
                productCount: 0,
            };

            current.productCount += 1;
            brandsMap.set(product.brandId, current);
        });

        return [...brandsMap.values()];
    }, [categoryProducts]);

    if (availableBrands.length === 0) return null;

    return (
        <div className="mb-6 overflow-hidden">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Award size={16} className="text-amber-400" />
                برندهای برتر این دسته
            </h3>
            <Swiper
                modules={[FreeMode]}
                freeMode
                spaceBetween={10}
                slidesPerView="auto"
                dir="rtl"
                className="!overflow-visible"
            >
                {availableBrands.map(brand => (
                    <SwiperSlide key={brand.id} style={{ width: 'auto' }}>
                        <Link
                            to={`/brand/${brand.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-[#002874]/30 dark:hover:border-[#4C6FB6]/30 transition-all whitespace-nowrap"
                        >
                            {brand.logo ? (
                                <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain rounded flex-shrink-0" />
                            ) : (
                                <Award size={16} className="text-gray-400 flex-shrink-0" />
                            )}
                            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{brand.name}</span>
                            <span className="text-[10px] text-gray-400">({brand.productCount})</span>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CategoryTopBrands;
