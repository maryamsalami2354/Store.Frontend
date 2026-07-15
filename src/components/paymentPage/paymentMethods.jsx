// =============================================================================
// FILE: paymentMethods.jsx
// =============================================================================
import React from 'react';
import { CreditCard, Archive, Shield, Check } from 'react-feather';

const methods = [
    {
        id: 'gateway',
        title: 'درگاه بانکی',
        description: 'پرداخت از طریق کارت‌های شتاب',
        icon: CreditCard,
        cards: ['visa', 'mastercard', 'shaba'],
    },
    {
        id: 'Wallet',
        title: 'کیف پول شاپ مارکت',
        description: 'پرداخت از موجودی کیف پول',
        icon: Archive,
    },
];

const PaymentMethods = ({ selected, onSelect }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
            روش پرداخت
        </h3>
        <div className="space-y-3">
            {methods.map(method => (
                <button
                    key={method.id}
                    onClick={() => onSelect(method.id)}
                    className={`w-full text-right p-4 rounded-xl border transition-all ${
                        selected === method.id
                            ? 'border-[#002874] dark:border-[#4C6FB6] bg-[#002874]/5 dark:bg-[#4C6FB6]/10'
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                >
                    <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${selected === method.id ? 'bg-[#002874] dark:bg-[#4C6FB6] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                            <method.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <p className={`font-medium ${selected === method.id ? 'text-[#002874] dark:text-[#4C6FB6]' : 'text-gray-900 dark:text-white'}`}>
                                {method.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{method.description}</p>
                            {method.cards && (
                                <div className="flex items-center gap-1.5 mt-2">
                                    {method.cards.map(card => (
                                        <span key={card} className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400">
                      {card}
                    </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        {selected === method.id && (
                            <div className="w-6 h-6 rounded-full bg-[#002874] dark:bg-[#4C6FB6] flex items-center justify-center flex-shrink-0">
                                <Check size={14} className="text-white" />
                            </div>
                        )}
                    </div>
                </button>
            ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500 mt-3">
            <Shield size={12} className="text-green-500" />
            پرداخت امن با SSL
        </div>
    </div>
);

export default PaymentMethods;