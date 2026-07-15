// =============================================================================
// FILE: clubFaq.jsx
// =============================================================================
import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'react-feather';

const faqs = [
    { q: 'امتیازات چقدر اعتبار دارند؟', a: 'امتیازات تا پایان سال شمسی معتبر هستند و در صورت عدم استفاده صفر می‌شوند.' },
    { q: 'چطور می‌توانم سطح خود را ارتقا دهم؟', a: 'با جمع‌آوری امتیاز بیشتر، سطح شما به‌طور خودکار ارتقا می‌یابد.' },
    { q: 'آیا می‌توانم امتیازات را به دیگران انتقال دهم؟', a: 'خیر، امتیازات قابل انتقال به کاربر دیگر نیستند.' },
    { q: 'امتیاز مضاعف چه روزهایی فعال است؟', a: 'در روز تولد شما و مناسبت‌های خاص مانند بلک فرایدی.' },
];

const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-3 text-right hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <span className="text-sm font-medium text-gray-900 dark:text-white pr-2">{faq.q}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-24' : 'max-h-0'}`}>
                <p className="px-3 pb-3 text-xs text-gray-500">{faq.a}</p>
            </div>
        </div>
    );
};

const ClubFaq = () => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <HelpCircle size={16} className="text-[#002874] dark:text-[#4C6FB6]" />
            سوالات متداول
        </h3>
        <div className="space-y-2">
            {faqs.map((faq, idx) => <FaqItem key={idx} faq={faq} />)}
        </div>
    </div>
);

export default ClubFaq;