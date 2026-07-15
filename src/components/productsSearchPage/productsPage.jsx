import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Filter, Grid, Home, List, Search, Sliders, X } from 'react-feather';
import { toast } from 'react-toastify';
import { getCatalogBrands, getCatalogCategories, getCatalogProducts } from '../../services/catalogApi.js';
import { addCartItem } from '../../services/cartApi.js';
import useStore from '../../store/index.js';
import ProductsFilterSidebar from './productsFilterSidebar';
import ProductsSortBar from './productsSortBar';
import ProductsGrid from './productsGrid';
import ProductsPagination from './productsPagination';
import ProductsPageSkeleton from '../skeleton/ProductsPageSkeleton/ProductsPageSkeleton.jsx';
import ErrorOnFetchApi from '../common/ErrorOnFetchApi';
import 'react-loading-skeleton/dist/skeleton.css';

const PRODUCTS_PER_PAGE = 12;

const parsePrice = (value) => Number(String(value || '').replace(/[^\d]/g, '')) || 0;

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const setCart = useStore((state) => state.setCart);

    const searchQuery = searchParams.get('q') || '';
    const currentPage = Number(searchParams.get('page') || '1');
    const sortBy = searchParams.get('sort') || 'newest';
    const categoriesParam = searchParams.get('categories') || '';
    const brandsParam = searchParams.get('brands') || '';
    const appliedCategories = useMemo(() => categoriesParam.split(',').filter(Boolean), [categoriesParam]);
    const appliedBrands = useMemo(() => brandsParam.split(',').filter(Boolean), [brandsParam]);
    const appliedMinPrice = searchParams.get('minPrice') || '';
    const appliedMaxPrice = searchParams.get('maxPrice') || '';
    const appliedOnlyAvailable = searchParams.get('available') === 'true';
    const appliedOnlyDiscounted = searchParams.get('discounted') === 'true';
    const appliedOnlyAmazing = searchParams.get('amazing') === 'true';
    const appliedMinRating = searchParams.get('rating') || '';

    const [tempFilters, setTempFilters] = useState({
        categories: appliedCategories,
        brands: appliedBrands,
        minPrice: appliedMinPrice,
        maxPrice: appliedMaxPrice,
        onlyAvailable: appliedOnlyAvailable,
        onlyDiscounted: appliedOnlyDiscounted,
        onlyAmazing: appliedOnlyAmazing,
        minRating: appliedMinRating,
    });

    useEffect(() => {
        setTempFilters({
            categories: appliedCategories,
            brands: appliedBrands,
            minPrice: appliedMinPrice,
            maxPrice: appliedMaxPrice,
            onlyAvailable: appliedOnlyAvailable,
            onlyDiscounted: appliedOnlyDiscounted,
            onlyAmazing: appliedOnlyAmazing,
            minRating: appliedMinRating,
        });
    }, [appliedCategories, appliedBrands, appliedMinPrice, appliedMaxPrice, appliedOnlyAvailable, appliedOnlyDiscounted, appliedOnlyAmazing, appliedMinRating]);

    useEffect(() => {
        let isMounted = true;

        const loadCatalog = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
                    getCatalogProducts({ page: 1, pageSize: 200 }),
                    getCatalogCategories(),
                    getCatalogBrands(),
                ]);

                if (!isMounted) return;

                setProducts(productsResponse.products || []);
                setCategories(categoriesResponse.categories || []);
                setBrands(brandsResponse.brands || []);
            } catch (err) {
                if (isMounted) setError(err.message || 'خطا در دریافت محصولات');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadCatalog();
        window.scrollTo(0, 0);

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(product =>
                product.name?.toLowerCase().includes(query) ||
                product.shortDescription?.toLowerCase().includes(query) ||
                product.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        if (appliedCategories.length) {
            result = result.filter(product => appliedCategories.includes(String(product.categoryId)));
        }

        if (appliedBrands.length) {
            result = result.filter(product => appliedBrands.includes(String(product.brandId)));
        }

        if (appliedMinPrice) {
            result = result.filter(product => parsePrice(product.price) >= Number(appliedMinPrice));
        }

        if (appliedMaxPrice) {
            result = result.filter(product => parsePrice(product.price) <= Number(appliedMaxPrice));
        }

        if (appliedOnlyAvailable) {
            result = result.filter(product => product.stock > 0);
        }

        if (appliedOnlyDiscounted) {
            result = result.filter(product => product.discount > 0);
        }

        if (appliedOnlyAmazing) {
            result = result.filter(product => product.isAmazing);
        }

        if (appliedMinRating) {
            result = result.filter(product => product.rating >= Number(appliedMinRating));
        }

        switch (sortBy) {
            case 'oldest':
                result.sort((a, b) => a.id - b.id);
                break;
            case 'cheapest':
                result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
                break;
            case 'expensive':
                result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
                break;
            case 'popular':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'discounted':
                result.sort((a, b) => b.discount - a.discount);
                break;
            default:
                result.sort((a, b) => b.id - a.id);
                break;
        }

        return result;
    }, [products, searchQuery, appliedCategories, appliedBrands, appliedMinPrice, appliedMaxPrice, appliedOnlyAvailable, appliedOnlyDiscounted, appliedOnlyAmazing, appliedMinRating, sortBy]);

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (appliedCategories.length) count += appliedCategories.length;
        if (appliedBrands.length) count += appliedBrands.length;
        if (appliedMinPrice) count++;
        if (appliedMaxPrice) count++;
        if (appliedOnlyAvailable) count++;
        if (appliedOnlyDiscounted) count++;
        if (appliedOnlyAmazing) count++;
        if (appliedMinRating) count++;
        return count;
    }, [appliedCategories, appliedBrands, appliedMinPrice, appliedMaxPrice, appliedOnlyAvailable, appliedOnlyDiscounted, appliedOnlyAmazing, appliedMinRating]);

    const filterStats = useMemo(() => {
        const activeFilters = [];
        if (searchQuery) activeFilters.push(`جستجو: "${searchQuery}"`);
        if (appliedCategories.length) {
            const names = appliedCategories.map(id => categories.find(category => category.id === Number(id))?.name || id);
            activeFilters.push(`دسته: ${names.join('، ')}`);
        }
        if (appliedBrands.length) {
            const names = appliedBrands.map(id => brands.find(brand => brand.id === Number(id))?.name || id);
            activeFilters.push(`برند: ${names.join('، ')}`);
        }
        if (appliedMinPrice) activeFilters.push(`حداقل قیمت: ${Number(appliedMinPrice).toLocaleString('fa-IR')} تومان`);
        if (appliedMaxPrice) activeFilters.push(`حداکثر قیمت: ${Number(appliedMaxPrice).toLocaleString('fa-IR')} تومان`);
        if (appliedOnlyAvailable) activeFilters.push('فقط موجود');
        if (appliedOnlyDiscounted) activeFilters.push('فقط تخفیف‌دار');
        if (appliedOnlyAmazing) activeFilters.push('فقط شگفت‌انگیز');
        if (appliedMinRating) activeFilters.push(`امتیاز ≥ ${appliedMinRating}`);
        return activeFilters;
    }, [searchQuery, appliedCategories, appliedBrands, appliedMinPrice, appliedMaxPrice, appliedOnlyAvailable, appliedOnlyDiscounted, appliedOnlyAmazing, appliedMinRating, categories, brands]);

    const updateTempFilters = useCallback((updates) => {
        setTempFilters(prev => ({ ...prev, ...updates }));
    }, []);

    const updateParams = useCallback((updates) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                if (value === '' || value === null || value === undefined) {
                    newParams.delete(key);
                } else {
                    newParams.set(key, String(value));
                }
            });
            return newParams;
        });
    }, [setSearchParams]);

    const applyFilters = useCallback(() => {
        const params = {};

        if (searchQuery) params.q = searchQuery;
        if (tempFilters.categories.length) params.categories = tempFilters.categories.join(',');
        if (tempFilters.brands.length) params.brands = tempFilters.brands.join(',');
        if (tempFilters.minPrice) params.minPrice = tempFilters.minPrice;
        if (tempFilters.maxPrice) params.maxPrice = tempFilters.maxPrice;
        if (tempFilters.onlyAvailable) params.available = 'true';
        if (tempFilters.onlyDiscounted) params.discounted = 'true';
        if (tempFilters.onlyAmazing) params.amazing = 'true';
        if (tempFilters.minRating) params.rating = tempFilters.minRating;
        if (sortBy !== 'newest') params.sort = sortBy;
        params.page = '1';

        setSearchParams(params);
        if (mobileFilterOpen) setMobileFilterOpen(false);
        toast.success('فیلترها اعمال شدند');
    }, [searchQuery, tempFilters, sortBy, setSearchParams, mobileFilterOpen]);

    const clearAllFilters = useCallback(() => {
        setTempFilters({
            categories: [],
            brands: [],
            minPrice: '',
            maxPrice: '',
            onlyAvailable: false,
            onlyDiscounted: false,
            onlyAmazing: false,
            minRating: '',
        });
        setSearchParams({});
    }, [setSearchParams]);

    const handleAddToCart = useCallback(async (product) => {
        try {
            const cart = await addCartItem({ productId: product.id, quantity: 1 });
            setCart(cart);
            toast.success(`${product.name} به سبد خرید اضافه شد`);
        } catch (error) {
            toast.error(error.message || 'خطا در افزودن محصول به سبد خرید');
        }
    }, [setCart]);

    const handleToggleWishlist = useCallback(() => {
        toast.success('به علاقه‌مندی‌ها اضافه شد');
    }, []);

    if (error) {
        return <ErrorOnFetchApi message={error} onRetry={() => window.location.reload()} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <nav className="py-2 sm:py-3">
                    <ol className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <li>
                            <Link to="/" className="flex items-center hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors">
                                <Home size={14} className="ml-1" />
                                خانه
                            </Link>
                        </li>
                        <li className="mx-1.5 sm:mx-2"><ChevronLeft size={12} /></li>
                        <li>
                            <span className="text-gray-900 dark:text-white font-medium">
                                {searchQuery ? `جستجو: "${searchQuery}"` : 'محصولات'}
                            </span>
                        </li>
                    </ol>
                </nav>

                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 lg:p-5 mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-900 dark:text-white">
                                {searchQuery ? `نتایج جستجو برای "${searchQuery}"` : 'همه محصولات'}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {filteredProducts.length.toLocaleString('fa-IR')} محصول یافت شد
                                {filterStats.length > 0 && (
                                    <span className="text-[#002874] dark:text-[#4C6FB6]">
                                        {' '} - {filterStats.join(' | ')}
                                    </span>
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setMobileFilterOpen(true)}
                                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-1 sm:flex-none justify-center relative"
                            >
                                <Sliders size={16} />
                                فیلترها
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            <div className="hidden sm:flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#111] text-[#002874] dark:text-[#4C6FB6] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Grid size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#111] text-[#002874] dark:text-[#4C6FB6] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {filterStats.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                            {filterStats.map((filter, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#002874]/5 dark:bg-[#4C6FB6]/10 text-[#002874] dark:text-[#4C6FB6] text-xs rounded-lg">
                                    {filter}
                                </span>
                            ))}
                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
                            >
                                <X size={14} />
                                حذف همه فیلترها
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 lg:gap-6">
                    <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
                        <div className="sticky top-24">
                            <ProductsFilterSidebar
                                categories={categories}
                                brands={brands}
                                tempFilters={tempFilters}
                                onTempFilterChange={updateTempFilters}
                                onApply={applyFilters}
                                onClearAll={clearAllFilters}
                                activeFilterCount={activeFilterCount}
                                totalResults={filteredProducts.length}
                                isDesktop
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <ProductsSortBar
                            sortBy={sortBy}
                            onSortChange={(sort) => updateParams({ sort, page: 1 })}
                            totalProducts={filteredProducts.length}
                            showingProducts={paginatedProducts.length}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => updateParams({ page })}
                        />

                        {isLoading ? (
                            <ProductsPageSkeleton viewMode={viewMode} />
                        ) : paginatedProducts.length > 0 ? (
                            <>
                                <ProductsGrid
                                    products={paginatedProducts}
                                    viewMode={viewMode}
                                    onAddToCart={handleAddToCart}
                                    onToggleWishlist={handleToggleWishlist}
                                />

                                {totalPages > 1 && (
                                    <div className="mt-6">
                                        <ProductsPagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={(page) => updateParams({ page })}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                    <Search size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">محصولی یافت نشد</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">با فیلترهای دیگری جستجو کنید</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-6 py-2.5 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] transition-colors"
                                >
                                    حذف همه فیلترها
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {mobileFilterOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
                    <div className="absolute top-0 start-0 h-full w-80 max-w-[85vw] bg-white dark:bg-[#111] shadow-2xl overflow-y-auto animate-slide-in">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#111] z-10">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Filter size={20} />
                                فیلترها
                            </h2>
                            <button onClick={() => setMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4">
                            <ProductsFilterSidebar
                                categories={categories}
                                brands={brands}
                                tempFilters={tempFilters}
                                onTempFilterChange={updateTempFilters}
                                onApply={applyFilters}
                                onClearAll={clearAllFilters}
                                activeFilterCount={activeFilterCount}
                                totalResults={filteredProducts.length}
                                isMobile
                                onClose={() => setMobileFilterOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
