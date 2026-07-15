// =============================================================================
// FILE: returnPolicyContact.jsx
// =============================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, ArrowLeft } from 'react-feather';

const ReturnPolicyContact = () => (
    <div className="bg-[#002874] rounded-2xl p-6 sm:p-8 text-center">
        <MessageSquare size={32} className="text-white mx-auto mb-3" />
        <h3 className="text-xl font-extrabold text-white mb-2">سوالی دارید؟</h3>
        <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
            اگر سوال شما در این صفحه پاسخ داده نشد، با پشتیبانی تماس بگیرید یا تیکت ثبت کنید.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/user/tickets" className="px-6 py-3 bg-white text-[#002874] dark:text-[#4C6FB6] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                ثبت تیکت
                <ArrowLeft size={16} />
            </Link>
            <a href="tel:02112345678" className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl font-medium text-sm hover:bg-white/30 transition-colors">
                <Phone size={16} />
                ۰۲۱-۱۲۳۴۵۶۷۸
            </a>
        </div>
    </div>
);

export default ReturnPolicyContact;