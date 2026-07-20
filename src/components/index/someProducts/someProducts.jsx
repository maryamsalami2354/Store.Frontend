// src/components/SomeProducts/SomeProducts.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
    ChevronLeft, ChevronRight, Zap, ArrowLeft,
    Heart, ShoppingBag, Star, TrendingUp, Sparkles
} from 'lucide-react';
// ایمپورت مستقیم JSON
import productsData from '../../../../public/jsons/products.json';
import { compareProductAvailability, getProductAvailability } from '../../../utils/helpers/productAvailability.js';
import { getCatalogProducts } from '../../../services/catalogApi.js';
import SomeProductsSkeleton from '../../skeleton/SomeProductsSkeleton';
import useCartActions from '../../../hooks/useCartActions.js';
import { toast } from 'react-toastify'; // اضافه شده
import 'react-lazy-load-image-component/src/effects/blur.css';

// =============================================================================
// CONSTANTS
// =============================================================================
const MAX_COLUMNS = 4;
const PRODUCTS_PER_COLUMN = 4;

const FEATURED_PRODUCT_GROUPS = [
    {
        id: 'digital',
        title: 'محصولات دیجیتال',
        linkTo: '/search',
        keywords: [
            'گوشی', 'موبایل', 'تبلت', 'لپ', 'هدفون', 'ایرپاد', 'تلویزیون',
            'مانیتور', 'کنسول', 'دوربین', 'اسپیکر', 'پاوربانک', 'کیبورد',
            'ماوس', 'واقعیت مجازی', 'apple tv', 'xbox', 'ps5', 'rog',
            'macbook', 'homepod', 'gopro'
        ],
        excludeKeywords: ['ساعت', 'دستبند', 'کیف', 'جاروبرقی', 'مایکروویو', 'کولر', 'بخور', 'تصفیه هوا', 'اصلاح']
    },
    {
        id: 'accessories',
        title: 'اکسسوری',
        linkTo: '/search',
        keywords: ['ساعت', 'دستبند', 'کیف', 'پاوربانک']
    },
    {
        id: 'home',
        title: 'خانه و آشپزخانه',
        linkTo: '/search',
        keywords: ['مایکروویو', 'جاروبرقی', 'کولر', 'تصفیه هوا', 'قفل هوشمند']
    },
    {
        id: 'beauty',
        title: 'آرایشی بهداشتی',
        linkTo: '/search',
        keywords: ['اصلاح', 'بخور', 'سلامتی']
    }
];

const normalizeProductText = (value = '') => value.toString().trim().toLowerCase();

const matchesFeaturedGroup = (product, group) => {
    const text = normalizeProductText([
        product.name,
        product.categoryName,
        product.shortDescription,
        ...(product.tags || [])
    ].filter(Boolean).join(' '));

    if (group.excludeKeywords?.some(keyword => text.includes(normalizeProductText(keyword)))) {
        return false;
    }

    return group.keywords.some(keyword => text.includes(normalizeProductText(keyword)));
};

// =============================================================================
// IMAGE GRID ITEM
// =============================================================================
const ImageGridItem = ({ product, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { addProductToCart } = useCartActions();
    const { isOutOfStock, label: availabilityLabel, badgeClass: availabilityBadgeClass } = getProductAvailability(product);

    const getBadge = () => {
        if (product.discount > 0) {
            return { text: `${product.discount}%`, color: 'bg-red-500' };
        }
        if (product.isNew) {
            return { text: 'جدید', color: 'bg-emerald-500' };
        }
        if (index % 3 === 0) {
            return { text: 'پرطرفدار', color: 'bg-[#002874] dark:bg-[#4C6FB6]' };
        }
        return null;
    };

    const badge = getBadge();

    return (
        <Link
            to={`/product/${product.id}`}
            className="group relative flex justify-center items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-[#002874]/30 dark:hover:border-[#4C6FB6]/40 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {badge && (
                <span className={`absolute top-2 left-2 z-10 ${badge.color} text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm backdrop-blur-sm`}>
                    {badge.text}
                </span>
            )}

            {product.rating && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span className="text-[8px] sm:text-[9px] font-medium text-gray-700 dark:text-gray-200">
                        {product.rating}
                    </span>
                </div>
            )}
            <span className={`absolute bottom-2 right-2 z-10 rounded-full border px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold bg-white/90 dark:bg-black/60 backdrop-blur-sm ${availabilityBadgeClass}`}>
                {availabilityLabel}
            </span>

            <LazyLoadImage
                src={product.image}
                alt={product.name}
                effect="blur"
                wrapperClassName="w-full h-20 sm:h-24"
                className="w-full h-20 sm:h-24 object-contain transition-transform duration-500 group-hover:scale-110"
                placeholder={
                    <div className="w-full h-20 sm:h-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
                }
            />

            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl flex flex-col items-center justify-end p-2 transition-all duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className="flex items-center gap-1 mb-1">
                    <button
                        className="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toast.success(`${product.name} به علاقه‌مندی‌ها اضافه شد`, {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                theme: "colored",
                                rtl: true
                            });
                        }}
                    >
                        <Heart size={14} />
                    </button>
                    <button
                        disabled={isOutOfStock}
                        className={`p-1.5 rounded-full shadow-md transition-colors ${isOutOfStock ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600' : 'bg-[#002874] text-white hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a]'}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isOutOfStock) {
                                toast.info('این محصول فعلا ناموجود است');
                                return;
                            }
                            addProductToCart(product);
                        }}
                    >
                        <ShoppingBag size={14} />
                    </button>
                </div>
                {product.price && (
                    <span className="text-white text-[10px] font-bold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        {product.price} تومان
                    </span>
                )}
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#002874] dark:bg-[#4C6FB6] transform origin-left transition-transform duration-500 ${
                isHovered ? 'scale-x-100' : 'scale-x-0'
            }`} />
        </Link>
    );
};

// =============================================================================
// SINGLE COLUMN
// =============================================================================
const ProductColumn = ({ title, subtitle, products, linkTo = '/search' }) => (
    <div className="p-4 sm:p-5 h-full flex flex-col group/column relative">
        <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#002874]/30 to-transparent dark:via-[#4C6FB6]/30 opacity-0 group-hover/column:opacity-100 transition-opacity duration-500" />

        <div className="flex-1">
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base sm:text-lg font-bold text-[#002874]  dark:text-[#4C6FB6] flex items-center gap-1.5">
                        {title}
                        <Sparkles size={14} className="text-[#002874]  dark:text-[#4C6FB6] opacity-70" />
                    </h4>
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        {products.length.toLocaleString('fa-IR')} کالا
                    </span>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <TrendingUp size={12} className="opacity-60" />
                    {subtitle}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {products.map((product, idx) => (
                    <ImageGridItem key={product.id} product={product} index={idx} />
                ))}
            </div>
        </div>

        <div className="mt-4 text-left">
            <Link
                to={linkTo}
                className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-[#002874]  dark:text-[#4C6FB6] hover:gap-2 transition-all duration-200 font-medium"
            >
                مشاهده همه
                <ArrowLeft size={10} />
            </Link>
        </div>
    </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const SomeProducts = ({
                          title = "پیشنهادهای ویژه",
                          subtitle = "بر اساس بازدید های شما",
                          linkText = "مشاهده همه",
                          linkHref = "/search",
                          isLoading: propLoading = false
                      }) => {
    // مستقیم از import استفاده کن
    const [catalogProducts, setCatalogProducts] = useState([]);
    const allProducts = catalogProducts.length ? catalogProducts : productsData.products || [];
    const featuredProducts = allProducts;

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            try {
                const response = await getCatalogProducts({
                    page: 1,
                    pageSize: 200,
                    sort: 'discounted'
                });
                if (isMounted) setCatalogProducts(response.products || []);
            } catch (error) {
                console.warn('Could not load special products from API:', error);
            }
        };

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    const usedProductIds = new Set();
    const columnsData = FEATURED_PRODUCT_GROUPS.slice(0, MAX_COLUMNS)
        .map(group => {
            const categoryProducts = featuredProducts
                .filter(product => !usedProductIds.has(product.id) && matchesFeaturedGroup(product, group))
                .sort(compareProductAvailability)
                .slice(0, PRODUCTS_PER_COLUMN);

            categoryProducts.forEach(product => usedProductIds.add(product.id));

            return {
                id: group.id,
                title: group.title,
                products: categoryProducts,
                linkTo: group.linkTo
            };
        })
        .filter(column => column.products.length > 0);

    const products = columnsData;
    const isLoading = propLoading;

    const hasAnyProduct = products.some(col => col.products.length > 0);
    if (!hasAnyProduct && !isLoading) return null;

    return (
        <section className="py-3 sm:py-5" aria-labelledby="some-products-title">
            <h2 id="some-products-title" className="sr-only">{title}</h2>

            <div className="">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800 transition-colors duration-300">

                    <div
                        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
                    
                    />

                    <div className="relative flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 xl:p-5">
                        <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
                            <div className="relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-[#002874] to-[#4C6FB6] dark:from-[#4C6FB6] dark:to-[#002874] rounded-lg sm:rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg shadow-[#002874]/30 dark:shadow-[#4C6FB6]/30">
                                <Zap size={16} className="sm:size-5 xl:size-6 text-white" />
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
                            <Link
                                to={linkHref}
                                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 xl:px-4 py-1.5 sm:py-2 xl:py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs xl:text-sm font-medium rounded-lg sm:rounded-xl hover:border-[#002874] dark:hover:border-[#4C6FB6] hover:text-[#002874]  dark:hover:text-[#4C6FB6] hover:shadow-sm transition-all duration-200 group"
                            >
                                <span className="hidden xs:inline">{linkText}</span>
                                <ArrowLeft size={14} className="sm:size-4 transition-transform group-hover:-translate-x-0.5" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
                        {isLoading
                            ? Array.from({ length: MAX_COLUMNS }).map((_, idx) => (
                                <SomeProductsSkeleton key={idx} />
                            ))
                            : products.map((column) => (
                                <ProductColumn
                                    key={column.id}
                                    title={column.title}
                                    subtitle={subtitle}
                                    products={column.products}
                                    linkTo={column.linkTo}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SomeProducts;
