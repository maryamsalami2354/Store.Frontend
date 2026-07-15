// =============================================================================
// FILE: userGiftCardsCard.jsx
// =============================================================================
import React from 'react';
import { Gift, Copy, Clock, CheckCircle, XCircle } from 'react-feather';
import { toast } from 'react-toastify';

const statusMap = {
    active: { label: 'فعال', icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    used: { label: 'استفاده شده', icon: CheckCircle, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    expired: { label: 'منقضی', icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
};

const UserGiftCardsCard = ({ card }) => {
    const st = statusMap[card.status] || statusMap.active;

    const handleCopy = () => {
        navigator.clipboard.writeText(card.code);
        toast.success('کد کپی شد');
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl ${card.status === 'active' ? 'bg-gradient-to-br from-pink-500 to-rose-600' : 'bg-gray-200 dark:bg-gray-800'}`}>
                    <Gift size={24} className="text-white" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">{card.amount.toLocaleString('fa-IR')} تومان</h3>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${st.color}`}>
                  {st.label}
                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">از: {card.from}</p>
                        </div>
                    </div>

                    {/* Code */}
                    <div className="flex items-center gap-2 mt-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                        <code className="text-sm font-mono text-gray-700 dark:text-gray-300 flex-1 dir-ltr text-left">{card.code}</code>
                        <button onClick={handleCopy} className="p-1.5 text-gray-400 hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors">
                            <Copy size={14} />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><Clock size={12} />{card.date}</span>
                        {card.remaining > 0 && card.status === 'active' && (
                            <span>مانده: {card.remaining.toLocaleString('fa-IR')} تومان</span>
                        )}
                        {card.to && <span>گیرنده: {card.to}</span>}
                    </div>

                    {card.message && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">"{card.message}"</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserGiftCardsCard;