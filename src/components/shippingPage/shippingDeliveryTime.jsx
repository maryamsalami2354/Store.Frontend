// =============================================================================
// FILE: shippingDeliveryTime.jsx
// =============================================================================
import React from 'react';
import { Clock, Sun, Moon } from 'react-feather';

const timeOptions = [
    { value: 'morning', label: 'صبح (۹ تا ۱۲)', icon: Sun, color: 'from-amber-500 to-orange-500' },
    { value: 'afternoon', label: 'عصر (۱۵ تا ۱۸)', icon: Moon, color: 'from-blue-500 to-indigo-600' },
    { value: 'evening', label: 'غروب (۱۸ تا ۲۱)', icon: Clock, color: 'from-purple-500 to-violet-600' },
];

const ShippingDeliveryTime = ({ value, onChange }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
            زمان ارسال
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {timeOptions.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        value === opt.value
                            ? 'border-[#002874] dark:border-[#4C6FB6] bg-[#002874]/5 dark:bg-[#4C6FB6]/10'
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${opt.color} text-white`}>
                        <opt.icon size={18} />
                    </div>
                    <span className={`text-sm font-medium ${value === opt.value ? 'text-[#002874] dark:text-[#4C6FB6]' : 'text-gray-700 dark:text-gray-300'}`}>
            {opt.label}
          </span>
                </button>
            ))}
        </div>
    </div>
);

export default ShippingDeliveryTime;