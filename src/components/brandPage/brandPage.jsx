// =============================================================================
// FILE: brandPage.jsx
// =============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Fuse from 'fuse.js';
import { Award } from 'react-feather';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import { toast } from 'react-toastify';
import BrandPageSkeleton from '../skeleton/BrandPageSkeleton/BrandPageSkeleton.jsx';
import BrandNotFound from './brandNotFound';
import BrandHero from './brandHero';
import BrandFilterBar from './brandFilterBar';
import BrandProductGrid from './brandProductGrid';
import BrandEmpty from './brandEmpty';
import { compareProductAvailability } from '../../utils/helpers/productAvailability.js';
import { getCatalogBrands, getCatalogProducts } from '../../services/catalogApi.js';

const ITEMS_PER_LOAD = 10;

const BrandPage = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_LOAD);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [catalogProducts, setCatalogProducts] = useState([]);
    const [catalogBrands, setCatalogBrands] = useState([]);

    const allBrands = useMemo(() => catalogBrands, [catalogBrands]);
    const allProducts = useMemo(() => catalogProducts, [catalogProducts]);

    const brand = useMemo(() => allBrands.find(b => b.id === parseInt(id)), [allBrands, id]);

    const brandProducts = useMemo(() => {
        if (!brand) return [];
        return allProducts.filter(p => p.brandId === brand.id);
    }, [brand, allProducts]);

    const fuse = useMemo(() => new Fuse(brandProducts, { keys: ['name', 'shortDescription', 'tags'], threshold: 0.3 }), [brandProducts]);

    const filteredProducts = useMemo(() => {
        if (searchQuery.trim()) return fuse.search(searchQuery).map(r => r.item);
        return brandProducts;
    }, [brandProducts, searchQuery, fuse]);

    const sortedProducts = useMemo(() => {
        let res = [...filteredProducts];
        switch (sortBy) {
            case 'cheapest': res.sort((a, b) => compareProductAvailability(a, b) || parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, ''))); break;
            case 'expensive': res.sort((a, b) => compareProductAvailability(a, b) || parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, ''))); break;
            case 'popular': res.sort((a, b) => compareProductAvailability(a, b) || b.rating - a.rating); break;
            case 'discount': res.sort((a, b) => compareProductAvailability(a, b) || b.discount - a.discount); break;
            default: res.sort((a, b) => compareProductAvailability(a, b) || b.id - a.id);
        }
        return res;
    }, [filteredProducts, sortBy]);

    const visibleProducts = useMemo(() => sortedProducts.slice(0, displayCount), [sortedProducts, displayCount]);
    const hasMore = displayCount < sortedProducts.length;
    const fetchMoreData = () => setTimeout(() => setDisplayCount(prev => Math.min(prev + ITEMS_PER_LOAD, sortedProducts.length)), 500);

    useEffect(() => { setDisplayCount(ITEMS_PER_LOAD); }, [sortBy, searchQuery, id]);
    useEffect(() => {
        let isMounted = true;

        const loadBrandProducts = async () => {
            setIsLoading(true);
            try {
                const [brandsResponse, productsResponse] = await Promise.all([
                    getCatalogBrands(),
                    getCatalogProducts({
                        page: 1,
                        pageSize: 200,
                        brandId: Number(id)
                    }),
                ]);

                if (!isMounted) return;
                setCatalogBrands(brandsResponse.brands || []);
                setCatalogProducts(productsResponse.products || []);
            } catch (error) {
                console.warn('Could not load brand products from API:', error);
                if (!isMounted) return;
                setCatalogBrands([]);
                setCatalogProducts([]);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadBrandProducts();

        return () => {
            isMounted = false;
        };
    }, [id]);
    useEffect(() => { window.scrollTo(0, 0); }, [id]);

    const handleSearch = () => setSearchQuery(searchInput.trim());
    const handleClearSearch = () => { setSearchInput(''); setSearchQuery(''); };


    if (isLoading) return <BrandPageSkeleton />;
    if (!brand) return <BrandNotFound />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <Breadcrumb items={[
                    { title: 'برندها', link: '/brands', icon: Award },
                    { title: brand.name, link: `/brand/${brand.id}` }
                ]} />

                <BrandHero brand={brand} productsCount={brandProducts.length} searchInput={searchInput} onSearchChange={setSearchInput} onSearch={handleSearch} onClearSearch={handleClearSearch} />

                {searchQuery && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 -mt-2">{sortedProducts.length.toLocaleString('fa-IR')} نتیجه برای "{searchQuery}"</p>}

                <BrandFilterBar sortBy={sortBy} onSortChange={setSortBy} viewMode={viewMode} onViewModeChange={setViewMode} totalResults={sortedProducts.length} showingResults={visibleProducts.length} />

                {sortedProducts.length === 0 ? (
                    <BrandEmpty searchQuery={searchQuery} onClear={handleClearSearch} />
                ) : (
                    <InfiniteScroll dataLength={visibleProducts.length} next={fetchMoreData} hasMore={hasMore} scrollThreshold="300px" style={{ overflow: 'visible' }}
                                    loader={<div className="flex justify-center py-6"><div className="w-8 h-8 border-4 border-[#002874] border-t-transparent rounded-full animate-spin" /></div>}
                                    endMessage={<p className="text-center text-gray-500 dark:text-gray-400 text-sm py-6">همه محصولات نمایش داده شد.</p>}>
                        <BrandProductGrid products={visibleProducts} viewMode={viewMode} />
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
};

export default BrandPage;
