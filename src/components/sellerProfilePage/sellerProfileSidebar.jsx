// =============================================================================
// FILE: sellerProfileSidebar.jsx
// =============================================================================
import React from 'react';
import { Phone, Mail, MapPin, Clock, Shield, MessageSquare, Award } from 'react-feather';

const SellerProfileSidebar = ({ seller }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white">اطلاعات فروشنده</h3>

        <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Phone size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">تلفن</p>
                    <p className="font-medium text-gray-900 dark:text-white dir-ltr text-right">{seller.phone}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <Mail size={16} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">ایمیل</p>
                    <p className="font-medium text-gray-900 dark:text-white dir-ltr text-right">{seller.email}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <MapPin size={16} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">موقعیت</p>
                    <p className="font-medium text-gray-900 dark:text-white">{seller.city}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <Clock size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">زمان پاسخگویی</p>
                    <p className="font-medium text-gray-900 dark:text-white">{seller.responseTime}</p>
                </div>
            </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">نرخ پاسخگویی</span>
                <span className="font-bold text-[#002874] dark:text-[#4C6FB6]">{seller.responseRate}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">تعداد محصولات</span>
                <span className="font-bold text-[#002874] dark:text-[#4C6FB6]">{seller.totalProducts}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">عضویت</span>
                <span className="font-bold text-gray-900 dark:text-white">{seller.joinedDate}</span>
            </div>
        </div>

        <button className="w-full py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors flex items-center justify-center gap-2">
            <MessageSquare size={16} />
            ارتباط با فروشنده
        </button>
    </div>
);

export default SellerProfileSidebar;