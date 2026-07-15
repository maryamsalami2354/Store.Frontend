// src/components/index2/DualBanner.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag, Sparkles } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const banners = [
    {
        id: 1,
        title: "تخفیف ویژه تابستان",
        subtitle: "تا ۵۰٪ تخفیف",
        bgColor: "from-orange-500 to-red-600",
        image: "/images/banners/summer-sale.jpg",
        link: "/category/summer-sale",
        buttonText: "مشاهده تخفیف‌ها",
        icon: Tag
    },
    {
        id: 2,
        title: "محصولات جدید",
        subtitle: "آخرین مدل‌ها",
        bgColor: "from-blue-600 to-cyan-600",
        image: "/images/banners/new-products.jpg",
        link: "/category/new",
        buttonText: "مشاهده محصولات",
        icon: Sparkles
    }
];

const DualBanner = () => {
    return (
        <section className="py-3 sm:py-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {banners.map((banner, idx) => {
                    const Icon = banner.icon;
                    return (
                        <motion.div
                            key={banner.id}
                            initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="h-full"
                        >
                            <Link to={banner.link} className="group block relative overflow-hidden rounded-2xl h-full shadow-lg hover:shadow-xl transition-all duration-300">
                                {/* پس‌زمینه تصویر با اوورلی */}
                                <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden">
                                    <LazyLoadImage
                                        src={banner.image}
                                        alt={banner.title}
                                        effect="blur"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        placeholder={<div className="w-full h-full bg-gray-300 dark:bg-gray-700 animate-pulse" />}
                                    />
                                    {/* گرادینت رنگی */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} opacity-85`} />

                                    {/* افکت‌های تزئینی */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/20 rounded-full blur-2xl" />

                                    {/* الگوی نقطه‌چین */}
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                                    {/* محتوا */}
                                    <div className="absolute inset-0 flex flex-col items-start justify-center p-6 sm:p-8">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <Icon size={16} className="text-white" />
                                            </div>
                                            <span className="text-white/90 text-xs sm:text-sm font-medium tracking-wide">
                                                {banner.subtitle}
                                            </span>
                                        </div>

                                        <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
                                            {banner.title}
                                        </h3>

                                        <div className="w-12 h-0.5 bg-white/50 mb-4" />

                                        <span className="inline-flex items-center gap-2 text-white text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full group-hover:bg-white/30 group-hover:gap-3 transition-all duration-300">
                                            {banner.buttonText}
                                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default DualBanner;