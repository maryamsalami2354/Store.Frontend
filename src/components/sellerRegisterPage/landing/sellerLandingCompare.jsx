// =============================================================================
// FILE: sellerLandingCompare.jsx
// =============================================================================
import React from 'react';
import { Check, X } from 'react-feather';

const allFeatures = [
    { key: 'panel', label: 'پنل فروشنده' },
    { key: 'products', label: 'محصولات' },
    { key: 'support', label: 'پشتیبانی' },
    { key: 'reports', label: 'گزارشات' },
    { key: 'discount', label: 'تخفیف‌های ویژه' },
    { key: 'priority', label: 'الویت در جستجو' },
    { key: 'api', label: 'API اختصاصی' },
    { key: 'manager', label: 'مدیر حساب' },
    { key: 'vip', label: 'تخفیف‌های VIP' },
    { key: 'banner', label: 'بنر تبلیغاتی' },
];

const featureMap = {
    basic: ['panel', 'products', 'support', 'reports'],
    pro: ['panel', 'products', 'support', 'reports', 'discount', 'priority'],
    enterprise: ['panel', 'products', 'support', 'reports', 'discount', 'priority', 'api', 'manager', 'vip', 'banner'],
};

const productLabels = { basic: '۳۰ عدد', pro: '۲۰۰ عدد', enterprise: 'نامحدود' };
const supportLabels = { basic: 'تیکت', pro: 'چت زنده', enterprise: 'اختصاصی ۲۴/۷' };
const reportLabels = { basic: 'پایه', pro: 'تحلیلی', enterprise: 'هوش تجاری' };

const SellerLandingCompare = ({ plans = [] }) => (
    <div className="mb-8">
        <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                مقایسه پلن‌ها
            </h2>
        </div>

        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-right p-4 font-bold text-gray-900 dark:text-white">ویژگی</th>
                    {plans.map(p => (
                        <th key={p.id} className="text-center p-4 font-bold text-gray-900 dark:text-white">{p.name}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {allFeatures.map(feature => (
                    <tr key={feature.key}>
                        <td className="p-4 text-gray-700 dark:text-gray-300">{feature.label}</td>
                        {plans.map(plan => {
                            const hasFeature = featureMap[plan.id]?.includes(feature.key);
                            if (feature.key === 'products') {
                                return <td key={plan.id} className="text-center p-4 text-xs text-gray-600 dark:text-gray-400">{productLabels[plan.id]}</td>;
                            }
                            if (feature.key === 'support') {
                                return <td key={plan.id} className="text-center p-4 text-xs text-gray-600 dark:text-gray-400">{supportLabels[plan.id]}</td>;
                            }
                            if (feature.key === 'reports') {
                                return <td key={plan.id} className="text-center p-4 text-xs text-gray-600 dark:text-gray-400">{reportLabels[plan.id]}</td>;
                            }
                            return (
                                <td key={plan.id} className="text-center p-4">
                                    {hasFeature ? <Check size={18} className="text-green-500 mx-auto" /> : <X size={18} className="text-red-400 mx-auto" />}
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default SellerLandingCompare;