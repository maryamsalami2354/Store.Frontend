// src/components/index2/VerticalSlider.jsx
import React, { useRef, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ChevronUp, ChevronDown, Quote, Star, Gift, Zap, Award, TrendingUp, Clock, ShoppingBag, Heart } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const verticalItems = [
    {
        id: 1,
        type: "product",
        title: "گوشی آیفون ۱۵ پرو مکس",
        description: "با ۳۵٪ تخفیف ویژه",
        oldPrice: "55,000,000",
        newPrice: "35,000,000",
        discount: 35,
        image: "/images/products/1.jpg",
        link: "/product/1",
        color: "from-blue-600 to-cyan-600",
        icon: Zap
    },
    {
        id: 2,
        type: "testimonial",
        text: "بهترین تجربه خرید آنلاین رو داشتم. محصولات اصل و ارسال سریع",
        author: "علی محمدی",
        product: "هدفون سونی",
        rating: 5,
        avatar: "/images/users/avatar-1.svg",
        color: "from-purple-600 to-pink-600",
        icon: Quote
    },
    {
        id: 3,
        type: "product",
        title: "ساعت هوشمند گارمین Fenix 7X",
        description: "مناسب ورزش‌های حرفه‌ای",
        oldPrice: "32,000,000",
        newPrice: "28,000,000",
        discount: 12,
        image: "/images/products/45.jpg",
        link: "/product/45",
        color: "from-emerald-600 to-teal-600",
        icon: TrendingUp
    },
    {
        id: 4,
        type: "gift",
        title: "تخفیف ویژه نوروز",
        description: "تا ۵۰٪ تخفیف + ارسال رایگان",
        code: "NORUZ1404",
        discount: 50,
        buttonText: "خرید با تخفیف",
        link: "/offers",
        color: "from-red-600 to-orange-600",
        icon: Gift
    }
];

const VerticalSlider = () => {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), []);
    const handleNext = useCallback(() => swiperRef.current?.slideNext(), []);

    const currentItem = verticalItems[activeIndex];
    const CurrentIcon = currentItem?.icon || Award;

    return (
        <section className="py-3 sm:py-5">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-gray-50 to-purple-50/30 dark:from-[#1a1c20] dark:via-[#20242b] dark:to-[#1a1c20]/50 border border-gray-100 dark:border-gray-800 h-[320px] sm:h-[380px] lg:h-[420px]">
                <div className="relative h-full flex">
                    {/* سمت راست - Swiper عمودی */}
                    <div className="flex-1 relative">
                        <Swiper
                            modules={[Navigation, Autoplay, EffectFade, Pagination]}
                            direction="vertical"
                            effect="fade"
                            loop={true}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            onSwiper={(swiper) => swiperRef.current = swiper}
                            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                            className="h-full [&_.swiper-slide]:!bg-transparent"
                        >
                            {verticalItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <SwiperSlide key={item.id}>
                                        <div className={`h-full bg-gradient-to-br ${item.color} p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden`}>
                                            {/* الگوی پس‌زمینه */}
                                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                                            {item.type === "product" && (
                                                <>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                            <Icon size={20} className="text-white" />
                                                        </div>
                                                        <span className="text-white/80 text-sm font-medium">محصول ویژه</span>
                                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{item.discount}% تخفیف</span>
                                                    </div>
                                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{item.title}</h3>
                                                    <p className="text-white/80 text-sm mb-4">{item.description}</p>
                                                    <div className="flex items-center gap-3 mb-5">
                                                        <span className="text-white line-through text-sm opacity-70">{item.oldPrice}</span>
                                                        <span className="text-white text-2xl font-bold">{item.newPrice}<span className="text-sm">تومان</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button className="px-5 py-2 bg-white rounded-lg text-gray-800 font-medium text-sm hover:bg-white/90 transition flex items-center gap-2">
                                                            <ShoppingBag size={16} />
                                                            خرید کنید
                                                        </button>
                                                        <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition flex items-center gap-2">
                                                            <Heart size={14} />
                                                            علاقه‌مندی
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {item.type === "testimonial" && (
                                                <>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                            <Quote size={20} className="text-white" />
                                                        </div>
                                                        <span className="text-white/80 text-sm font-medium">نظر مشتریان</span>
                                                    </div>
                                                    <p className="text-lg sm:text-xl mb-5 max-w-md leading-relaxed text-white">"{item.text}"</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 border-2 border-white/50">
                                                            <LazyLoadImage src={item.avatar} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white text-base">{item.author}</p>
                                                            <p className="text-white/70 text-sm">{item.product}</p>
                                                            <div className="flex gap-0.5 mt-1">
                                                                {[...Array(item.rating)].map((_, i) => (
                                                                    <Star key={i} size={14} fill="gold" className="text-yellow-400" />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {item.type === "gift" && (
                                                <>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                                                            <Gift size={20} className="text-white" />
                                                        </div>
                                                        <span className="text-white/80 text-sm font-medium">پیشنهاد شگفت‌انگیز</span>
                                                        <span className="bg-yellow-400 text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">{item.discount}% تخفیف</span>
                                                    </div>
                                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{item.title}</h3>
                                                    <p className="text-white/80 text-base mb-4">{item.description}</p>
                                                    <div className="flex items-center gap-3 mb-5">
                                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                                            <span className="text-white font-mono text-lg tracking-wider">{item.code}</span>
                                                        </div>
                                                        <button className="px-5 py-2 bg-white rounded-lg text-gray-800 font-medium text-sm hover:bg-white/90 transition">
                                                            {item.buttonText}
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/70 text-xs">
                                                        <Clock size={12} />
                                                        <span>فرصت محدود - تا پایان فصل</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>

                    {/* سمت چپ - دکمه‌های کنترل + نشانگر */}
                    <div className="w-20 bg-black/30 backdrop-blur-md flex flex-col items-center justify-center gap-4 border-l border-white/10">
                        <button onClick={handlePrev} className="p-2.5 rounded-full bg-white/10 hover:bg-white/30 transition-all duration-300 group">
                            <ChevronUp size={20} className="text-white group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                        <div className="flex flex-col gap-2">
                            {verticalItems.map((_, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => swiperRef.current?.slideToLoop(idx)}
                                    className={`w-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                        idx === activeIndex ? 'bg-white h-6' : 'bg-white/40 h-1.5 hover:bg-white/70'
                                    }`}
                                />
                            ))}
                        </div>
                        <button onClick={handleNext} className="p-2.5 rounded-full bg-white/10 hover:bg-white/30 transition-all duration-300 group">
                            <ChevronDown size={20} className="text-white group-hover:translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VerticalSlider;