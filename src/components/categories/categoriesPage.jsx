import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid } from 'react-feather';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import { getCatalogCategories, getCatalogProducts } from '../../services/catalogApi.js';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import CategoriesPageSkeleton from '../skeleton/CategoriesPageSkeleton/CategoriesPageSkeleton.jsx';
import CategoriesHero from './categoriesHero';
import CategoriesStats from './categoriesStats';
import CategoriesFilterBar from './categoriesFilterBar';
import CategoriesGrid from './categoriesGrid';
import CategoriesFeatured from './categoriesFeatured';
import CategoriesEmpty from './categoriesEmpty';
import ErrorOnFetchApi from '../common/ErrorOnFetchApi';

const ITEMS_PER_LOAD = 10;

const CategoriesPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_LOAD);
    const [allCategories, setAllCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const loadCategories = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [categoriesResponse, productsResponse] = await Promise.all([
                    getCatalogCategories(),
                    getCatalogProducts({ page: 1, pageSize: 200 }),
                ]);

                if (!isMounted) return;

                setAllCategories(categoriesResponse.categories || []);
                setAllProducts(productsResponse.products || []);
            } catch (err) {
                if (isMounted) setError(err.message || 'خطا در دریافت دسته‌بندی‌ها');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadCategories();
        window.scrollTo(0, 0);

        return () => {
            isMounted = false;
        };
    }, []);

    const enrichedCategories = useMemo(() => {
        return allCategories.map(category => {
            const categoryProducts = allProducts.filter(product => product.categoryId === category.id);
            const brandsCount = new Set(categoryProducts.map(product => product.brandId).filter(Boolean)).size;
            const avgRating = categoryProducts.length
                ? categoryProducts.reduce((sum, product) => sum + (product.rating || 0), 0) / categoryProducts.length
                : 0;

            return {
                ...category,
                subcategories: category.subcategories || [],
                productsCount: category.productsCount ?? categoryProducts.length,
                subcategoriesCount: category.subcategories?.length || 0,
                brandsCount,
                avgRating: Math.round(avgRating * 10) / 10,
                hasProducts: categoryProducts.length > 0,
                isFeatured: category.featured || categoryProducts.length >= 3,
            };
        });
    }, [allCategories, allProducts]);

    const filteredCategories = useMemo(() => {
        let result = [...enrichedCategories];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(category =>
                category.name?.toLowerCase().includes(query) ||
                category.title?.toLowerCase().includes(query) ||
                category.subcategories?.some(sub => sub.name?.toLowerCase().includes(query))
            );
        }

        const sorters = {
            alphabet: (a, b) => a.name.localeCompare(b.name, 'fa'),
            products: (a, b) => b.productsCount - a.productsCount,
            brands: (a, b) => b.brandsCount - a.brandsCount,
            rating: (a, b) => b.avgRating - a.avgRating,
            popular: (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.productsCount - a.productsCount,
        };

        result.sort(sorters[sortBy] || sorters.popular);
        return result;
    }, [enrichedCategories, searchQuery, sortBy]);

    const featuredCategories = useMemo(
        () => enrichedCategories.filter(category => category.isFeatured).slice(0, 12),
        [enrichedCategories]
    );

    const stats = useMemo(() => ({
        totalCategories: allCategories.length,
        totalProducts: allProducts.length,
        totalBrands: new Set(allProducts.map(product => product.brandId).filter(Boolean)).size,
        activeCategories: enrichedCategories.filter(category => category.hasProducts).length,
    }), [allCategories, allProducts, enrichedCategories]);

    useEffect(() => {
        setDisplayCount(ITEMS_PER_LOAD);
    }, [searchQuery, sortBy]);

    const visibleCategories = useMemo(
        () => filteredCategories.slice(0, displayCount),
        [filteredCategories, displayCount]
    );

    const hasMore = displayCount < filteredCategories.length;

    const fetchMoreData = () => {
        setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + ITEMS_PER_LOAD, filteredCategories.length));
        }, 100);
    };

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
    }, []);

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setSortBy('popular');
        toast.success('فیلترها پاک شدند');
    }, []);

    const hasActiveFilters = searchQuery || sortBy !== 'popular';

    if (isLoading) return <CategoriesPageSkeleton />;
    if (error) return <ErrorOnFetchApi message={error} onRetry={() => window.location.reload()} />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <Breadcrumb items={[{ title: 'دسته‌بندی‌ها', link: '/categories', icon: Grid }]} />

                <CategoriesHero
                    totalCategories={stats.totalCategories}
                    searchQuery={searchQuery}
                    onSearch={handleSearch}
                    onClear={() => handleSearch('')}
                />

                <CategoriesStats stats={stats} />

                <CategoriesFilterBar
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    totalResults={filteredCategories.length}
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                />

                {!searchQuery && featuredCategories.length > 0 && (
                    <CategoriesFeatured categories={featuredCategories} />
                )}

                {filteredCategories.length > 0 ? (
                    <InfiniteScroll
                        dataLength={visibleCategories.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={
                            <div className="flex justify-center py-6">
                                <div className="w-8 h-8 border-4 border-[#002874] border-t-transparent rounded-full animate-spin" />
                            </div>
                        }
                        endMessage={
                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-6">
                                همه دسته‌بندی‌ها نمایش داده شد.
                            </p>
                        }
                        scrollThreshold="300px"
                    >
                        <CategoriesGrid categories={visibleCategories} viewMode={viewMode} />
                    </InfiniteScroll>
                ) : (
                    <CategoriesEmpty onClear={handleClearFilters} />
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;
