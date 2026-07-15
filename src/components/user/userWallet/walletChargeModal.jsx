// src/components/user/userWallet/walletChargeModal.jsx
import React, { useState } from 'react';
import { X, Shield, Plus, ArrowUp } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import OtpInput from 'react-otp-input';

const amounts = [100000, 200000, 500000, 1000000];

const WalletChargeModal = ({ isOpen, onClose, onConfirm, title, type, maxAmount }) => {
    const [selectedAmount, setSelectedAmount] = useState('');
    const [customAmount, setCustomAmount] = useState('');
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const amount = customAmount ? parseInt(customAmount.replace(/[^\d]/g, '')) : parseInt(selectedAmount);

    const handleNext = () => {
        if (!amount || amount < 10000) {
            toast.error('حداقل مبلغ ۱۰,۰۰۰ تومان است');
            return;
        }
        if (type === 'withdraw' && maxAmount && amount > maxAmount) {
            toast.error('موجودی کافی نیست');
            return;
        }
        setStep(2);
    };

    const handleConfirm = async () => {
        if (otp.length !== 4 || otp !== '1234') {
            toast.error('کد تأیید اشتباه است');
            return;
        }
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        onConfirm(amount, `TRX-${Date.now()}`);
        setLoading(false);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setSelectedAmount('');
        setCustomAmount('');
        setStep(1);
        setOtp('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleClose}>
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-xl ${type === 'charge' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                                    {type === 'charge' ? <Plus size={20} className="text-green-600" /> : <ArrowUp size={20} className="text-orange-600" />}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                            </div>
                            <button onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-500" /></button>
                        </div>

                        {step === 1 ? (
                            <>
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-4 gap-3">
                                        {amounts.map(amt => (
                                            <button
                                                key={amt}
                                                onClick={() => { setSelectedAmount(amt.toString()); setCustomAmount(''); }}
                                                className={`py-3 rounded-xl text-sm font-medium transition border-2 ${
                                                    selectedAmount === amt.toString()
                                                        ? 'border-[#002874] bg-[#002874]/10 text-[#002874]  dark:border-[#4C6FB6] dark:bg-[#4C6FB6]/20 dark:text-[#4C6FB6]'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                {amt.toLocaleString('fa-IR')}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={customAmount}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^\d]/g, '');
                                                setCustomAmount(val ? parseInt(val).toLocaleString('en-US') : '');
                                                setSelectedAmount('');
                                            }}
                                            placeholder="مبلغ دلخواه (تومان)"
                                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center text-lg font-medium focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6]"
                                        />
                                    </div>
                                </div>
                                <div className="p-5 border-t border-gray-200 dark:border-gray-800">
                                    <button
                                        onClick={handleNext}
                                        disabled={!amount || amount < 10000}
                                        className="w-full py-2.5 rounded-xl bg-[#002874]  text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#001d5a] transition"
                                    >
                                        ادامه - {(amount || 0).toLocaleString('fa-IR')} تومان
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-5 space-y-4">
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-center">
                                        <p className="text-sm text-gray-500 mb-1">{type === 'charge' ? 'مبلغ شارژ' : 'مبلغ برداشت'}</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{amount.toLocaleString('fa-IR')} تومان</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-3 text-center text-gray-700 dark:text-gray-300">
                                            کد تأیید ۴ رقمی را وارد کنید
                                        </label>
                                        <div className="flex justify-center" dir="ltr">
                                            <OtpInput
                                                value={otp}
                                                onChange={setOtp}
                                                numInputs={4}
                                                renderSeparator={<span className="w-3" />}
                                                renderInput={(props) => (
                                                    <input
                                                        {...props}
                                                        inputMode="numeric"
                                                        className="!w-14 h-14 text-center text-xl font-bold rounded-xl border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] transition-all outline-none"
                                                        style={{ borderColor: '#d1d5db' }}
                                                    />
                                                )}
                                                shouldAutoFocus
                                            />
                                        </div>
                                        <p className="text-center text-xs text-gray-500 mt-2">کد آزمایشی: ۱۲۳۴</p>
                                    </div>
                                </div>
                                <div className="p-5 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                                    <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition">
                                        بازگشت
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={otp.length !== 4 || loading}
                                        className="flex-1 py-2.5 rounded-xl bg-[#002874] text-white font-medium hover:bg-[#001d5a] transition disabled:opacity-50"
                                    >
                                        {loading ? 'در حال پردازش...' : 'تأیید و پرداخت'}
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WalletChargeModal;