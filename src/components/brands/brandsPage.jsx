// =============================================================================
// FILE: brands.jsx
// =============================================================================
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Award } from 'react-feather';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import brandsPageSkeleton from '../skeleton/BrandsPageSkeleton/brandsPageSkeleton.jsx';
import brandsHero from './brandsHero';
import brandsStats from './brandsStats';
import brandsCategoryTabs from './brandsCategoryTabs';
import brandsFilterBar from './brandsFilterBar';
import brandsGrid from './brandsGrid';
import brandsFeatured from './brandsFeatured';
import brandsEmpty from './brandsEmpty';
import { toast } from 'react-toastify';
import { getCatalogBrands, getCatalogCategories, getCatalogProducts } from '../../services/catalogApi.js';

const ITEMS_PER_LOAD = 10;

const BrandsPage = () => {
    // =========================================================================
    // STATE
    // =========================================================================
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_LOAD);
    const [allBrands, setAllBrands] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]); // تعداد نمایشی

    // =========================================================================
    // COMPUTED: برندها با اطلاعات کامل
    // =========================================================================
    const enrichedBrands = useMemo(() => {
        return allBrands.map(brand => {
            const brandProducts = allProducts.filter(p => p.brandId === brand.id);
            const categoriesSet = new Set(brandProducts.map(p => p.categoryId));
            const avgRating = brandProducts.length
                ? brandProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / brandProducts.length
                : 0;

            return {
                ...brand,
                productsCount: brandProducts.length,
                categoriesCount: categoriesSet.size,
                avgRating: Math.round(avgRating * 10) / 10,
                hasProducts: brandProducts.length > 0,
                isFeatured: brand.featured || brandProducts.length >= 8
            };
        });
    }, [allBrands, allProducts]);

    // =========================================================================
    // FILTERED + SORTED
    // =========================================================================
    const filteredBrands = useMemo(() => {
        let result = [...enrichedBrands];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(b =>
                b.name.toLowerCase().includes(q) ||
                (b.description && b.description.toLowerCase().includes(q))
            );
        }

        if (activeCategory) {
            const brandIdsInCat = allProducts
                .filter(p => p.categoryId === parseInt(activeCategory))
                .map(p => p.brandId);
            const uniqueIds = [...new Set(brandIdsInCat)];
            result = result.filter(b => uniqueIds.includes(b.id));
        }

        const sorters = {
            alphabet: (a, b) => a.name.localeCompare(b.name, 'fa'),
            products: (a, b) => b.productsCount - a.productsCount,
            rating: (a, b) => b.avgRating - a.avgRating,
            categories: (a, b) => b.categoriesCount - a.categoriesCount,
            popular: (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.productsCount - a.productsCount
        };

        result.sort(sorters[sortBy] || sorters.popular);

        return result;
    }, [enrichedBrands, searchQuery, activeCategory, sortBy, allProducts]);

    // =========================================================================
    // برندهای ویژه
    // =========================================================================
    const featuredBrands = useMemo(() =>
            enrichedBrands.filter(b => b.isFeatured).slice(0, 12),
        [enrichedBrands]
    );

    // =========================================================================
    // آمار
    // =========================================================================
    const stats = useMemo(() => ({
        totalBrands: allBrands.length,
        totalProducts: allProducts.length,
        totalCategories: allCategories.length,
        activeBrands: enrichedBrands.filter(b => b.hasProducts).length
    }), [allBrands, allProducts, allCategories, enrichedBrands]);

    // =========================================================================
    // EFFECTS
    // =========================================================================
    useEffect(() => {
        let isMounted = true;
        window.scrollTo(0, 0);

        const loadCatalog = async () => {
            setIsLoading(true);
            try {
                const [brandsResponse, productsResponse, categoriesResponse] = await Promise.all([
                    getCatalogBrands(),
                    getCatalogProducts({ page: 1, pageSize: 300 }),
                    getCatalogCategories(),
                ]);

                if (!isMounted) return;
                setAllBrands(brandsResponse.brands || []);
                setAllProducts(productsResponse.products || []);
                setAllCategories(categoriesResponse.categories || []);
            } catch (error) {
                toast.error(error.message || 'خطا در دریافت برندها');
                if (!isMounted) return;
                setAllBrands([]);
                setAllProducts([]);
                setAllCategories([]);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadCatalog();

        return () => {
            isMounted = false;
        };
    }, []);

    // با تغییر فیلترها یا مرتب‌سازی، تعداد نمایش را ریست کن
    useEffect(() => {
        setDisplayCount(ITEMS_PER_LOAD);
    }, [searchQuery, activeCategory, sortBy]);

    // =========================================================================
    // HANDLERS
    // =========================================================================
    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    const handleCategoryChange = useCallback((catId) => {
        setActiveCategory(prev => prev === catId ? '' : catId);
    }, []);

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setActiveCategory('');
        setSortBy('popular');
        toast.success('فیلترها پاک شدند');
    }, []);

    const hasActiveFilters = searchQuery || activeCategory || sortBy !== 'popular';

    // =========================================================================
    // Infinite Scroll helpers
    // =========================================================================
    const visibleBrands = useMemo(() => {
        return filteredBrands.slice(0, displayCount);
    }, [filteredBrands, displayCount]);

    const hasMore = displayCount < filteredBrands.length;

    const fetchMoreData = () => {
        setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + ITEMS_PER_LOAD, filteredBrands.length));
        }, 500);
    };

    // =========================================================================
    // RENDER
    // =========================================================================
    if (isLoading) return React.createElement(brandsPageSkeleton);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">

                {/* Breadcrumb */}
                <Breadcrumb items={[{ title: "برندها", link: "/brands", icon: Award }]} />

                {/* Hero with Search */}
                {React.createElement(brandsHero, {
                    totalBrands: stats.totalBrands,
                    searchQuery,
                    onSearch: handleSearch,
                    onClear: () => handleSearch('')
                })}

                {/* Stats */}
                {React.createElement(brandsStats, { stats })}

                {/* Category Tabs */}
                {React.createElement(brandsCategoryTabs, {
                    categories: allCategories,
                    activeCategory,
                    onSelect: handleCategoryChange
                })}

                {/* Filter Bar */}
                {React.createElement(brandsFilterBar, {
                    sortBy,
                    onSortChange: setSortBy,
                    viewMode,
                    onViewModeChange: setViewMode,
                    totalResults: filteredBrands.length,
                    hasActiveFilters,
                    onClearFilters: handleClearFilters
                })}

                {/* Featured Brands Slider */}
                {!searchQuery && !activeCategory && featuredBrands.length > 0 && (
                    React.createElement(brandsFeatured, { brands: featuredBrands })
                )}

                {/* Brands Grid with Infinite Scroll */}
                {filteredBrands.length > 0 ? (
                    <InfiniteScroll
                        dataLength={visibleBrands.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        scrollThreshold="300px"
                        style={{ overflow: 'visible' }}
                        loader={
                            <div className="flex justify-center py-6">
                                <div className="w-8 h-8 border-4 border-[#002874] border-t-transparent rounded-full animate-spin" />
                            </div>
                        }
                        endMessage={
                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-6">
                                همه برندها نمایش داده شد.
                            </p>
                        }
                    >
                        {React.createElement(brandsGrid, { brands: visibleBrands, viewMode })}
                    </InfiniteScroll>
                ) : (
                    React.createElement(brandsEmpty, { onClear: handleClearFilters })
                )}

            </div>
        </div>
    );
};

export default BrandsPage;
