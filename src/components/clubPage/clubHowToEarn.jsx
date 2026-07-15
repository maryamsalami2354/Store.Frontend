// =============================================================================
// FILE: clubHowToEarn.jsx
// =============================================================================
import React from 'react';
import { ShoppingBag, Edit, Share2, Star, Calendar, UserPlus } from 'react-feather';

const methods = [
    { icon: ShoppingBag, title: 'خرید محصولات', points: 'هر ۱۰۰۰ تومان = ۱ امتیاز', color: 'text-blue-500' },
    { icon: Edit, title: 'ثبت نظر', points: 'هر نظر = ۵۰ امتیاز', color: 'text-green-500' },
    { icon: Share2, title: 'اشتراک‌گذاری', points: 'هر اشتراک = ۲۰ امتیاز', color: 'text-purple-500' },
    { icon: Star, title: 'امتیاز مضاعف', points: 'مناسبت‌های خاص ×۲', color: 'text-amber-500' },
    { icon: Calendar, title: 'خرید روز تولد', points: 'امتیاز ×۳', color: 'text-pink-500' },
    { icon: UserPlus, title: 'دعوت دوستان', points: 'هر دعوت = ۵۰۰ امتیاز', color: 'text-indigo-500' },
];

const ClubHowToEarn = () => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">راه‌های کسب امتیاز</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {methods.map((m, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <m.icon size={20} className={m.color} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{m.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{m.points}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ClubHowToEarn;