import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Fuse from 'fuse.js';
import { Grid } from 'react-feather';
import { toast } from 'react-toastify';
import { getCatalogCategories, getCatalogProducts } from '../../services/catalogApi.js';
import { addCartItem } from '../../services/cartApi.js';
import useStore from '../../store/index.js';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import CategoryPageSkeleton from '../skeleton/CategoryPageSkeleton/CategoryPageSkeleton.jsx';
import CategoryNotFound from './categoryNotFound';
import CategoryHero from './categoryHero';
import CategorySubCategories from './categorySubCategories';
import CategoryTopBrands from './categoryTopBrands';
import CategoryFilterBar from './categoryFilterBar';
import CategoryProductGrid from './categoryProductGrid';
import CategoryEmpty from './categoryEmpty';

const ITEMS_PER_LOAD = 10;
const parsePrice = (value) => Number(String(value || '').replace(/[^\d]/g, '')) || 0;
const sortAvailableFirst = (items) => {
    items.sort((a, b) => Number((b.stock || 0) > 0) - Number((a.stock || 0) > 0));
    return items;
};

const CategoryPage = () => {
    const { id } = useParams();
    const categoryId = Number(id);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_LOAD);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const setCart = useStore((state) => state.setCart);

    useEffect(() => {
        let isMounted = true;

        const loadCategory = async () => {
            setIsLoading(true);

            try {
                const [categoriesResponse, productsResponse] = await Promise.all([
                    getCatalogCategories(),
                    getCatalogProducts({ page: 1, pageSize: 200, categoryId }),
                ]);

                if (!isMounted) return;

                const foundCategory = (categoriesResponse.categories || []).find(item => item.id === categoryId);
                setCategory(foundCategory ? { ...foundCategory, subcategories: foundCategory.subcategories || [] } : null);
                setCategoryProducts(productsResponse.products || []);
            } catch {
                if (isMounted) {
                    setCategory(null);
                    setCategoryProducts([]);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadCategory();
        window.scrollTo(0, 0);

        return () => {
            isMounted = false;
        };
    }, [categoryId]);

    const fuse = useMemo(() => {
        return new Fuse(categoryProducts, {
            keys: ['name', 'shortDescription', 'tags'],
            threshold: 0.3,
        });
    }, [categoryProducts]);

    const filteredProducts = useMemo(() => {
        if (searchQuery.trim()) {
            return fuse.search(searchQuery).map(result => result.item);
        }
        return categoryProducts;
    }, [categoryProducts, searchQuery, fuse]);

    const sortedProducts = useMemo(() => {
        const result = [...filteredProducts];

        switch (sortBy) {
            case 'cheapest':
                result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
                break;
            case 'expensive':
                result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
                break;
            case 'popular':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'discount':
                result.sort((a, b) => b.discount - a.discount);
                break;
            default:
                result.sort((a, b) => b.id - a.id);
        }

        return sortAvailableFirst(result);
    }, [filteredProducts, sortBy]);

    const visibleProducts = useMemo(
        () => sortedProducts.slice(0, displayCount),
        [sortedProducts, displayCount]
    );

    const hasMore = displayCount < sortedProducts.length;

    const fetchMoreData = () => {
        setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + ITEMS_PER_LOAD, sortedProducts.length));
        }, 300);
    };

    useEffect(() => {
        setDisplayCount(ITEMS_PER_LOAD);
    }, [sortBy, searchQuery, id]);

    const handleSearch = () => {
        setSearchQuery(searchInput.trim());
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
        toast.success('جستجو پاک شد');
    };

    const handleAddToCart = async (product) => {
        try {
            const cart = await addCartItem({ productId: product.id, quantity: 1 });
            setCart(cart);
            toast.success(`${product.name} به سبد خرید اضافه شد`);
        } catch (error) {
            toast.error(error.message || 'خطا در افزودن محصول به سبد خرید');
        }
    };

    const handleToggleWishlist = () => {
        toast.success('به علاقه‌مندی‌ها اضافه شد');
    };

    if (isLoading) return <CategoryPageSkeleton />;
    if (!category) return <CategoryNotFound />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <Breadcrumb items={[
                    { title: 'دسته‌بندی‌ها', link: '/categories', icon: Grid },
                    { title: category.name, link: `/category/${category.id}` },
                ]} />

                <CategoryHero
                    category={category}
                    productsCount={categoryProducts.length}
                    searchInput={searchInput}
                    onSearchChange={setSearchInput}
                    onSearch={handleSearch}
                    onClearSearch={handleClearSearch}
                />

                {searchQuery && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 -mt-2">
                        {sortedProducts.length.toLocaleString('fa-IR')} نتیجه برای "{searchQuery}"
                    </p>
                )}

                <CategorySubCategories subcategories={category.subcategories} />
                <CategoryTopBrands categoryProducts={categoryProducts} />

                <CategoryFilterBar
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    totalResults={sortedProducts.length}
                    showingResults={visibleProducts.length}
                />

                {sortedProducts.length === 0 ? (
                    <CategoryEmpty searchQuery={searchQuery} onClear={handleClearSearch} />
                ) : (
                    <InfiniteScroll
                        dataLength={visibleProducts.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        scrollThreshold={0.7}
                        style={{ overflow: 'visible' }}
                        loader={
                            <div className="flex justify-center py-6">
                                <div className="w-8 h-8 border-4 border-[#002874] border-t-transparent rounded-full animate-spin" />
                            </div>
                        }
                        endMessage={
                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-6">
                                همه محصولات نمایش داده شد.
                            </p>
                        }
                    >
                        <CategoryProductGrid
                            products={visibleProducts}
                            viewMode={viewMode}
                            onAddToCart={handleAddToCart}
                            onToggleWishlist={handleToggleWishlist}
                        />
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
