// src/components/index2/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Star } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const HeroSection = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <section className="relative min-h-[350px] lg:min-h-[400px] overflow-hidden bg-gradient-to-br from-[#002874]/5 via-white to-[#4C6FB6]/5 dark:from-[#002874]/20 dark:via-[#1a1c20] dark:to-[#4C6FB6]/20">
            {/* پس‌زمینه دایره‌های متحرک */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#002874]/10 dark:bg-[#4C6FB6]/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#4C6FB6]/10 dark:bg-[#002874]/10 blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* سمت راست - محتوای متنی */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 50 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex-1 text-right lg:text-right"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874] dark:text-[#4C6FB6] text-xs sm:text-sm font-medium mb-4"
                        >
                            <Star size={14} className="fill-current" />
                            <span>تخفیف ویژه تابستانه</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4"
                        >
                            خرید آسان،
                            <span className="text-[#002874] dark:text-[#4C6FB6] block">ارسال سریع</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-8"
                        >
                            بهترین محصولات دیجیتال با بهترین قیمت و گارانتی اصالت کالا
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-start"
                        >
                            <button className="w-full sm:w-auto px-6 py-3 bg-[#002874] text-white rounded-xl font-medium hover:bg-[#001d5a] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                                <span>خرید از فروشگاه</span>
                                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                            </button>
                            <button className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:border-[#002874] dark:hover:border-[#4C6FB6] hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-all duration-300 flex items-center justify-center gap-2">
                                <ShoppingBag size={18} />
                                <span>مشاهده محصولات</span>
                            </button>
                        </motion.div>

                        {/* آمار */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                        >
                            <div>
                                <p className="text-2xl font-bold text-[#002874] dark:text-[#4C6FB6]">۲۰۰۰+</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">محصول</p>
                            </div>
                            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
                            <div>
                                <p className="text-2xl font-bold text-[#002874] dark:text-[#4C6FB6]">۵۰۰+</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">برند</p>
                            </div>
                            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
                            <div>
                                <p className="text-2xl font-bold text-[#002874] dark:text-[#4C6FB6]">۵۰k+</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">مشتری راضی</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* سمت چپ - تصویر */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
                        transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                        className="flex-1 relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden">
                            <LazyLoadImage
                                src="/images/hero-banner.png"
                                alt="Hero"
                                effect="blur"
                                className="w-full h-auto object-contain"
                                placeholder={<div className="w-full aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;