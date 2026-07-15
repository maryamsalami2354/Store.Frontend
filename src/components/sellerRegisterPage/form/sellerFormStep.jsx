// =============================================================================
// FILE: sellerFormStep.jsx
// =============================================================================
import React from 'react';
import { Check } from 'react-feather';

const SellerFormStep = ({ current = 1, total = 3, titles = [] }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
        <div className="flex items-center justify-between">
            {titles.map((title, idx) => {
                const step = idx + 1;
                const isCompleted = step < current;
                const isCurrent = step === current;

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-1 flex-1">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isCompleted
                                        ? 'bg-[#002874] dark:bg-[#4C6FB6] text-white'
                                        : isCurrent
                                            ? 'bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874] dark:text-[#4C6FB6] ring-2 ring-[#002874] dark:ring-[#4C6FB6]'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                }`}
                            >
                                {isCompleted ? <Check size={14} /> : step}
                            </div>
                            <span
                                className={`text-[10px] sm:text-xs ${
                                    isCurrent
                                        ? 'text-[#002874] dark:text-[#4C6FB6] font-medium'
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                {title}
              </span>
                        </div>
                        {step < total && (
                            <div className="flex-1 h-0.5 mx-2 mt-[-12px]">
                                <div
                                    className={`h-full rounded-full ${isCompleted ? 'bg-[#002874] dark:bg-[#4C6FB6]' : 'bg-gray-200 dark:bg-gray-700'}`}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </div>
);

export default SellerFormStep;