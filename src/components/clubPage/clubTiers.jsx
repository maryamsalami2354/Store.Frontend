// =============================================================================
// FILE: clubTiers.jsx
// =============================================================================
import React from 'react';
import { Check } from 'react-feather';

const allTiers = [
    {
        id: 'silver', name: 'نقره‌ای', icon: '🥈', color: 'from-gray-300 to-gray-400',
        textColor: 'text-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-900/50', borderColor: 'border-gray-300',
        minPoints: 0, features: [true, true, true, false, false, false, false],
    },
    {
        id: 'gold', name: 'طلایی', icon: '🥇', color: 'from-yellow-400 to-amber-500',
        textColor: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20', borderColor: 'border-amber-300',
        minPoints: 20000, features: [true, true, true, true, true, false, false],
    },
    {
        id: 'platinum', name: 'پلاتینیوم', icon: '💎', color: 'from-purple-400 to-indigo-500',
        textColor: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-300',
        minPoints: 50000, features: [true, true, true, true, true, true, true],
    },
];

const labels = ['تخفیف', 'ارسال رایگان', 'هدیه تولد', 'اولویت ارسال', 'پشتیبانی VIP', 'باشگاه اختصاصی', 'ایونت‌ها'];

const ClubTiers = ({ currentTier = null }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">سطح‌های عضویت</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allTiers.map(tier => {
                const isCurrent = currentTier === tier.id;
                return (
                    <div key={tier.id} className={`rounded-2xl border-2 p-5 text-center transition-all ${tier.borderColor} ${tier.bgColor}`}>
                        <span className="text-4xl">{tier.icon}</span>
                        <h3 className={`text-lg font-extrabold mt-2 ${tier.textColor}`}>{tier.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">از {tier.minPoints.toLocaleString('fa-IR')} امتیاز</p>
                        <div className="space-y-2 mt-4 text-right">
                            {labels.map((label, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    {tier.features[idx] ? (
                                        <Check size={16} className="text-green-500 flex-shrink-0" />
                                    ) : (
                                        <span className="w-4 flex-shrink-0" />
                                    )}
                                    <span className={tier.features[idx] ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600 line-through'}>
                    {label}
                  </span>
                                </div>
                            ))}
                        </div>
                        {isCurrent && (
                            <div className="mt-4 bg-[#002874] dark:bg-[#4C6FB6] text-white py-2 rounded-xl text-xs font-bold">
                                سطح فعلی شما
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
);

export default ClubTiers;