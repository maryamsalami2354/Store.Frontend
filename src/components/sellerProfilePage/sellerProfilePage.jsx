// =============================================================================
// FILE: sellerProfilePage.jsx
// =============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Award } from 'react-feather';
import sellersData from '../../../public/jsons/sellers.json';
import productsData from '../../../public/jsons/products.json';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import { toast } from 'react-toastify';
import SellerProfilePageSkeleton from '../skeleton/SellerProfilePageSkeleton/SellerProfilePageSkeleton';
import SellerProfileEmpty from './sellerProfileEmpty';
import SellerProfileHero from './sellerProfileHero';
import SellerProfileStats from './sellerProfileStats';
import SellerProfileProducts from './sellerProfileProducts';
import SellerProfileReviews from './sellerProfileReviews';
import SellerProfileSidebar from './sellerProfileSidebar';

const ITEMS_PER_LOAD = 12;

const SellerProfilePage = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [seller, setSeller] = useState(null);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_LOAD);

    useEffect(() => {
        const load = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));

            // پیدا کردن فروشنده
            const allSellers = (sellersData.sellers || []).map((s, i) => ({
                ...s,
                rating: (4.0 + Math.random() * 1.0).toFixed(1),
                totalSales: Math.floor(Math.random() * 5000) + 500,
                totalProducts: Math.floor(Math.random() * 200) + 10,
                joinedDate: new Date(Date.now() - Math.random() * 365 * 86400000).toLocaleDateString('fa-IR'),
                reviews: Math.floor(Math.random() * 500) + 100,
                satisfaction: Math.floor(Math.random() * 20) + 80,
                followers: Math.floor(Math.random() * 10000) + 1000,
                ratingCount: Math.floor(Math.random() * 500) + 50,
                responseRate: Math.floor(Math.random() * 20) + 80,
                responseTime: 'کمتر از ۱ ساعت',
                city: 'تهران',
                bio: 'فروشنده برتر شاپ مارکت با سابقه درخشان در ارائه محصولات باکیفیت و خدمات عالی به مشتریان.',
                phone: '۰۹۱۲۳۴۵۶۷۸۹',
                email: `seller${id}@shopmarket.ir`,
                badges: ['فروشنده برتر', 'ارسال سریع', 'ضمانت بازگشت'],
            }));

            const found = allSellers.find(s => s.id === parseInt(id)) || allSellers[0];
            if (found) found.rank = allSellers.indexOf(found) + 1;
            setSeller(found);

            // محصولات فروشنده
            const allProducts = productsData.products || [];
            const sellerProducts = allProducts.slice(0, Math.floor(Math.random() * 20) + 10).map(p => ({
                ...p,
                brandId: found.id,
            }));
            setProducts(sellerProducts);

            // نظرات ساختگی
            const sampleReviews = [
                { id: 1, user: 'علی محمدی', rating: 5, text: 'محصول با کیفیت و ارسال سریع. از خریدم خیلی راضیم.', date: '۱۴۰۴/۰۲/۲۰', avatar: null },
                { id: 2, user: 'سارا رضایی', rating: 4, text: 'بسته‌بندی عالی بود، فقط کمی تأخیر در ارسال داشت.', date: '۱۴۰۴/۰۲/۱۸', avatar: null },
                { id: 3, user: 'محمد کریمی', rating: 5, text: 'بهترین فروشنده‌ای که تا حالا ازش خرید کردم. پیشنهاد می‌کنم.', date: '۱۴۰۴/۰۲/۱۵', avatar: null },
                { id: 4, user: 'مریم حسینی', rating: 5, text: 'قیمت مناسب و کیفیت عالی. حتماً باز هم خرید می‌کنم.', date: '۱۴۰۴/۰۲/۱۲', avatar: null },
                { id: 5, user: 'رضا احمدی', rating: 4, text: 'خوب بود، مطابق توضیحات.', date: '۱۴۰۴/۰۲/۱۰', avatar: null },
            ];
            setReviews(sampleReviews);

            setIsLoading(false);
        };
        load();
        window.scrollTo(0, 0);
    }, [id]);

    const visibleProducts = products.slice(0, displayCount);
    const hasMore = displayCount < products.length;
    const fetchMore = () => setTimeout(() => setDisplayCount(prev => Math.min(prev + ITEMS_PER_LOAD, products.length)), 500);


    if (isLoading) return <SellerProfilePageSkeleton />;
    if (!seller) return <SellerProfileEmpty />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">

                <Breadcrumb items={[
                    { title: 'فروشندگان', link: '/best-sellers', icon: Award },
                    { title: seller.name }
                ]} />

                <SellerProfileHero seller={seller} />
                <SellerProfileStats seller={seller} />

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-6">
                    {/* Products */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#002874] dark:bg-[#4C6FB6] rounded-full"></span>
                            محصولات فروشنده
                        </h2>

                        {products.length === 0 ? (
                            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-500 text-sm">
                                محصولی برای نمایش وجود ندارد.
                            </div>
                        ) : (
                            <InfiniteScroll
                                dataLength={visibleProducts.length}
                                next={fetchMore}
                                hasMore={hasMore}
                                scrollThreshold="300px"
                                style={{ overflow: 'visible' }}
                                loader={<div className="flex justify-center py-6"><div className="w-8 h-8 border-4 border-[#002874] border-t-transparent rounded-full animate-spin" /></div>}
                                endMessage={<p className="text-center text-gray-500 text-sm py-6">همه محصولات نمایش داده شد.</p>}
                            >
                                <SellerProfileProducts
                                    products={visibleProducts}
                                />
                            </InfiniteScroll>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <SellerProfileSidebar seller={seller} />
                            <SellerProfileReviews reviews={reviews} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SellerProfilePage;