// =============================================================================
// FILE: returnPolicyFaq.jsx
// =============================================================================
import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'react-feather';

const faqs = [
    { q: 'چقدر طول می‌کشد تا وجه بازگردانده شود؟', a: 'حداکثر ۷۲ ساعت کاری پس از تأیید کارشناس.' },
    { q: 'آیا می‌توانم به جای بازگشت، کالا را تعویض کنم؟', a: 'بله، می‌توانید درخواست تعویض با کالای مشابه یا مدل دیگر دهید.' },
    { q: 'کالای آسیب‌دیده را چگونه برگردانم؟', a: 'از کالا عکس بگیرید و از طریق پنل کاربری یا پشتیبانی ثبت کنید.' },
    { q: 'آیا هزینه ارسال برگشت رایگان است؟', a: 'فقط در صورتی که کالا مشکل فنی داشته باشد. در غیر این صورت با مشتری است.' },
];

const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-right hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <span className="text-sm font-medium text-gray-900 dark:text-white pr-2">{faq.q}</span>
                <ChevronDown size={16} className={`flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-32' : 'max-h-0'}`}>
                <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
            </div>
        </div>
    );
};

const ReturnPolicyFaq = () => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
            سوالات متداول
        </h3>
        <div className="space-y-2">
            {faqs.map((faq, idx) => <FaqItem key={idx} faq={faq} />)}
        </div>
    </div>
);

export default ReturnPolicyFaq;