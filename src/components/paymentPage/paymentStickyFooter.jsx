import React from 'react';
import { ArrowLeft, CreditCard, Archive } from 'react-feather';

const PaymentStickyFooter = ({ total, onPay, paymentMethod, isPaying = false }) => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 p-3 z-40 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
            <div>
                <p className="text-xs text-gray-500">مبلغ نهایی</p>
                <p className="text-lg font-extrabold text-[#002874] dark:text-[#4C6FB6]">{total.toLocaleString('fa-IR')} تومان</p>
            </div>
            <button
                onClick={onPay}
                disabled={isPaying}
                className="flex items-center gap-2 px-5 py-3 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
            >
                {paymentMethod === 'wallet' ? <Archive size={16} /> : <CreditCard size={16} />}
                {isPaying ? 'در حال ثبت...' : 'پرداخت'}
                <ArrowLeft size={16} />
            </button>
        </div>
    </div>
);

export default PaymentStickyFooter;
