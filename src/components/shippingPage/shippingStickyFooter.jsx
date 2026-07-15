import React from 'react';
import { ArrowLeft, MapPin } from 'react-feather';

const ShippingStickyFooter = ({ total, selectedAddress, onContinue }) => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 p-3 z-40 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
                {selectedAddress && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                        <MapPin size={12} className="text-[#002874] dark:text-[#4C6FB6] flex-shrink-0" />
                        {selectedAddress.title}
                    </p>
                )}
                <p className="text-lg font-extrabold text-[#002874] dark:text-[#4C6FB6]">{total.toLocaleString('fa-IR')} تومان</p>
            </div>
            <button
                onClick={onContinue}
                className="flex items-center gap-2 px-5 py-3 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] transition-colors flex-shrink-0"
            >
                ادامه
                <ArrowLeft size={16} />
            </button>
        </div>
    </div>
);

export default ShippingStickyFooter;
