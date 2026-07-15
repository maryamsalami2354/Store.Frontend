// src/components/index2/BestSellerProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toast } from 'react-toastify';
import { TrendingUp, Star, ShoppingBag, Heart, Award, ArrowLeft, Eye } from 'lucide-react';
import productsData from '../../../public/jsons/products.json';
import sellerAnalytics from '../../../public/jsons/sellerAnalytics.json';
import useCartActions from '../../hooks/useCartActions.js';
import 'react-lazy-load-image-component/src/effects/blur.css';

const BestSellerProducts = ({ title = "پرفروش‌ترین محصولات", subtitle = "محبوب‌ترین‌های بازار", linkText = "مشاهده همه", linkHref = "/best-sellers", onAddToCart, onToggleWishlist }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { addProductToCart } = useCartActions();

    useEffect(() => {
        const loadBestSellers = () => {
            setIsLoading(true);
            try {
                const allProducts = productsData.products || [];
                const topProductsIds = (sellerAnalytics.topProducts || []).slice(0, 8).map(p => p.id);
                const bestSellerProducts = topProductsIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
                setProducts(bestSellerProducts);
            } catch (err) {
                console.error('Error loading best sellers:', err);
                const allProducts = productsData.products || [];
                setProducts(allProducts.slice(0, 8));
            } finally {
                setIsLoading(false);
            }
        };
        loadBestSellers();
    }, []);

    const StarRating = ({ rating }) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={12} className={`${i <= Math.floor(rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />
            ))}
            <span className="text-[10px] text-gray-500 mr-1">({rating || 4})</span>
        </div>
    );

    if (isLoading) {
        return (
            <section className="py-3 sm:py-5">
                <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                    <div className="animate-pulse space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                                    <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!products.length) return null;

    return (
        <section className="py-3 sm:py-5">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-amber-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800">
                <div className="relative p-4 sm:p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                <TrendingUp size={18} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
                            </div>
                        </div>
                        <Link to={linkHref} className="flex items-center gap-1 text-xs text-[#002874] dark:text-[#4C6FB6] hover:gap-2 transition-all">
                            <span>{linkText}</span>
                            <ArrowLeft size={12} />
                        </Link>
                    </div>

                    {/* Grid محصولات */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {products.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="group cursor-pointer bg-white dark:bg-[#111111] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* رتبه محصول */}
                                <div className="relative">
                                    <div className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                                        {idx + 1}
                                    </div>
                                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleWishlist?.(product.id);
                                                toast.success(`${product.name} به علاقه‌مندی‌ها اضافه شد`);
                                            }}
                                            className="p-1.5 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-md text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                                        >
                                            <Heart size={14} />
                                        </button>
                                    </div>
                                    <LazyLoadImage
                                        src={product.image}
                                        alt={product.name}
                                        effect="blur"
                                        className="w-full h-44 object-contain p-4 bg-gray-50 dark:bg-gray-800/50 group-hover:scale-105 transition-transform duration-500"
                                        placeholder={<div className="w-full h-44 bg-gray-200 dark:bg-gray-700 animate-pulse" />}
                                    />
                                </div>

                                {/* اطلاعات محصول */}
                                <div className="p-3">
                                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 min-h-[40px] group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="mt-2">
                                        <StarRating rating={product.rating} />
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div>
                                            {product.oldPrice && (
                                                <span className="text-[10px] text-gray-400 line-through block">
                                                    {product.oldPrice}
                                                </span>
                                            )}
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {product.price}
                                                <span className="text-[9px] mr-0.5 font-normal text-gray-500">تومان</span>
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAddToCart?.(product);
                                                addProductToCart(product);
                                            }}
                                            className="p-2 rounded-lg bg-[#002874] text-white hover:bg-[#001d5a] transition-colors"
                                        >
                                            <ShoppingBag size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BestSellerProducts;
