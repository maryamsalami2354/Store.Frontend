// =============================================================================
// FILE: returnPolicySidebar.jsx
// =============================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, HelpCircle, Phone, Shield, Truck } from 'react-feather';

const links = [
    { icon: Shield, label: 'گارانتی محصولات', to: '/guarantee' },
    { icon: HelpCircle, label: 'سوالات متداول', to: '/faq' },
    { icon: Phone, label: 'تماس با ما', to: '/contact' },
    { icon: FileText, label: 'قوانین و مقررات', to: '/terms' },
];

const ReturnPolicySidebar = () => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white">اطلاعات بیشتر</h3>
        <div className="space-y-1.5">
            {links.map((link, idx) => (
                <Link
                    key={idx}
                    to={link.to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors text-sm"
                >
                    <link.icon size={16} />
                    <span>{link.label}</span>
                </Link>
            ))}
        </div>

        {/* Need Help Card */}
        <div className="bg-gradient-to-br from-[#002874] to-[#4C6FB6] rounded-xl p-4 text-white">
            <Shield size={24} className="mb-2" />
            <p className="text-sm font-bold mb-1">نیاز به راهنمایی دارید؟</p>
            <p className="text-xs text-white/70 mb-3">کارشناسان ما آماده کمک به شما هستند.</p>
            <a href="tel:02112345678" className="text-sm font-bold hover:underline">۰۲۱-۱۲۳۴۵۶۷۸</a>
        </div>
    </div>
);

export default ReturnPolicySidebar;