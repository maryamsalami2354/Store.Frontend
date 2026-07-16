// =============================================================================
// FILE: clubBenefits.jsx
// =============================================================================
import React from 'react';
import { Gift, TrendingDown, Star, Zap, Shield, Heart } from 'react-feather';

const benefits = [
    { icon: TrendingDown, title: 'تخفیف ویژه', description: 'تا ۲۰٪ تخفیف در خریدهای بعدی', color: 'from-emerald-500 to-green-600' },
    { icon: Gift, title: 'هدیه تولد', description: 'امتیاز هدیه در روز تولد شما', color: 'from-pink-500 to-rose-600' },
    { icon: Star, title: 'امتیاز مضاعف', description: 'در مناسبت‌های خاص امتیاز دوبرابر', color: 'from-amber-500 to-orange-600' },
    { icon: Zap, title: 'ارسال سریع', description: 'اولویت در پردازش و ارسال سفارشات', color: 'from-blue-500 to-blue-600' },
    { icon: Shield, title: 'پشتیبانی VIP', description: 'پاسخگویی در کمتر از ۱ ساعت', color: 'from-purple-500 to-violet-600' },
    { icon: Heart, title: 'دعوت به ایونت‌ها', description: 'شرکت در رویدادهای ویژه کیان شاپ', color: 'from-red-500 to-pink-600' },
];

const ClubBenefits = () => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">مزایای عضویت</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 hover:shadow-md transition-all group">
                    <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${b.color} text-white mb-3 group-hover:scale-110 transition-transform`}>
                        <b.icon size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{b.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{b.description}</p>
                </div>
            ))}
        </div>
    </div>
);

export default ClubBenefits;