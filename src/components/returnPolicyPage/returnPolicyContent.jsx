// =============================================================================
// FILE: returnPolicyContent.jsx
// =============================================================================
import React from 'react';
import { Check, X, AlertCircle } from 'react-feather';

const sections = [
    {
        title: 'شرایط کلی بازگشت کالا',
        icon: Check,
        color: 'text-green-600 dark:text-green-400',
        items: [
            'مهلت بازگشت کالا ۷ روز کاری از تاریخ دریافت است.',
            'کالا باید در بسته‌بندی اصلی و سالم باشد.',
            'برچسب‌ها و پلمپ‌های کالا نباید مخدوش شده باشند.',
            'کالاهای بهداشتی و مصرفی شامل بازگشت نمی‌شوند.',
            'کالاهایی که آسیب فیزیکی دیده باشند پذیرفته نمی‌شوند.',
        ],
    },
    {
        title: 'مواردی که شامل بازگشت نمی‌شوند',
        icon: X,
        color: 'text-red-600 dark:text-red-400',
        items: [
            'محصولات دانلودی و نرم‌افزاری',
            'کالاهای شخصی‌سازی شده',
            'مواد غذایی و آشامیدنی',
            'محصولات بهداشتی و مراقبت شخصی',
            'گل و گیاهان طبیعی',
            'کارت‌های هدیه و کدهای تخفیف',
        ],
    },
    {
        title: 'نکات مهم',
        icon: AlertCircle,
        color: 'text-amber-600 dark:text-amber-400',
        items: [
            'هزینه ارسال برگشت در صورت انصراف از خرید با مشتری است.',
            'در صورت وجود ایراد فنی، هزینه ارسال با فروشگاه می‌باشد.',
            'وجه پرداختی حداکثر ۷۲ ساعت پس از تأیید کارشناس عودت می‌شود.',
            'حتماً از کالای برگشتی عکس تهیه کنید.',
            'کد پیگیری مرجوعی را نزد خود نگه دارید.',
        ],
    },
];

const ReturnPolicyContent = () => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 space-y-6">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#002874] dark:bg-[#4C6FB6] rounded-full"></span>
            شرایط و ضوابط
        </h2>

        {sections.map((section, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5">
                <h3 className={`font-bold text-base flex items-center gap-2 mb-4 ${section.color}`}>
                    <div className={`p-1.5 rounded-lg ${section.color.replace('text', 'bg').replace('400', '100').replace('600', '100').replace('dark:', 'dark:bg-').replace('400', '900/30').replace('600', '900/30')}`}>
                        <section.icon size={18} />
                    </div>
                    {section.title}
                </h3>
                <ul className="space-y-3">
                    {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874] dark:text-[#4C6FB6] text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
);

export default ReturnPolicyContent;