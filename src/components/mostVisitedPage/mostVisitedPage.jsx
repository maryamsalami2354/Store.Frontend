import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Fuse from 'fuse.js';
import { TrendingUp } from 'react-feather';
import productsData from '../../../public/jsons/products.json';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import { toast } from 'react-toastify';
import MostVisitedPageSkeleton from '../skeleton/MostVisitedPageSkeleton/MostVisitedPageSkeleton.jsx';
import MostVisitedHero from './mostVisitedHero';
import MostVisitedFilterBar from './mostVisitedFilterBar';
import MostVisitedGrid from './mostVisitedGrid';
import MostVisitedEmpty from './mostVisitedEmpty';
import useCartActions from '../../hooks/useCartActions.js';
import { compareProductAvailability } from '../../utils/helpers/productAvailability.js';
import { getCatalogProducts } from '../../services/catalogApi.js';

const ITEMS_PER_LOAD = 10;

const MostVisitedPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('visits');
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_LOAD);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [catalogProducts, setCatalogProducts] = useState([]);
    const { addProductToCart } = useCartActions();

    const allProducts = useMemo(() => (catalogProducts.length ? catalogProducts : productsData.products || []).map(p => ({
        ...p,
        visits: p.visits || Math.floor(Math.random() * 5000) + 100
    })), [catalogProducts]);

    const fuse = useMemo(() => new Fuse(allProducts, { keys: ['name', 'shortDescription', 'tags'], threshold: 0.3 }), [allProducts]);

    const filteredProducts = useMemo(() => {
        if (searchQuery.trim()) return fuse.search(searchQuery).map(r => r.item);
        return allProducts;
    }, [allProducts, searchQuery, fuse]);

    const sortedProducts = useMemo(() => {
        let res = [...filteredProducts];
        switch (sortBy) {
            case 'cheapest': res.sort((a, b) => compareProductAvailability(a, b) || parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, ''))); break;
            case 'expensive': res.sort((a, b) => compareProductAvailability(a, b) || parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, ''))); break;
            case 'popular': res.sort((a, b) => compareProductAvailability(a, b) || b.rating - a.rating); break;
            default: res.sort((a, b) => compareProductAvailability(a, b) || b.visits - a.visits);
        }
        return res;
    }, [filteredProducts, sortBy]);

    const visibleProducts = useMemo(() => sortedProducts.slice(0, displayCount), [sortedProducts, displayCount]);
    const hasMore = displayCount < sortedProducts.length;
    const fetchMoreData = () => setTimeout(() => setDisplayCount(prev => Math.min(prev + ITEMS_PER_LOAD, sortedProducts.length)), 500);

    useEffect(() => { setDisplayCount(ITEMS_PER_LOAD); }, [sortBy, searchQuery]);
    useEffect(() => {
        let isMounted = true;

        const loadCatalog = async () => {
            try {
                const response = await getCatalogProducts({
                    page: 1,
                    pageSize: 200,
                    sort: 'popular'
                });
                if (isMounted) setCatalogProducts(response.products || []);
            } catch (error) {
                console.warn('Could not load most visited products from API:', error);
            }
        };

        loadCatalog();

        return () => {
            isMounted = false;
        };
    }, []);
    useEffect(() => { const t = setTimeout(() => setIsLoading(false), 600); window.scrollTo(0, 0); return () => clearTimeout(t); }, []);

    const handleSearch = () => setSearchQuery(searchInput.trim());
    const handleClearSearch = () => { setSearchInput(''); setSearchQuery(''); };
    const handleAddToCart = (product) => addProductToCart(product);
    const handleToggleWishlist = () => toast.success('به علاقه‌مندی‌ها اضافه شد');

    if (isLoading) return <MostVisitedPageSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <Breadcrumb items={[{ title: 'پربازدیدترین', link: '/most-visited', icon: TrendingUp }]} />

                <MostVisitedHero
                    productsCount={allProducts.length}
                    searchInput={searchInput}
                    onSearchChange={setSearchInput}
                    onSearch={handleSearch}
                    onClearSearch={handleClearSearch}
                />

                {searchQuery && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 -mt-2">{sortedProducts.length.toLocaleString('fa-IR')} نتیجه</p>}

                <MostVisitedFilterBar sortBy={sortBy} onSortChange={setSortBy} viewMode={viewMode} onViewModeChange={setViewMode} totalResults={sortedProducts.length} />

                {sortedProducts.length === 0 ? (
                    <MostVisitedEmpty searchQuery={searchQuery} onClear={handleClearSearch} />
                ) : (
                    <InfiniteScroll dataLength={visibleProducts.length} next={fetchMoreData} hasMore={hasMore} scrollThreshold="300px" style={{ overflow: 'visible' }}
                                    loader={<div className="flex justify-center py-6"><div className="w-8 h-8 border-4 border-[#002874] border-t-transparent rounded-full animate-spin" /></div>}
                                    endMessage={<p className="text-center text-gray-500 dark:text-gray-400 text-sm py-6">همه محصولات نمایش داده شد.</p>}>
                        <MostVisitedGrid products={visibleProducts} viewMode={viewMode} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} navigate={navigate} />
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
};

export default MostVisitedPage;
