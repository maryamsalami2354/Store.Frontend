// =============================================================================
// FILE: clubRewards.jsx
// =============================================================================
import React from 'react';
import { Gift, Tag, Heart, Zap } from 'react-feather';
import { toast } from 'react-toastify';

const rewards = [
    { id: 1, icon: Tag, title: 'کد تخفیف ۱۰٪', points: 500, color: 'from-blue-500 to-blue-600' },
    { id: 2, icon: Gift, title: 'ارسال رایگان', points: 1000, color: 'from-green-500 to-green-600' },
    { id: 3, icon: Zap, title: 'کد تخفیف ۲۵٪', points: 2000, color: 'from-purple-500 to-purple-600' },
    { id: 4, icon: Heart, title: 'هدیه ویژه', points: 5000, color: 'from-pink-500 to-rose-600' },
];

const ClubRewards = () => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4">جوایز باشگاه</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {rewards.map(r => (
                <div key={r.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 text-center">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${r.color} text-white mb-3`}>
                        <r.icon size={22} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{r.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{r.points.toLocaleString('fa-IR')} امتیاز</p>
                    <button
                        onClick={() => toast.success('درخواست دریافت جایزه ثبت شد')}
                        className="w-full py-2 bg-[#002874] text-white rounded-lg text-xs font-medium hover:bg-[#001d5a] transition-colors"
                    >
                        دریافت
                    </button>
                </div>
            ))}
        </div>
    </div>
);

export default ClubRewards;