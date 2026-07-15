// =============================================================================
// FILE: sellerLandingPlans.jsx (اصلاح‌شده - دکمه چسبیده به پایین)
// =============================================================================
import React from 'react';
import { Check } from 'react-feather';

const SellerLandingPlans = ({ plans = [], selectedPlan, onSelect }) => (
    <div className="mb-8">
        <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                پلن‌های فروشندگی
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                پلن مناسب خود را انتخاب کنید
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
                <div
                    key={plan.id}
                    className={`relative bg-white dark:bg-[#111] rounded-2xl border-2 transition-all duration-300 flex flex-col ${
                        plan.popular
                            ? 'border-[#002874] dark:border-[#4C6FB6] shadow-xl shadow-[#002874]/10 scale-105'
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                    }`}
                >
                    {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#002874] dark:bg-[#4C6FB6] text-white text-xs font-bold px-4 py-1 rounded-full">
                            محبوب‌ترین
                        </div>
                    )}

                    {/* محتوای بالایی */}
                    <div className="p-6 text-center flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                        <div className="mb-4">
                            <span className="text-3xl font-extrabold text-[#002874] dark:text-[#4C6FB6]">{plan.price}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400"> / {plan.period}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">کمیسیون {plan.commission}</p>

                        <ul className="space-y-3 text-right">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Check size={16} className="text-green-500 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* دکمه چسبیده به پایین */}
                    <div className="p-6 pt-0">
                        <button
                            onClick={() => onSelect(plan)}
                            className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
                                plan.popular
                                    ? 'bg-[#002874] text-white hover:bg-[#001d5a] '
                                    : 'border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#002874]'
                            }`}
                        >
                            {plan.price === 'رایگان' ? 'شروع رایگان' : 'انتخاب پلن'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default SellerLandingPlans;