// =============================================================================
// FILE: userGiftCardsSendModal.jsx
// =============================================================================
import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, DollarSign, Gift } from 'react-feather';
import CustomSelect from '../../common/customSelect/customSelect';

const amountOptions = [
    { value: '100000', label: '۱۰۰,۰۰۰ تومان' },
    { value: '200000', label: '۲۰۰,۰۰۰ تومان' },
    { value: '500000', label: '۵۰۰,۰۰۰ تومان' },
    { value: '1000000', label: '۱,۰۰۰,۰۰۰ تومان' },
];

const UserGiftCardsSendModal = ({ onClose, onSend }) => {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || !recipient) return;
        onSend({ amount, recipient, message });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>

                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/20">
                            <Gift size={18} className="text-pink-500" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">ارسال کارت هدیه</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-500" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">مبلغ</label>
                        <CustomSelect options={amountOptions} value={amount} onChange={setAmount} placeholder="انتخاب مبلغ" />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">شماره موبایل گیرنده</label>
                        <div className="relative">
                            <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                                className="w-full py-2.5 pr-10 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent dir-ltr text-left"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">پیام (اختیاری)</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={2}
                            placeholder="پیام تبریک..."
                            className="w-full p-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!amount || !recipient}
                        className="w-full py-3 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        <Send size={16} />
                        ارسال کارت هدیه
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserGiftCardsSendModal;