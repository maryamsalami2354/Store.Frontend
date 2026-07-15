// =============================================================================
// FILE: TermsAndConditionsComponents.jsx (اصلاح‌شده - هیرو اضافه شد)
// =============================================================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Shield, FileText, AlertCircle,
    CreditCard, Truck, RotateCcw, User, Lock, Phone, ChevronLeft, Award
} from 'react-feather';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Breadcrumb } from "../../utils/helpers/breadcrumb.js";

const termsSections = [
    {
        id: 1,
        icon: Shield,
        title: 'حریم خصوصی و امنیت اطلاعات',
        color: 'from-blue-500 to-blue-600',
        content: [
            'تمامی اطلاعات شخصی کاربران نزد فروشگاه شاپ مارکت محفوظ بوده و به هیچ عنوان در اختیار شخص یا سازمان ثالث قرار نمی‌گیرد.',
            'اطلاعات بانکی و پرداخت کاربران مستقیماً از طریق درگاه بانکی معتبر و با پروتکل SSL رمزنگاری شده انجام می‌شود و هیچ‌گونه اطلاعات بانکی در سرورهای شاپ مارکت ذخیره نمی‌شود.',
            'شاپ مارکت متعهد می‌شود از اطلاعات ثبت‌نامی کاربران (نام، شماره تماس، آدرس) فقط برای ارسال سفارشات و اطلاع‌رسانی استفاده کند.',
            'کاربران می‌توانند در هر زمان از طریق پنل کاربری، اطلاعات شخصی خود را ویرایش یا حذف کنند.',
            'در صورت بروز هرگونه مشکل امنیتی، تیم فنی شاپ مارکت در کمتر از ۲۴ ساعت اقدام به رفع آن می‌نماید.',
        ]
    },
    {
        id: 2,
        icon: User,
        title: 'شرایط ثبت‌نام و حساب کاربری',
        color: 'from-green-500 to-green-600',
        content: [
            'کاربران برای ثبت سفارش باید اطلاعات هویتی صحیح و کامل (نام، شماره موبایل، آدرس) را وارد کنند.',
            'هر شخص حقیقی یا حقوقی تنها مجاز به ایجاد یک حساب کاربری است. ایجاد حساب‌های متعدد تخلف محسوب می‌شود.',
            'مسئولیت حفظ و نگهداری از رمز عبور بر عهده کاربر بوده و شاپ مارکت هیچ‌گونه مسئولیتی در قبال سوءاستفاده احتمالی ندارد.',
            'کاربران موظفند در صورت مشاهده هرگونه استفاده غیرمجاز از حساب خود، بلافاصله موضوع را به پشتیبانی اطلاع دهند.',
            'شاپ مارکت این حق را دارد در صورت تخلف کاربر، حساب وی را مسدود یا معلق کند.',
            'کاربران زیر ۱۸ سال باید با نظارت والدین یا قیم قانونی اقدام به خرید کنند.',
        ]
    },
    {
        id: 3,
        icon: CreditCard,
        title: 'شرایط پرداخت و قیمت‌گذاری',
        color: 'from-purple-500 to-purple-600',
        content: [
            'کلیه قیمت‌های درج شده در سایت به تومان بوده و شامل مالیات بر ارزش افزوده می‌باشد.',
            'قیمت محصولات ممکن است بدون اطلاع قبلی تغییر کند. قیمت نهایی، قیمت درج شده در لحظه ثبت سفارش است.',
            'پرداخت هزینه سفارش از طریق درگاه بانکی معتبر، کارت به کارت و کیف پول شاپ مارکت امکان‌پذیر است.',
            'در صورت انصراف از خرید، وجه پرداختی حداکثر تا ۷۲ ساعت کاری به حساب کاربر عودت داده می‌شود.',
            'برای خریدهای بالای ۵ میلیون تومان امکان پرداخت اقساطی (با اعتبارسنجی) فراهم است.',
            'در صورت بروز خطا در قیمت‌گذاری، شاپ مارکت این حق را دارد که سفارش را لغو و وجه را عودت دهد.',
        ]
    },
    {
        id: 4,
        icon: Truck,
        title: 'شرایط ارسال و تحویل سفارش',
        color: 'from-orange-500 to-orange-600',
        content: [
            'سفارشات تهران طی ۱ تا ۲ روز کاری و سفارشات شهرستان طی ۳ تا ۵ روز کاری از طریق پست، تیپاکس یا پیک ارسال می‌شوند.',
            'هزینه ارسال برای سفارشات بالای ۵۰۰ هزار تومان رایگان و برای سفارشات کمتر، بر اساس وزن و مقصد محاسبه می‌شود.',
            'زمان ارسال سفارش از لحظه‌ای محاسبه می‌شود که سفارش در انبار پردازش و بسته‌بندی شده باشد.',
            'کاربر موظف است در زمان تحویل، بسته را از نظر ظاهری بررسی کرده و در صورت آسیب، از تحویل خودداری و موضوع را ثبت کند.',
            'شاپ مارکت امکان ارسال به سراسر ایران را فراهم کرده است. ارسال به کشورهای دیگر امکان‌پذیر نیست.',
            'در صورت بروز تاخیر بیش از ۷ روز، کاربر می‌تواند با هماهنگی پشتیبانی سفارش را لغو کند.',
        ]
    },
    {
        id: 5,
        icon: RotateCcw,
        title: 'شرایط بازگشت و مرجوعی کالا',
        color: 'from-red-500 to-red-600',
        content: [
            'کاربران تا ۷ روز پس از دریافت کالا فرصت دارند در صورت انصراف یا وجود ایراد، کالا را مرجوع کنند.',
            'کالای مرجوعی باید در بسته‌بندی اصلی، سالم و بدون آسیب فیزیکی باشد. برچسب‌ها و پلمپ‌ها نباید مخدوش شده باشند.',
            'هزینه ارسال برگشت در صورت وجود ایراد فنی با فروشگاه و در صورت انصراف از خرید با مشتری است.',
            'کالاهای بهداشتی، مواد مصرفی، نرم‌افزارها و محصولات دانلودی شامل گارانتی بازگشت نمی‌شوند.',
            'وجه پرداختی پس از تایید سلامت کالا توسط کارشناسان شاپ مارکت، حداکثر تا ۷۲ ساعت به حساب کاربر عودت داده می‌شود.',
            'در صورت تعویض کالا، ارسال کالای جدید برای مشتری رایگان خواهد بود.',
        ]
    },
    {
        id: 6,
        icon: AlertCircle,
        title: 'مسئولیت‌ها و محدودیت‌ها',
        color: 'from-yellow-500 to-yellow-600',
        content: [
            'شاپ مارکت به عنوان فروشگاه اینترنتی، مسئولیت صحت اطلاعات فنی محصولات را می‌پذیرد.',
            'تصاویر محصولات صرفاً جهت اطلاع‌رسانی بوده و ممکن است با محصول اصلی تفاوت‌های جزئی داشته باشد.',
            'شاپ مارکت در قبال خسارات ناشی از استفاده نادرست از محصول مسئولیتی ندارد.',
            'در صورت بروز فورس ماژور (بلایای طبیعی، جنگ و...) شاپ مارکت از تعهدات زمانی خود مبرا خواهد بود.',
            'شاپ مارکت این حق را دارد که در هر زمان قوانین را بدون اطلاع قبلی به‌روزرسانی کند.',
            'کلیه محتوای سایت متعلق به شاپ مارکت بوده و کپی‌برداری از آن پیگرد قانونی دارد.',
        ]
    },
    {
        id: 7,
        icon: Lock,
        title: 'حقوق معنوی و مالکیت فکری',
        color: 'from-indigo-500 to-indigo-600',
        content: [
            'تمامی محتوا، طراحی، لوگو و نرم‌افزارهای این وب‌سایت متعلق به شاپ مارکت بوده و تحت حمایت قوانین مالکیت فکری است.',
            'هرگونه کپی‌برداری، بازنشر یا استفاده تجاری از محتوای سایت بدون مجوز کتبی ممنوع است.',
            'برندها و لوگوهای محصولات متعلق به شرکت‌های تولیدکننده بوده و صرفاً جهت معرفی استفاده شده‌اند.',
            'کاربران با ثبت نظرات در سایت، به شاپ مارکت حق استفاده و نمایش آن را می‌دهند.',
        ]
    },
    {
        id: 8,
        icon: Phone,
        title: 'پشتیبانی و ارتباط با مشتریان',
        color: 'from-teal-500 to-teal-600',
        content: [
            'پشتیبانی شاپ مارکت همه روزه از ساعت ۹ صبح تا ۹ شب پاسخگوی مشتریان است.',
            'از طریق ایمیل support@shopmarket.ir و بخش "تماس با ما" در سایت با ما در ارتباط باشید.',
            'میانگین زمان پاسخگویی به سوالات کمتر از ۲ ساعت در ساعات کاری است.',
            'در صورت نارضایتی، شکایت خود را از طریق ایمیل complaints@shopmarket.ir ثبت کنید.',
            'نظرات و پیشنهادات شما به ما در بهبود خدمات کمک می‌کند.',
        ]
    },
];

const TermsAndConditionsComponents = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, []);

    const toggleSection = (id) => {
        setActiveSection(activeSection === id ? null : id);
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
                    <Skeleton height={160} borderRadius={24} className="mb-6" />
                    <div className="space-y-3 max-w-4xl">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <Skeleton circle width={40} height={40} />
                                    <Skeleton width={200} height={20} borderRadius={8} />
                                </div>
                                <Skeleton count={3} height={14} borderRadius={4} className="mb-1" />
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

                <Breadcrumb
                    items={[
                        { title: "قوانین و مقررات", link: "/terms", icon: FileText },
                    ]}
                />

                {/* Hero Section */}
                <div className="relative mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#1a1a5e] p-6 sm:p-8 lg:p-10 mb-6">
                    <div className="absolute inset-0 opacity-[0.07]">
                        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border-[12px] border-white" />
                        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[12px] border-white" />
                    </div>
                    <div className="relative z-10 text-center">
                        <div className="inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur mb-4">
                            <Award size={36} className="text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
                            قوانین و <span className="text-amber-400">مقررات</span>
                        </h1>
                        <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
                            لطفاً قبل از ثبت‌نام و خرید، قوانین و مقررات را به دقت مطالعه فرمایید.
                            استفاده از خدمات فروشگاه اینترنتی شاپ مارکت به معنی پذیرش کامل این قوانین است.
                        </p>
                    </div>
                </div>

                {/* Full Width Terms Sections */}
                <div className="max-w-4xl mx-auto space-y-3 lg:space-y-4">
                    {termsSections.map(section => (
                        <div
                            key={section.id}
                            className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full flex items-center justify-between p-4 sm:p-5 text-right hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className={`flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-gradient-to-br ${section.color} text-white`}>
                                        <section.icon size={18} className="sm:size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                                            {section.id}. {section.title}
                                        </h2>
                                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {section.content.length} بند
                                        </p>
                                    </div>
                                </div>
                                <ChevronLeft
                                    size={18}
                                    className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                                        activeSection === section.id ? 'rotate-[-90deg]' : ''
                                    }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    activeSection === section.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100 dark:border-gray-800">
                                    <ul className="space-y-3 pt-4">
                                        {section.content.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874] dark:text-[#4C6FB6] text-xs font-bold flex items-center justify-center mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {item}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Last Update */}
                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    آخرین به‌روزرسانی: <span className="font-medium text-gray-700 dark:text-gray-300">۱۵ فروردین ۱۴۰۴</span>
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    در صورت داشتن هرگونه سوال درباره قوانین، با ما تماس بگیرید.
                                </p>
                            </div>
                            <Link
                                to="/contact"
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors flex-shrink-0"
                            >
                                <Phone size={16} />
                                تماس با پشتیبانی
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TermsAndConditionsComponents;