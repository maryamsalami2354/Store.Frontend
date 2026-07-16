import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
    Award, Users, Target, Eye, Heart, Shield,
    Truck, Clock, Smile, ChevronLeft, Home,
    CheckCircle, Star, Zap ,HelpCircle
} from 'react-feather';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {Breadcrumb} from "../../utils/helpers/breadcrumb.js";

const statsData = [
    { id: 1, icon: Users, value: '۱۰,۰۰۰+', label: 'مشتریان راضی', color: 'from-blue-500 to-blue-600' },
    { id: 2, icon: Truck, value: '۵۰,۰۰۰+', label: 'سفارش موفق', color: 'from-green-500 to-green-600' },
    { id: 3, icon: Clock, value: '۷ سال', label: 'سابقه فعالیت', color: 'from-purple-500 to-purple-600' },
    { id: 4, icon: Award, value: '۵۰۰+', label: 'برند معتبر', color: 'from-orange-500 to-orange-600' },
];

const valuesData = [
    { id: 1, icon: Heart, title: 'مشتری‌مداری', description: 'اولویت ما جلب رضایت کامل مشتریان و ارائه بهترین خدمات است.' },
    { id: 2, icon: Shield, title: 'تضمین کیفیت', description: 'تمامی محصولات دارای گارانتی معتبر و ضمانت اصالت کالا هستند.' },
    { id: 3, icon: Zap, title: 'سرعت و دقت', description: 'ارسال سریع و بسته‌بندی حرفه‌ای برای حفظ سلامت کالاهای شما.' },
    { id: 4, icon: Smile, title: 'پشتیبانی ۲۴/۷', description: 'تیم پشتیبانی ما در تمام روزهای هفته آماده پاسخگویی به شماست.' },
];

const teamData = [
    { id: 1, name: 'مهرداد وفایی منش', role: 'مدیرعامل و بنیانگذار', image: '/images/team/ceo.jpg' },
    { id: 2, name: 'مریم احمدی', role: 'مدیر بازاریابی', image: '/images/team/marketing.jpg' },
    { id: 3, name: 'علی رضایی', role: 'مدیر فنی', image: '/images/team/tech.jpg' },
    { id: 4, name: 'سارا محمدی', role: 'مدیر پشتیبانی', image: '/images/team/support.jpg' },
];

const milestonesData = [
    { year: '۱۳۹۶', title: 'تاسیس فروشگاه', description: 'شروع فعالیت با ۱۰ برند و ۲۰۰ محصول' },
    { year: '۱۳۹۸', title: 'راه‌اندازی اپلیکیشن', description: 'عرضه نسخه موبایل برای خرید آسان‌تر' },
    { year: '۱۴۰۰', title: '۱۰۰ هزار مشتری', description: 'عبور از مرز ۱۰۰ هزار مشتری وفادار' },
    { year: '۱۴۰۲', title: 'شعبه دوم', description: 'افتتاح فروشگاه فیزیکی در تهران' },
];

// =============================================================================
// TIMELINE ITEM (فقط این بخش انیمیشن داره)
// =============================================================================
const TimelineItem = ({ milestone, index, isLast }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <div ref={ref} className="relative">
            {/* خط عمودی دسکتاپ */}
            {!isLast && (
                <div className="absolute left-1/2 top-16 bottom-0 w-0.5 -translate-x-1/2 hidden md:block">
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-full h-full bg-gradient-to-b from-[#002874] via-[#4C6FB6] to-transparent origin-top"
                    />
                </div>
            )}

            {/* خط عمودی موبایل */}
            {!isLast && (
                <div className="absolute right-5 top-14 bottom-0 w-0.5 md:hidden">
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-full h-full bg-gradient-to-b from-[#002874] to-[#4C6FB6] origin-top"
                    />
                </div>
            )}

            <div className={`flex items-start gap-4 mb-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                {/* محتوای دسکتاپ - سمت چپ */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-left md:pr-8' : 'md:text-right md:pl-8'} hidden md:block`}>
                    <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition-all inline-block">
                            <span className="inline-block text-xs font-bold text-[#002874]  dark:text-[#4C6FB6] bg-[#002874]/10 dark:bg-[#4C6FB6]/20 px-2.5 py-1 rounded-lg mb-2">
                                {milestone.year}
                            </span>
                            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{milestone.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{milestone.description}</p>
                        </div>
                    </motion.div>
                </div>

                {/* نقطه مرکزی با انیمیشن */}
                <div className="relative z-10 flex-shrink-0">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-[#002874] to-[#4C6FB6] flex items-center justify-center shadow-lg shadow-[#002874]/30 dark:shadow-[#4C6FB6]/30"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <CheckCircle size={20} className="text-white" />
                        </motion.div>
                    </motion.div>

                    {/* حلقه پالس */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: [0, 0.5, 0], scale: [1, 1.8, 2.5] } : { opacity: 0, scale: 0 }}
                        transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        className="absolute inset-0 rounded-full bg-[#002874]/20 dark:bg-[#4C6FB6]/20"
                    />
                </div>

                {/* محتوای موبایل - همیشه سمت راست */}
                <div className="flex-1 md:hidden">
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                            <span className="inline-block text-xs font-bold text-[#002874]  dark:text-[#4C6FB6] bg-[#002874]/10 dark:bg-[#4C6FB6]/20 px-2.5 py-1 rounded-lg mb-2">
                                {milestone.year}
                            </span>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{milestone.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{milestone.description}</p>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

// =============================================================================
// MAIN COMPONENT (بقیه بخش‌ها بدون انیمیشن)
// =============================================================================
const AboutUsComponents = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2 mb-6">
                        <Skeleton width={50} height={16} borderRadius={8} />
                        <Skeleton width={12} height={12} borderRadius="50%" />
                        <Skeleton width={80} height={16} borderRadius={8} />
                    </div>
                    <Skeleton height={200} borderRadius={24} className="mb-6" />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border p-4">
                                <Skeleton circle width={48} height={48} className="mb-3" />
                                <Skeleton width={80} height={24} borderRadius={8} className="mb-1" />
                                <Skeleton width={60} height={14} borderRadius={4} />
                            </div>
                        ))}
                    </div>
                    <div className="bg-white dark:bg-[#111] rounded-2xl border p-6 mb-6">
                        <Skeleton width={200} height={28} borderRadius={8} className="mb-4" />
                        <Skeleton count={4} height={16} borderRadius={4} className="mb-2" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">

                <Breadcrumb
                    items={[
                        { title: "سوالات متداول", link: "/faq", icon: HelpCircle },
                    ]}
                />

                {/* Hero Section */}
                <div className="relative mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#4C6FB6] p-6 sm:p-8 lg:p-12 mb-6">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white" />
                        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-4 border-white/20" />
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">
                            داستان <span className="text-amber-400">کیان شاپ</span>
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed">
                            ما از سال ۱۳۹۶ با هدف ایجاد تجربه‌ای متفاوت در خرید آنلاین شروع به کار کردیم.
                            کیان شاپ امروز با بیش از ۵۰۰ برند معتبر و ۱۰,۰۰۰ مشتری راضی، به یکی از معتبرترین
                            فروشگاه‌های اینترنتی تبدیل شده است.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-8">
                    {statsData.map(stat => (
                        <div
                            key={stat.id}
                            className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 lg:p-5 text-center group hover:shadow-lg transition-all duration-300"
                        >
                            <div className={`inline-flex p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} className="sm:size-6" />
                            </div>
                            <div className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-0.5">
                                {stat.value}
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                <Target size={22} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">ماموریت ما</h2>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            فراهم کردن بستری امن، سریع و مطمئن برای خرید آنلاین با بهترین قیمت و کیفیت.
                            ما متعهد به ارائه محصولات اصل با گارانتی معتبر و پشتیبانی ۲۴ ساعته هستیم.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-900/30">
                                <Eye size={22} className="text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">چشم‌انداز ما</h2>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            تبدیل شدن به بزرگترین و معتبرترین فروشگاه اینترنتی ایران تا سال ۱۴۰۵.
                            ما به دنبال ایجاد انقلابی در صنعت تجارت الکترونیک ایران هستیم.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
                        ارزش‌های ما
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                        {valuesData.map(value => (
                            <div
                                key={value.id}
                                className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 text-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="inline-flex p-3 rounded-2xl bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874]  dark:text-[#4C6FB6] mb-3 group-hover:bg-[#002874] group-hover:text-white dark:group-hover:bg-[#4C6FB6] transition-all">
                                    <value.icon size={24} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline - فقط این بخش انیمیشن داره */}
                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-10 text-center">
                        مسیر پیشرفت ما
                    </h2>

                    <div className="relative max-w-4xl mx-auto">
                        {milestonesData.map((milestone, index) => (
                            <TimelineItem
                                key={milestone.year}
                                milestone={milestone}
                                index={index}
                                isLast={index === milestonesData.length - 1}
                            />
                        ))}
                    </div>
                </div>

                {/* Team */}
                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
                        تیم ما
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                        {teamData.map(member => (
                            <div
                                key={member.id}
                                className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center group hover:shadow-lg transition-all"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br from-[#002874]/20 to-[#4C6FB6]/20 dark:from-[#4C6FB6]/30 dark:to-[#002874]/30 mb-3 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-[#002874]  dark:text-[#4C6FB6] font-bold text-xl">${member.name[0]}</div>`;
                                        }}
                                    />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{member.name}</h3>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-[#002874] to-[#003399] dark:from-[#002874] dark:to-[#003399] rounded-2xl p-6 sm:p-8 text-center text-white">
                    <h2 className="text-xl sm:text-2xl font-extrabold mb-2">همین حالا به خانواده کیان شاپ بپیوندید</h2>
                    <p className="text-sm text-white/70 mb-4 max-w-lg mx-auto">
                        با ثبت‌نام در کیان شاپ از تخفیف‌های ویژه و جدیدترین محصولات باخبر شوید
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#002874]  rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                    >
                        ثبت‌نام / ورود
                        <ChevronLeft size={16} className="" />
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default AboutUsComponents;