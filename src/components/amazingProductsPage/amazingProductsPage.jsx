// =============================================================================
// FILE: amazingProductsPage.jsx (اصلاح‌شده - تایمر سفید شیشه‌ای)
// =============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Fuse from 'fuse.js';
import { Flame } from 'lucide-react';
import productsData from '../../../public/jsons/products.json';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import { toast } from 'react-toastify';
import AmazingProductsPageSkeleton from '../skeleton/AmazingProductsPageSkeleton/AmazingProductsPageSkeleton.jsx';
import AmazingProductsHero from './amazingProductsHero';
import AmazingProductsFilterBar from './amazingProductsFilterBar';
import AmazingProductsGrid from './amazingProductsGrid';
import AmazingProductsEmpty from './amazingProductsEmpty';
import { Clock } from 'react-feather';
import useCartActions from '../../hooks/useCartActions.js';
import { compareProductAvailability } from '../../utils/helpers/productAvailability.js';
import { getCatalogProducts } from '../../services/catalogApi.js';

const ITEMS_PER_LOAD = 10;

const useCountdown = (targetDate) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculate = () => {
            const diff = new Date(targetDate) - new Date();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            const totalSeconds = Math.floor(diff / 1000);
            const totalMinutes = Math.floor(totalSeconds / 60);
            const totalHours = Math.floor(totalMinutes / 60);
            const days = Math.floor(totalHours / 24);
            setTimeLeft({ days, hours: totalHours % 24, minutes: totalMinutes % 60, seconds: totalSeconds % 60 });
        };
        calculate();
        const timer = setInterval(calculate, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return timeLeft;
};

const AmazingProductsPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('discount');
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_LOAD);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [catalogProducts, setCatalogProducts] = useState([]);
    const { addProductToCart } = useCartActions();

    const allProducts = useMemo(() => catalogProducts.length ? catalogProducts : productsData.products || [], [catalogProducts]);

    const amazingProducts = useMemo(() => allProducts.filter(p => p.isAmazing), [allProducts]);

    const fuse = useMemo(() => new Fuse(amazingProducts, { keys: ['name', 'shortDescription', 'tags'], threshold: 0.3 }), [amazingProducts]);

    const filteredProducts = useMemo(() => {
        if (searchQuery.trim()) return fuse.search(searchQuery).map(r => r.item);
        return amazingProducts;
    }, [amazingProducts, searchQuery, fuse]);

    const sortedProducts = useMemo(() => {
        let res = [...filteredProducts];
        switch (sortBy) {
            case 'cheapest': res.sort((a, b) => compareProductAvailability(a, b) || parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, ''))); break;
            case 'expensive': res.sort((a, b) => compareProductAvailability(a, b) || parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, ''))); break;
            case 'popular': res.sort((a, b) => compareProductAvailability(a, b) || b.rating - a.rating); break;
            default: res.sort((a, b) => compareProductAvailability(a, b) || b.discount - a.discount);
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
                    onlyAmazing: true,
                    sort: 'discounted'
                });
                if (isMounted) setCatalogProducts(response.products || []);
            } catch (error) {
                console.warn('Could not load amazing page products from API:', error);
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

    // تایمر ۱۵۰۰ روز
    const targetDate = useMemo(() => new Date(Date.now() + 1500 * 86400000).toISOString(), []);
    const { days, hours, minutes, seconds } = useCountdown(targetDate);

    if (isLoading) return <AmazingProductsPageSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">

                <Breadcrumb items={[{ title: 'پیشنهاد شگفت‌انگیز', link: '/amazing', icon: Flame }]} />

                {/* Hero */}
                <div className="relative mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#1a1a5e] p-5 sm:p-7 lg:p-9 mb-5">
                    <div className="absolute inset-0 opacity-[0.07]">
                        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border-[12px] border-white" />
                        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[12px] border-white" />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        {/* Title */}
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur">
                                <Flame size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                    پیشنهاد <span className="text-amber-400">شگفت‌انگیز</span>
                                </h1>
                                <p className="text-sm text-white/70 mt-1">{amazingProducts.length.toLocaleString('fa-IR')} محصول</p>
                            </div>
                        </div>

                        {/* Timer + Search */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                            {/* تایمر سفید شیشه‌ای */}
                            <div className="flex items-center gap-2 bg-black/30 backdrop-blur rounded-xl px-4 py-3 border border-white/10 flex-shrink-0">
                                <Clock size={18} className="text-amber-400" />
                                <div className="flex items-center gap-1.5" dir="ltr">
                                    <div className="flex flex-col items-center min-w-[30px]">
                                        <span className="text-xl font-bold text-white tabular-nums">{days.toLocaleString('fa-IR')}</span>
                                        <span className="text-[9px] text-white/50">روز</span>
                                    </div>
                                    <span className="text-white/40 text-lg font-bold">:</span>
                                    <div className="flex flex-col items-center min-w-[30px]">
                                        <span className="text-xl font-bold text-white tabular-nums">{hours.toString().padStart(2, '۰')}</span>
                                        <span className="text-[9px] text-white/50">ساعت</span>
                                    </div>
                                    <span className="text-white/40 text-lg font-bold">:</span>
                                    <div className="flex flex-col items-center min-w-[30px]">
                                        <span className="text-xl font-bold text-white tabular-nums">{minutes.toString().padStart(2, '۰')}</span>
                                        <span className="text-[9px] text-white/50">دقیقه</span>
                                    </div>
                                    <span className="text-white/40 text-lg font-bold">:</span>
                                    <div className="flex flex-col items-center min-w-[30px]">
                                        <span className="text-xl font-bold text-white tabular-nums">{seconds.toString().padStart(2, '۰')}</span>
                                        <span className="text-[9px] text-white/50">ثانیه</span>
                                    </div>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="relative flex-1 sm:w-64">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50">
                                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                </svg>
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="جستجو..."
                                    className="w-full py-2.5 pr-10 pl-20 rounded-xl bg-white/12 backdrop-blur border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/20 focus:border-white/30"
                                />
                                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    {searchInput && (
                                        <button onClick={handleClearSearch} className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                    )}
                                    <button onClick={handleSearch} className="px-3 py-1.5 bg-amber-400 text-[#002874] rounded-lg text-xs font-bold hover:bg-amber-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {searchQuery && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 -mt-2">
                        {sortedProducts.length.toLocaleString('fa-IR')} نتیجه برای "{searchQuery}"
                    </p>
                )}

                <AmazingProductsFilterBar
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    totalResults={sortedProducts.length}
                    showingResults={visibleProducts.length}
                />

                {sortedProducts.length === 0 ? (
                    <AmazingProductsEmpty searchQuery={searchQuery} onClear={handleClearSearch} />
                ) : (
                    <InfiniteScroll
                        dataLength={visibleProducts.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        scrollThreshold="300px"
                        style={{ overflow: 'visible' }}
                        loader={<div className="flex justify-center py-6"><div className="w-8 h-8 border-4 border-[#002874] border-t-transparent rounded-full animate-spin" /></div>}
                        endMessage={<p className="text-center text-gray-500 dark:text-gray-400 text-sm py-6">همه محصولات شگفت‌انگیز نمایش داده شد.</p>}
                    >
                        <AmazingProductsGrid
                            products={visibleProducts}
                            viewMode={viewMode}
                            onAddToCart={handleAddToCart}
                            onToggleWishlist={handleToggleWishlist}
                            navigate={navigate}
                        />
                    </InfiniteScroll>
                )}

            </div>
        </div>
    );
};

export default AmazingProductsPage;
