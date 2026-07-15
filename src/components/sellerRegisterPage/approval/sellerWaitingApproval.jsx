// =============================================================================
// FILE: sellerWaitingApproval.jsx (اصلاح‌شده - کار می‌کنه)
// =============================================================================
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Shield, CheckCircle } from 'react-feather';

const steps = [
    { label: 'بررسی مدارک', done: false },
    { label: 'تأیید اطلاعات بانکی', done: false },
    { label: 'فعال‌سازی فروشگاه', done: false },
];

const SellerWaitingApproval = ({ onApprovalDone }) => {
    const [progress, setProgress] = useState(0);
    const [doneSteps, setDoneSteps] = useState([false, false, false]);
    const calledRef = useRef(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + 2;

                const newDone = [...doneSteps];
                if (next >= 50) newDone[0] = true;
                if (next >= 80) newDone[1] = true;
                if (next >= 100) newDone[2] = true;
                setDoneSteps(newDone);

                if (next >= 100 && !calledRef.current) {
                    calledRef.current = true;
                    clearInterval(timer);
                    setTimeout(() => {
                        onApprovalDone();
                    }, 1000);
                    return 100;
                }

                return next > 100 ? 100 : next;
            });
        }, 300);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center">

                {/* Clock Icon */}
                <div className="inline-flex p-4 rounded-full bg-[#002874]/10 dark:bg-[#4C6FB6]/20 mb-6">
                    <Clock size={48} className="text-[#002874] dark:text-[#4C6FB6] animate-spin" style={{ animationDuration: '3s' }} />
                </div>

                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">در حال بررسی</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    اطلاعات فروشگاه شما در حال بررسی توسط تیم پشتیبانی است. لطفاً شکیبا باشید.
                </p>

                {/* Progress Bar */}
                <div className="bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-6 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#002874] to-[#4C6FB6] rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">{progress}%</p>

                {/* Steps */}
                <div className="space-y-3 mb-6">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                doneSteps[idx] ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                            }`}>
                                {doneSteps[idx] ? <CheckCircle size={16} /> : idx + 1}
                            </div>
                            <span className={`text-sm ${doneSteps[idx] ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                {step.label}
              </span>
                            {doneSteps[idx] && <CheckCircle size={14} className="text-green-500 ml-auto" />}
                        </div>
                    ))}
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <Shield size={14} />
                    اطلاعات شما محفوظ است
                </div>

                {/* Done Message */}
                {progress >= 100 && (
                    <div className="mt-6 animate-pulse text-[#002874] dark:text-[#4C6FB6] font-medium text-sm">
                        در حال انتقال به صفحه خوش‌آمدگویی...
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerWaitingApproval;