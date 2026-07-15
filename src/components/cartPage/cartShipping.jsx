import React from 'react';
import { Truck, Clock } from 'react-feather';

const formatCost = (cost) => {
    const value = Number(cost || 0);
    return value > 0 ? `${value.toLocaleString('fa-IR')} تومان` : 'رایگان';
};

const formatEstimate = (days) => {
    const value = Number(days || 0);
    if (value <= 0) return 'تحویل حضوری';
    return `${value.toLocaleString('fa-IR')} روز کاری`;
};

const CartShipping = ({ selected, onSelect, options = [], isLoading = false }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
            <Truck size={16} className="text-[#002874] dark:text-[#4C6FB6]" />
            روش ارسال
        </h3>

        {isLoading ? (
            <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
                ))}
            </div>
        ) : (
            <div className="space-y-2">
                {options.map((option) => {
                    const code = option.code || option.value;
                    const title = option.title || option.label;

                    return (
                        <button
                            key={code}
                            type="button"
                            onClick={() => onSelect(code)}
                            className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                                selected === code
                                    ? 'border-[#002874] dark:border-[#4C6FB6] bg-[#002874]/5 dark:bg-[#4C6FB6]/10'
                                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                            }`}
                        >
                            <div className="text-right min-w-0">
                                <p className={`text-sm font-medium ${selected === code ? 'text-[#002874] dark:text-[#4C6FB6]' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                    {option.description}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                    <Clock size={10} />
                                    {formatEstimate(option.estimatedDays)}
                                </p>
                            </div>

                            <span className={`text-xs font-medium whitespace-nowrap ${selected === code ? 'text-[#002874] dark:text-[#4C6FB6]' : 'text-gray-500 dark:text-gray-400'}`}>
                                {formatCost(option.cost)}
                            </span>
                        </button>
                    );
                })}
            </div>
        )}
    </div>
);

export default CartShipping;
