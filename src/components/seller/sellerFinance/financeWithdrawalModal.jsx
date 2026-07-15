// src/components/seller/sellerFinance/financeWithdrawalModal.jsx
import React, { useState } from 'react';
import { X, Shield } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import OtpInput from 'react-otp-input';

const FinanceWithdrawalModal = ({ isOpen, amount, wallet, onClose, onConfirm }) => {
    const [otp, setOtp] = useState('');

    const handleConfirm = () => {
        if (!otp || otp.length !== 4 || otp !== '1234') {
            toast.error('کد تأیید اشتباه است');
            return;
        }
        onConfirm();
        setOtp('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
                                    <Shield size={20} className="text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">تأیید تسویه حساب</h3>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                <X size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">مبلغ تسویه:</span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{amount?.toLocaleString('fa-IR')} تومان</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">حساب مقصد:</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300 dir-ltr">{wallet?.shaba || wallet?.cardNumber}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300 text-center">
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
                                                className="!w-14 h-14 text-center text-xl font-bold rounded-xl border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent transition-all outline-none"
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
                            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                انصراف
                            </button>
                            <button onClick={handleConfirm} disabled={otp.length !== 4} className="flex-1 py-2.5 rounded-xl bg-[#002874] text-white font-medium hover:bg-[#001d5a] transition disabled:opacity-50 disabled:cursor-not-allowed">
                                تأیید و ثبت
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FinanceWithdrawalModal;