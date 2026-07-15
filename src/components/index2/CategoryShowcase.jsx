// src/components/index2/CategoryShowcase.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Smartphone, Watch, Laptop, Home, ShoppingBag, Coffee, Heart, Grid, ArrowLeft } from 'lucide-react';
import { getCatalogCategories } from '../../services/catalogApi.js';
import 'react-lazy-load-image-component/src/effects/blur.css';

// آیکون‌های داینامیک
const getCategoryIcon = (iconName) => {
    const icons = { Smartphone, Watch, Laptop, Home, ShoppingBag, Coffee, Heart, Grid };
    return icons[iconName] || Grid;
};

const CategoryShowcase = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoading(true);
            try {
                const data = await getCatalogCategories();
                const mainCategories = (data.categories || []).slice(0, 6);
                setCategories(mainCategories);
            } catch (err) {
                console.error('Error loading categories:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadCategories();
    }, []);

    if (isLoading) {
        return (
            <section className="py-3 sm:py-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#111111] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 animate-pulse">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 mb-3" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!categories.length) return null;

    return (
        <section className="py-3 sm:py-5">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800">
                <div className="relative p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#002874] to-[#4C6FB6] flex items-center justify-center">
                                <Grid size={16} className="text-white" />
                            </div>
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">دسته‌بندی‌های منتخب</h2>
                        </div>
                        <Link to="/categories" className="flex items-center gap-1 text-xs text-[#002874] dark:text-[#4C6FB6] hover:gap-2 transition-all">
                            <span>مشاهده همه</span>
                            <ArrowLeft size={12} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                        {categories.map((category) => {
                            const Icon = getCategoryIcon(category.icon);
                            return (
                                <div key={category.id}>
                                    <Link to={`/category/${category.id}`} className="group block">
                                        <div className="bg-white dark:bg-[#111111] rounded-xl p-4 text-center border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-br from-[#002874]/10 to-[#4C6FB6]/10 dark:from-[#002874]/30 dark:to-[#4C6FB6]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                                <Icon size={24} className="text-[#002874] dark:text-[#4C6FB6]" />
                                            </div>
                                            <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-[#002874] dark:group-hover:text-[#4C6FB6] transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                                {category.subcategories?.length || 0} زیردسته
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
