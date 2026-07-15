// src/components/singleProduct/singleProduct.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Home, Star ,ShoppingBag, Package } from 'react-feather';
import { toast } from 'react-toastify';
import ProductGallery from './productGallery';
import ProductMainInfo from './productMainInfo';
import ProductSidebar from './productSidebar';
import ProductTabs from './productTabs';
import ProductStickyAddToCart from './productStickyAddToCart';
import SellersList from './sections/sellersList';
import RelatedProducts from './relatedProducts';
import RecentlyViewed from './recentlyViewed';
import PriceChartModal from './modals/priceChartModal';
import CompareModal from './modals/compareModal';
import ShareModal from './modals/shareModal';
import { getCatalogProduct, getRelatedCatalogProducts } from '../../services/catalogApi.js';
import { addCartItem } from '../../services/cartApi.js';
import useStore from '../../store/index.js';

const mockSellers = [
    { id: 1, name: 'مهرآفرین', satisfaction: 88, performance: 'عالی', delivery: 'آماده ارسال', warranty: 'گارانتی ۱۸ ماهه', price: '9,000,000', oldPrice: '10,000,000', discount: 10 },
    { id: 2, name: 'دیجی‌شاپ', satisfaction: 92, performance: 'خوب', delivery: 'ارسال ۳ روزه', warranty: 'گارانتی ۱۲ ماهه', price: '9,200,000', oldPrice: '10,000,000', discount: 8 },
    { id: 3, name: 'تکنولایف', satisfaction: 85, performance: 'عالی', delivery: 'آماده ارسال', warranty: 'گارانتی ۲۴ ماهه', price: '8,800,000', oldPrice: '10,000,000', discount: 12 },
];

const SingleProductChild = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showChart, setShowChart] = useState(false);
    const [showCompare, setShowCompare] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const setCart = useStore((state) => state.setCart);

    useEffect(() => {
        let isMounted = true;

        const loadProduct = async () => {
            setIsLoading(true);

            try {
                const found = await getCatalogProduct(id);
                const relatedResponse = await getRelatedCatalogProducts({
                    categoryId: found.categoryId,
                    excludeId: found.id,
                    take: 10,
                });

                if (!isMounted) return;

                setProduct(found);
                setRelatedProducts(relatedResponse.products || []);
                const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                const updated = [found, ...viewed.filter(p => p.id !== found.id)].slice(0, 10);
                localStorage.setItem('recentlyViewed', JSON.stringify(updated));
            } catch {
                if (isMounted) {
                    setProduct(null);
                    setRelatedProducts([]);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadProduct();
        window.scrollTo(0, 0);

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (isLoading) return <ProductSkeleton />;

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-bold mb-2">محصول یافت نشد</p>
                    <Link to="/" className="text-[#002874]  hover:underline">بازگشت به فروشگاه</Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = async (quantity = 1) => {
        try {
            const cart = await addCartItem({ productId: product.id, quantity });
            setCart(cart);
            toast.success(`${product.name} به سبد خرید اضافه شد`);
        } catch (error) {
            toast.error(error.message || 'خطا در افزودن محصول به سبد خرید');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-4 lg:px-6 py-4">

                <Breadcrumb
                    items={[
                        { title: "فروشگاه", link: "/product", icon: ShoppingBag },
                        { title: product.name, link: `/product/${product.id}`, icon: Package }
                    ]}
                />

                <div className="bg-white  mt-2 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-12">

                        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-l border-gray-200 dark:border-gray-800">
                            <ProductGallery
                                product={product}
                                onShare={() => setShowShare(true)}
                                onCompare={() => setShowCompare(true)}
                                onChart={() => setShowChart(true)}
                            />
                        </div>

                        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-l border-gray-200 dark:border-gray-800 p-4 lg:p-5">
                            <ProductMainInfo product={product} />
                        </div>

                        <div className="lg:col-span-3 p-4 lg:p-5">
                            <ProductSidebar product={product} onAddToCart={handleAddToCart} />
                        </div>

                    </div>
                </div>

                <div className="mt-6">
                    <SellersList sellers={mockSellers} product={product} onAddToCart={handleAddToCart} />
                </div>

                <div className="mt-6">
                    <ProductTabs product={product} />
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-8">
                        <RelatedProducts products={relatedProducts} />
                    </div>
                )}

                <div className="mt-8 mb-10">
                    <RecentlyViewed currentProductId={product.id} />
                </div>
            </div>

            <ProductStickyAddToCart product={product} onAddToCart={handleAddToCart} />

            <PriceChartModal isOpen={showChart} onClose={() => setShowChart(false)} product={product} />
            <CompareModal isOpen={showCompare} onClose={() => setShowCompare(false)} product={product} similarProducts={relatedProducts.slice(0, 2)} />
            <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} product={product} />
        </div>
    );
};
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {Breadcrumb} from "../../utils/helpers/breadcrumb.js";

const ProductSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4 lg:px-6 py-4">

            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2 mb-6">
                <Skeleton width={60} height={16} borderRadius={8} />
                <Skeleton width={12} height={12} borderRadius="50%" />
                <Skeleton width={80} height={16} borderRadius={8} />
                <Skeleton width={12} height={12} borderRadius="50%" />
                <Skeleton width={160} height={16} borderRadius={8} />
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12">

                    {/* Gallery Skeleton - Left */}
                    <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-l border-gray-200 dark:border-gray-800 p-4 lg:p-6">
                        {/* Main Image */}
                        <div className="relative rounded-2xl overflow-hidden">
                            <Skeleton height={384} borderRadius={16} className="lg:h-96" />
                            {/* Discount Badge */}
                            <div className="absolute top-3 left-3">
                                <Skeleton width={50} height={24} borderRadius={8} />
                            </div>
                        </div>

                        {/* Thumbnail Row */}
                        <div className="flex gap-2 mt-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex-1">
                                    <Skeleton height={80} borderRadius={12} className={i === 0 ? 'ring-2 ring-[#002874]/30 dark:ring-[#4C6FB6]/30 rounded-xl' : ''} />
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                            <Skeleton height={40} borderRadius={12} containerClassName="flex-1" />
                            <Skeleton height={40} borderRadius={12} containerClassName="flex-1" />
                            <Skeleton height={40} borderRadius={12} containerClassName="flex-1" />
                        </div>
                    </div>

                    {/* Main Info Skeleton - Center */}
                    <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-l border-gray-200 dark:border-gray-800 p-4 lg:p-6">
                        {/* Category & Blog Tags */}
                        <div className="flex items-center gap-2 mb-4">
                            <Skeleton width={96} height={24} borderRadius={8} />
                            <Skeleton width={12} height={12} borderRadius="50%" />
                            <Skeleton width={80} height={24} borderRadius={8} />
                        </div>

                        {/* Title - Two lines */}
                        <div className="space-y-2 mb-4">
                            <Skeleton height={28} borderRadius={8} />
                            <Skeleton width="75%" height={28} borderRadius={8} />
                        </div>

                        {/* Short Description */}
                        <Skeleton width="66%" height={16} borderRadius={8} className="mb-4" />

                        {/* Rating Section */}
                        <div className="flex items-center gap-4 mb-5 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 rounded-xl px-3 py-1.5">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} width={14} height={14} borderRadius={4} />
                                    ))}
                                </div>
                                <Skeleton width={32} height={14} borderRadius={4} />
                            </div>
                            <Skeleton width={96} height={16} borderRadius={8} />
                            <Skeleton width={112} height={16} borderRadius={8} />
                        </div>

                        {/* Color Selection */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <Skeleton width={96} height={20} borderRadius={8} />
                                <Skeleton width={48} height={20} borderRadius={8} />
                            </div>
                            <div className="flex gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gray-800">
                                        <Skeleton width={20} height={20} borderRadius="50%" />
                                        <Skeleton width={40} height={12} borderRadius={4} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Skeleton width={20} height={20} borderRadius={6} />
                                    <Skeleton width={112} height={20} borderRadius={8} />
                                </div>
                                <Skeleton width={64} height={16} borderRadius={8} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-xl">
                                        <Skeleton width={28} height={28} borderRadius={8} />
                                        <Skeleton width="70%" height={12} borderRadius={4} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Skeleton - Right */}
                    <div className="lg:col-span-3 p-4 lg:p-6">
                        {/* Price Card */}
                        <div className="rounded-2xl p-5 mb-4 border border-gray-200 dark:border-gray-700">
                            {/* Warranty Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <Skeleton width={32} height={32} borderRadius={8} />
                                <div>
                                    <Skeleton width={80} height={16} borderRadius={8} />
                                    <Skeleton width={64} height={12} borderRadius={4} className="mt-1" />
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2">
                                    <Skeleton width={96} height={16} borderRadius={8} />
                                    <Skeleton width={48} height={20} borderRadius={8} />
                                </div>
                                <Skeleton width={160} height={32} borderRadius={8} />
                            </div>

                            {/* Add to Cart Button */}
                            <Skeleton height={48} borderRadius={12} className="mb-3" />

                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 gap-2">
                                <Skeleton height={40} borderRadius={12} />
                                <Skeleton height={40} borderRadius={12} />
                                <Skeleton height={40} borderRadius={12} />
                                <Skeleton height={40} borderRadius={12} />
                            </div>
                        </div>

                        {/* Store Info */}
                        <div className="rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-3">
                                <Skeleton circle width={40} height={40} />
                                <div>
                                    <Skeleton width={96} height={16} borderRadius={8} />
                                    <Skeleton width={64} height={12} borderRadius={4} className="mt-1" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton width={16} height={16} borderRadius={4} />
                                    <Skeleton width="80%" height={12} borderRadius={4} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton width={16} height={16} borderRadius={4} />
                                    <Skeleton width="60%" height={12} borderRadius={4} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton width={16} height={16} borderRadius={4} />
                                    <Skeleton width="70%" height={12} borderRadius={4} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sellers Section Skeleton */}
            <div className="mt-6 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton width={128} height={24} borderRadius={8} />
                    <Skeleton width={80} height={16} borderRadius={8} />
                </div>
                <div className="overflow-x-auto">
                    <div className="flex gap-3 min-w-[800px]">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex-1 min-w-[250px] bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <Skeleton width={32} height={32} borderRadius={8} />
                                    <div>
                                        <Skeleton width={80} height={16} borderRadius={8} />
                                        <Skeleton width={56} height={12} borderRadius={4} className="mt-1" />
                                    </div>
                                </div>
                                <div className="space-y-2 mb-3">
                                    <Skeleton height={12} borderRadius={4} />
                                    <Skeleton width="75%" height={12} borderRadius={4} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Skeleton width={96} height={24} borderRadius={8} />
                                    <Skeleton width={80} height={32} borderRadius={8} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="mt-6 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex gap-0 border-b border-gray-200 dark:border-gray-800">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex-1 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
                            <Skeleton width={80} height={16} borderRadius={8} />
                        </div>
                    ))}
                </div>
                <div className="p-6 space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Skeleton width={32} height={32} borderRadius={8} />
                                <Skeleton width={128} height={20} borderRadius={8} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="flex items-center gap-2">
                                        <Skeleton width={6} height={6} borderRadius="50%" />
                                        <Skeleton width={80} height={12} borderRadius={4} />
                                        <Skeleton width={96} height={12} borderRadius={4} className="ms-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Related Products Skeleton */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton width={160} height={24} borderRadius={8} />
                    <div className="flex gap-2">
                        <Skeleton width={32} height={32} borderRadius={8} />
                        <Skeleton width={32} height={32} borderRadius={8} />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                            <Skeleton height={128} borderRadius={12} className="mb-2" />
                            <div className="flex gap-0.5 mb-1">
                                {[...Array(5)].map((_, j) => (
                                    <Skeleton key={j} width={12} height={12} borderRadius={4} />
                                ))}
                            </div>
                            <Skeleton height={16} borderRadius={4} className="mb-1" />
                            <Skeleton width="75%" height={16} borderRadius={4} className="mb-2" />
                            <div className="flex items-center justify-between">
                                <Skeleton width={80} height={20} borderRadius={8} />
                                <Skeleton width={32} height={32} borderRadius={8} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recently Viewed Skeleton */}
            <div className="mt-8 mb-10">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton width={200} height={24} borderRadius={8} />
                    <Skeleton width={100} height={16} borderRadius={8} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                            <Skeleton height={128} borderRadius={12} className="mb-2" />
                            <Skeleton height={14} borderRadius={4} className="mb-1" />
                            <Skeleton width="60%" height={14} borderRadius={4} className="mb-2" />
                            <Skeleton width={80} height={20} borderRadius={8} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default SingleProductChild;
