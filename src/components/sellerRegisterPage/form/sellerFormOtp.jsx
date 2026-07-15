// =============================================================================
// FILE: sellerFormOtp.jsx
// =============================================================================
import React, { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import { ArrowRight, RefreshCw, Clock } from 'react-feather';

const SellerFormOtp = ({ phone = '۰۹۱۲۳۴۵۶۷۸۹', onSuccess, onBack }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }
        const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (otp.length !== 6) return;
        if (otp === '123456') {
            onSuccess();
        } else {
            setError('کد وارد شده اشتباه است');
        }
    };

    const handleResend = () => {
        setTimer(120);
        setCanResend(false);
        setOtp('');
        setError('');
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, '۰')}:${s.toString().padStart(2, '۰')}`;
    };

    const isComplete = otp.length === 6;

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-[#002874]/10 dark:bg-[#4C6FB6]/20 mb-4">
                    <Clock size={28} className="text-[#002874] dark:text-[#4C6FB6]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">کد تأیید</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    کد ۶ رقمی به شماره <span className="font-bold text-gray-700 dark:text-gray-300 dir-ltr">{phone}</span> ارسال شد
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    کد تستی:123456
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center" dir="ltr">
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span className="w-2 sm:w-3" />}
                        renderInput={(props) => (
                            <input
                                {...props}
                                inputMode="numeric"
                                className="!w-11 h-14 sm:!w-14 sm:h-16 text-center text-xl font-bold rounded-xl border-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent transition-all outline-none"
                                style={{ borderColor: error ? '#ef4444' : isComplete ? '#22c55e' : '#d1d5db' }}
                            />
                        )}
                        shouldAutoFocus
                    />
                </div>

                {error && (
                    <p className="text-center text-sm text-red-500">{error}</p>
                )}

                <div className="text-center">
                    {canResend ? (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="inline-flex items-center gap-1.5 text-sm text-[#002874] dark:text-[#4C6FB6] hover:underline"
                        >
                            <RefreshCw size={14} />
                            ارسال مجدد کد
                        </button>
                    ) : (
                        <p className="text-sm text-gray-400 flex items-center justify-center gap-1.5">
                            <Clock size={14} />
                            {formatTime(timer)} تا ارسال مجدد
                        </p>
                    )}
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center gap-2 px-5 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ArrowRight size={16} />
                        اصلاح شماره
                    </button>
                    <button
                        type="submit"
                        disabled={!isComplete}
                        className="flex-1 py-3 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a]  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        تأیید کد
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SellerFormOtp;