// =============================================================================
// FILE: shippingProgress.jsx
// =============================================================================
import React from 'react';
import { ShoppingBag, MapPin, CreditCard, Check } from 'react-feather';

const steps = [
    { id: 1, label: 'سبد خرید', icon: ShoppingBag },
    { id: 2, label: 'آدرس و ارسال', icon: MapPin },
    { id: 3, label: 'پرداخت', icon: CreditCard },
];

const ShippingProgress = ({ currentStep = 2 }) => (
    <div className="bg-white dark:bg-[#111] mt-3 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;

                return (
                    <React.Fragment key={step.id}>
                        {/* Step */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                                isCompleted
                                    ? 'bg-[#002874] dark:bg-[#4C6FB6] text-white'
                                    : isCurrent
                                        ? 'bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874] dark:text-[#4C6FB6] ring-2 ring-[#002874] dark:ring-[#4C6FB6]'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                            }`}>
                                {isCompleted ? <Check size={20} /> : <step.icon size={20} />}
                            </div>
                            <span className={`text-[10px] sm:text-xs font-medium ${
                                isCurrent ? 'text-[#002874] dark:text-[#4C6FB6]' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                {step.label}
              </span>
                        </div>

                        {/* Connector Line */}
                        {idx < steps.length - 1 && (
                            <div className="flex-1 h-0.5 mx-2 mt-[-20px]">
                                <div className={`h-full rounded-full transition-all ${
                                    isCompleted ? 'bg-[#002874] dark:bg-[#4C6FB6]' : 'bg-gray-200 dark:bg-gray-700'
                                }`} />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </div>
);

export default ShippingProgress;