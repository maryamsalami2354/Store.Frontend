import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronDown, ChevronLeft, Home, Search, HelpCircle,
    Package, CreditCard, Truck, RotateCcw, Shield, User,
    MessageCircle, Phone, X, ShoppingBag
} from 'react-feather';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {Breadcrumb} from "../../utils/helpers/breadcrumb.js";

const faqCategoriesData = [
    { id: 'all', label: 'همه', icon: HelpCircle },
    { id: 'order', label: 'ثبت سفارش', icon: Package },
    { id: 'payment', label: 'پرداخت', icon: CreditCard },
    { id: 'delivery', label: 'ارسال', icon: Truck },
    { id: 'return', label: 'بازگشت کالا', icon: RotateCcw },
    { id: 'warranty', label: 'گارانتی', icon: Shield },
    { id: 'account', label: 'حساب کاربری', icon: User },
];

const faqData = [
    {
        id: 1,
        category: 'order',
        question: 'چگونه سفارش خود را ثبت کنم؟',
        answer: 'برای ثبت سفارش کافیست محصول مورد نظر را به سبد خرید اضافه کنید و پس از ورود به حساب کاربری، آدرس و روش ارسال را انتخاب کرده و پرداخت را انجام دهید.'
    },
    {
        id: 2,
        category: 'order',
        question: 'آیا امکان ثبت سفارش تلفنی وجود دارد؟',
        answer: 'بله، می‌توانید با شماره ۰۲۱-۱۲۳۴۵۶۷۸ تماس گرفته و سفارش خود را به صورت تلفنی ثبت کنید. کارشناسان ما آماده راهنمایی شما هستند.'
    },
    {
        id: 3,
        category: 'order',
        question: 'چگونه از وضعیت سفارش خود مطلع شوم؟',
        answer: 'پس از ثبت سفارش، کد پیگیری برای شما ارسال می‌شود. با ورود به پنل کاربری و بخش "پیگیری سفارشات" می‌توانید وضعیت سفارش خود را مشاهده کنید.'
    },
    {
        id: 4,
        category: 'payment',
        question: 'روش‌های پرداخت کدامند؟',
        answer: 'شما می‌توانید از طریق کارت‌های بانکی عضو شتاب، کیف پول کیان شاپ و یا پرداخت در محل (برای تهران) هزینه سفارش را پرداخت کنید.'
    },
    {
        id: 5,
        category: 'payment',
        question: 'آیا پرداخت آنلاین امن است؟',
        answer: 'بله، تمامی تراکنش‌ها از طریق درگاه بانکی معتبر و با پروتکل SSL انجام می‌شود. اطلاعات بانکی شما نزد ما ذخیره نمی‌شود.'
    },
    {
        id: 6,
        category: 'delivery',
        question: 'هزینه ارسال چگونه محاسبه می‌شود؟',
        answer: 'برای سفارشات بالای ۵۰۰ هزار تومان ارسال رایگان است. برای سفارشات کمتر، هزینه ارسال بر اساس وزن و مقصد بین ۲۵ تا ۵۰ هزار تومان محاسبه می‌شود.'
    },
    {
        id: 7,
        category: 'delivery',
        question: 'مدت زمان تحویل سفارش چقدر است؟',
        answer: 'سفارشات تهران ۱ تا ۲ روز کاری و سفارشات شهرستان ۳ تا ۵ روز کاری تحویل داده می‌شوند. زمان دقیق در صفحه هر محصول ذکر شده است.'
    },
    {
        id: 8,
        category: 'return',
        question: 'شرایط بازگشت کالا چیست؟',
        answer: 'شما تا ۷ روز پس از دریافت کالا فرصت دارید در صورت انصراف از خرید یا وجود مشکل در کالا، آن را مرجوع کنید. کالا باید در بسته‌بندی اصلی و بدون آسیب باشد.'
    },
    {
        id: 9,
        category: 'return',
        question: 'هزینه بازگشت کالا با چه کسی است؟',
        answer: 'در صورتی که کالا مشکل داشته باشد، هزینه بازگشت با فروشگاه است. در صورت انصراف از خرید، هزینه ارسال برگشت با مشتری می‌باشد.'
    },
    {
        id: 10,
        category: 'warranty',
        question: 'گارانتی محصولات چگونه است؟',
        answer: 'تمامی محصولات دارای گارانتی معتبر هستند. مدت گارانتی بسته به نوع محصول بین ۶ تا ۲۴ ماه متغیر است که در صفحه محصول ذکر شده است.'
    },
    {
        id: 11,
        category: 'warranty',
        question: 'در صورت مشکل در کالا چه کنم؟',
        answer: 'با پشتیبانی تماس بگیرید یا از طریق پنل کاربری درخواست خدمات گارانتی ثبت کنید. کارشناسان ما در اسرع وقت مشکل را بررسی و رفع می‌کنند.'
    },
    {
        id: 12,
        category: 'account',
        question: 'چگونه در سایت ثبت‌نام کنم؟',
        answer: 'با کلیک روی گزینه "ورود | ثبت‌نام" در بالای صفحه، شماره موبایل خود را وارد کنید. کد تایید برای شما پیامک می‌شود و حساب شما فعال خواهد شد.'
    },
    {
        id: 13,
        category: 'account',
        question: 'رمز عبور خود را فراموش کرده‌ام. چه کنم؟',
        answer: 'در صفحه ورود، روی "فراموشی رمز عبور" کلیک کنید. لینک بازیابی به ایمیل یا شماره موبایل شما ارسال می‌شود.'
    },
    {
        id: 14,
        category: 'payment',
        question: 'آیا امکان پرداخت اقساطی وجود دارد؟',
        answer: 'بله، برای خریدهای بالای ۵ میلیون تومان امکان پرداخت اقساطی از طریق اسنپ‌پی و ازکی وام فراهم است.'
    },
    {
        id: 15,
        category: 'delivery',
        question: 'آیا ارسال به سراسر کشور انجام می‌شود؟',
        answer: 'بله، ما به تمام نقاط ایران از طریق پست، تیپاکس و پیک موتوری ارسال داریم. همچنین امکان تحویل در محل برای تهران فراهم است.'
    },
];

const FaqItem = ({ faq, isOpen, onToggle }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#002874]/30 dark:hover:border-[#4C6FB6]/30">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-3 sm:p-4 text-right hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
            <span className="text-sm font-medium text-gray-900 dark:text-white pr-2">{faq.question}</span>
            <ChevronDown
                size={18}
                className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#002874]  dark:text-[#4C6FB6]' : ''}`}
            />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                {faq.answer}
            </div>
        </div>
    </div>
);

const FaqComponents = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openItems, setOpenItems] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, []);

    const filteredFaqs = useMemo(() => {
        let faqs = faqData;

        if (activeCategory !== 'all') {
            faqs = faqs.filter(faq => faq.category === activeCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            faqs = faqs.filter(faq =>
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query)
            );
        }

        return faqs;
    }, [activeCategory, searchQuery]);

    const toggleItem = (id) => {
        setOpenItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="container mx-auto px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2 mb-6">
                        <Skeleton width={50} height={16} borderRadius={8} />
                        <Skeleton width={12} height={12} borderRadius="50%" />
                        <Skeleton width={100} height={16} borderRadius={8} />
                    </div>

                    <Skeleton height={200} borderRadius={24} className="mb-6" />

                    <div className="flex flex-wrap gap-2 mb-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} width={100} height={36} borderRadius={12} />
                        ))}
                    </div>

                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#111] rounded-xl border p-4">
                                <Skeleton height={20} borderRadius={8} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">

                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { title: "سوالات متداول", link: "/faq", icon: HelpCircle },
                    ]}
                />

                {/* Hero */}
                <div className="relative mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#4C6FB6] p-6 sm:p-8 lg:p-10 mb-6">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white" />
                    </div>
                    <div className="relative z-10 text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-white/20 mb-4">
                            <HelpCircle size={28} className="text-white" />
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-2">
                            چطور می‌توانیم کمکتان کنیم؟
                        </h1>
                        <p className="text-sm text-white/70 max-w-lg mx-auto mb-4">
                            پاسخ سوالات پرتکرار را اینجا پیدا کنید. اگر سوال دیگری دارید با ما تماس بگیرید.
                        </p>

                        {/* Search */}
                        <div className="relative max-w-md mx-auto">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="سوال خود را جستجو کنید..."
                                className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 text-sm focus:outline-none focus:bg-white/30 transition-all"
                            />
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {faqCategoriesData.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                                activeCategory === cat.id
                                    ? 'bg-[#002874] text-white shadow-lg shadow-[#002874]/30'
                                    : 'bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#002874]/30 dark:hover:border-[#4C6FB6]/30'
                            }`}
                        >
                            <cat.icon size={15} />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Faq List */}
                {filteredFaqs.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3 max-w-3xl mx-auto">
                        {filteredFaqs.map(faq => (
                            <FaqItem
                                key={faq.id}
                                faq={faq}
                                isOpen={openItems.includes(faq.id)}
                                onToggle={() => toggleItem(faq.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800">
                        <Search size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">سوالی با این مشخصات یافت نشد</p>
                    </div>
                )}

                {/* Still Need Help */}
                <div className="mt-8 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center max-w-3xl mx-auto">
                    <MessageCircle size={32} className="text-[#002874]  dark:text-[#4C6FB6] mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        پاسخ سوال خود را پیدا نکردید؟
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        با تیم پشتیبانی ما تماس بگیرید. ما ۲۴ ساعت شبانه‌روز آماده کمک به شما هستیم.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Link
                            to="/contact"
                            className="px-5 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors"
                        >
                            تماس با ما
                        </Link>
                        <a
                            href="tel:02112345678"
                            className="flex items-center gap-1.5 px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <Phone size={16} />
                            ۰۲۱-۱۲۳۴۵۶۷۸
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FaqComponents;