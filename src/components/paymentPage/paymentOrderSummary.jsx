import React from 'react';
import { MapPin, Clock, Shield, ArrowLeft, Truck } from 'react-feather';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { toAssetUrl } from '../../services/authApi.js';

const PaymentOrderSummary = ({
    items = [],
    subtotal,
    shippingCost,
    total,
    selectedAddress,
    deliveryTime,
    deliveryTimeLabel,
    shippingMethodTitle,
    onPay,
    paymentMethod,
    isPaying = false,
}) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg">خلاصه سفارش</h3>

        <div className="space-y-3 max-h-40 overflow-y-auto">
            {items.map(item => (
                <div key={item.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#002874]/5 to-[#4C6FB6]/10 dark:from-[#002874]/20 dark:to-[#4C6FB6]/20 p-1.5 flex-shrink-0">
                        <LazyLoadImage src={toAssetUrl(item.image)} alt={item.name || item.productName} effect="blur" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-800 dark:text-gray-200 line-clamp-1">{item.name || item.productName}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.quantity.toLocaleString('fa-IR')} عدد</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">جمع</span>
                <span className="text-gray-800 dark:text-gray-200">{subtotal.toLocaleString('fa-IR')} تومان</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">ارسال</span>
                <span className="text-gray-800 dark:text-gray-200">{shippingCost.toLocaleString('fa-IR')} تومان</span>
            </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
            <div className="flex justify-between text-base font-extrabold">
                <span className="text-gray-900 dark:text-white">مبلغ نهایی</span>
                <span className="text-[#002874] dark:text-[#4C6FB6]">{total.toLocaleString('fa-IR')} تومان</span>
            </div>
        </div>

        {shippingMethodTitle && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Truck size={14} className="text-[#002874] dark:text-[#4C6FB6]" />
                <span>{shippingMethodTitle}</span>
            </div>
        )}

        {selectedAddress && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                    <MapPin size={14} className="text-[#002874] dark:text-[#4C6FB6]" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{selectedAddress.title}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{selectedAddress.address}</p>
            </div>
        )}

        {deliveryTime && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={14} className="text-[#002874] dark:text-[#4C6FB6]" />
                <span>{deliveryTimeLabel || deliveryTime}</span>
            </div>
        )}

        <button
            onClick={onPay}
            disabled={isPaying}
            className="w-full py-3 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
            {isPaying ? 'در حال ثبت سفارش...' : paymentMethod === 'wallet' ? 'پرداخت از کیف پول' : 'پرداخت تستی زرین‌پال'}
            <ArrowLeft size={16} />
        </button>

        <div className="flex items-center gap-2 text-[10px] text-gray-400 justify-center">
            <Shield size={12} className="text-green-500" />
            پرداخت امن
        </div>
    </div>
);

export default PaymentOrderSummary;
