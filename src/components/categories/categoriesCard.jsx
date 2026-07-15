// =============================================================================
// FILE: categoriesCard.jsx
// =============================================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Grid, Package, Award, Star, ChevronLeft } from 'react-feather';
import 'react-lazy-load-image-component/src/effects/blur.css';

const iconMap = { Smartphone: Grid, Watch: Grid, Home: Grid, Coffee: Grid, Tool: Grid, BagIcon: Grid };

const CategoriesCard = ({ category, viewMode = 'grid' }) => {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => navigate(`/category/${category.id}`);
    const getIcon = (iconName) => {
        const Icon = iconMap[iconName] || Grid;
        return <Icon size={30} className="text-[#002874] dark:text-[#4C6FB6]" />;
    };

    if (viewMode === 'list') {
        return (
            <div onClick={handleClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
                 className="cursor-pointer group bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 flex items-center gap-4 hover:shadow-lg hover:border-[#002874]/20 dark:hover:border-[#4C6FB6]/20 transition-all duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#002874]/5 to-[#4C6FB6]/10 dark:from-[#002874]/20 dark:to-[#4C6FB6]/20 p-3 flex items-center justify-center">
                    {!imgError && category.banner ? (
                        <LazyLoadImage src={category.banner} alt={category.name} effect="blur" className="w-full h-full object-cover rounded-xl" onError={() => setImgError(true)} />
                    ) : getIcon(category.icon)}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors">{category.name}</h3>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Package size={11} />{category.productsCount.toLocaleString('fa-IR')} محصول</span>
                        <span className="flex items-center gap-1"><Award size={11} />{category.brandsCount} برند</span>
                        {category.subcategoriesCount > 0 && <span className="flex items-center gap-1"><Grid size={11} />{category.subcategoriesCount} زیردسته</span>}
                    </div>
                </div>
                <ChevronLeft size={18} className={`flex-shrink-0 text-gray-300 transition-all duration-300 ${isHovered ? 'opacity-100 -translate-x-0' : 'opacity-0 translate-x-2'}`} />
            </div>
        );
    }

    return (
        <div onClick={handleClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="cursor-pointer group h-full">
            <div className={`h-full bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col items-center text-center transition-all duration-300 ${isHovered ? 'shadow-xl shadow-[#002874]/5 dark:shadow-[#4C6FB6]/5 -translate-y-1 border-[#002874]/20' : ''}`}>
                {category.isFeatured && <span className="self-end mb-1 px-2 py-0.5 bg-amber-400 text-white text-[10px] font-bold rounded-lg">ویژه</span>}

                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#002874]/5 to-[#4C6FB6]/10 dark:from-[#002874]/20 dark:to-[#4C6FB6]/20 p-4 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    {!imgError && category.banner ? (
                        <LazyLoadImage src={category.banner} alt={category.name} effect="blur" className="w-full h-full object-cover rounded-xl" onError={() => setImgError(true)} />
                    ) : getIcon(category.icon)}
                </div>

                <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors line-clamp-1 mb-2">{category.name}</h3>

                {category.subcategories && category.subcategories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 mb-3">
                        {category.subcategories.slice(0, 3).map(sub => (
                            <span key={sub.id} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 dark:text-gray-400 rounded-lg">{sub.name}</span>
                        ))}
                        {category.subcategories.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-400 rounded-lg">+{category.subcategories.length - 3}</span>
                        )}
                    </div>
                )}

                <div className="mt-auto w-full pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Package size={11} />{category.productsCount.toLocaleString('fa-IR')}</span>
                    <span className="flex items-center gap-1"><Award size={11} />{category.brandsCount}</span>
                    {category.avgRating > 0 && <span className="flex items-center gap-1 text-amber-500"><Star size={11} className="fill-amber-400" />{category.avgRating}</span>}
                </div>
            </div>
        </div>
    );
};

export default CategoriesCard;