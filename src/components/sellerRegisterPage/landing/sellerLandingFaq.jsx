// =============================================================================
// FILE: sellerLandingFaq.jsx
// =============================================================================
import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'react-feather';

const faqs = [
    {
        q: 'چگونه می‌توانم فروشنده شوم؟',
        a: 'کافیست روی دکمه "شروع کنید" کلیک کنید، اطلاعات خود را وارد کنید و پس از تأیید، فروشگاه شما فعال می‌شود.',
    },
    {
        q: 'کمیسیون فروش چقدر است؟',
        a: 'کمیسیون بسته به پلن انتخابی از ۴٪ تا ۱۵٪ متغیر است. پلن‌ها را در بخش مقایسه می‌توانید ببینید.',
    },
    {
        q: 'چه زمانی تسویه حساب انجام می‌شود؟',
        a: 'تسویه حساب به صورت هفتگی انجام می‌شود و مبلغ به حساب بانکی شما واریز می‌گردد.',
    },
    {
        q: 'آیا محدودیتی در تعداد محصولات دارم؟',
        a: 'بله، بسته به پلن انتخابی بین ۳۰ محصول تا نامحدود می‌توانید ثبت کنید.',
    },
    {
        q: 'پشتیبانی به چه صورت است؟',
        a: 'پشتیبانی ۲۴ ساعته از طریق چت زنده، تیکت و تلفن در دسترس است.',
    },
    {
        q: 'مدت زمان تأیید مدارک چقدر است؟',
        a: 'معمولاً بین ۲۴ تا ۴۸ ساعت کاری مدارک شما بررسی و تأیید می‌شود.',
    },
];

const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-right hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
                <span className="text-sm font-medium text-gray-900 dark:text-white pr-2">{faq.q}</span>
                <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40' : 'max-h-0'}`}>
                <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
        </div>
    );
};

const SellerLandingFaq = () => (
    <div className="mb-8">
        <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-[#002874]/10 dark:bg-[#4C6FB6]/20 mb-3">
                <HelpCircle size={28} className="text-[#002874] dark:text-[#4C6FB6]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                سوالات متداول
            </h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
                <FaqItem key={idx} faq={faq} />
            ))}
        </div>
    </div>
);

export default SellerLandingFaq;