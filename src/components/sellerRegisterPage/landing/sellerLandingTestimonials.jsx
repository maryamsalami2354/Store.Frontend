// =============================================================================
// FILE: sellerLandingTestimonials.jsx
// =============================================================================
import React from 'react';
import { Star } from 'react-feather';

const testimonials = [
    {
        id: 1,
        name: 'سارا محمدی',
        shop: 'فروشگاه مد و پوشاک سارا',
        text: 'از وقتی به شاپ مارکت پیوستم، فروشم ۳ برابر شده. پنل ساده و کمیسیون منصفانه واقعاً عالیه.',
        avatar: null,
        rating: 5,
    },
    {
        id: 2,
        name: 'علی رضایی',
        shop: 'دیجی گجت',
        text: 'پشتیبانی بی‌نظیرشون واقعاً من رو شگفت‌زده کرد. هر مشکلی داشتم در کمتر از ۱ ساعت حل شد.',
        avatar: null,
        rating: 5,
    },
    {
        id: 3,
        name: 'مریم حسینی',
        shop: 'عطر و ادکلن مریم',
        text: 'داشبورد تحلیلی شاپ مارکت بهم کمک کرد رفتار مشتریام رو بهتر بفهمم و فروشمو بهینه کنم.',
        avatar: null,
        rating: 4,
    },
    {
        id: 4,
        name: 'رضا کریمی',
        shop: 'تکنوکالا',
        text: 'بهترین تصمیم کاری من پیوستن به شاپ مارکت بود. لجستیک و انبارداری رو کامل بهشون سپردم.',
        avatar: null,
        rating: 5,
    },
];

const SellerLandingTestimonials = () => (
    <div className="mb-8">
        <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                فروشندگان موفق چه می‌گویند؟
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                تجربه واقعی فروشندگان شاپ مارکت
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testimonials.map((t) => (
                <div
                    key={t.id}
                    className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#002874]/10 dark:bg-[#4C6FB6]/20 flex items-center justify-center text-[#002874] dark:text-[#4C6FB6] font-bold text-sm">
                            {t.name[0]}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{t.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t.shop}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        "{t.text}"
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default SellerLandingTestimonials;