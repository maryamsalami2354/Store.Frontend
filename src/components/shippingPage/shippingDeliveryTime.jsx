import React from 'react';
import { Clock } from 'react-feather';

const persianDateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    month: 'long',
    day: 'numeric',
});

const persianWeekdayFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    weekday: 'long',
});

const toPersianDigits = (value) => String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit]);

const getSlotKey = (slot) => `${slot.date}|${slot.code}`;

const parseSlotDate = (value) => {
    const [year, month, day] = String(value || '').slice(0, 10).split('-').map(Number);

    if (!year || !month || !day) return new Date(value);

    return new Date(year, month - 1, day, 12);
};

const isSameDay = (firstDate, secondDate) => (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
);

const getDateTitle = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return isSameDay(date, tomorrow) ? 'فردا' : persianWeekdayFormatter.format(date);
};

const formatDate = (date) => persianDateFormatter.format(date);

const formatPrice = (amount) => `${Number(amount || 0).toLocaleString('fa-IR')} تومان`;

const formatTimeSlot = (timeSlot) => {
    const [start, end] = String(timeSlot || '').split('-');
    const startHour = Number(start?.split(':')[0]);
    const endHour = Number(end?.split(':')[0]);

    if (Number.isFinite(startHour) && Number.isFinite(endHour)) {
        return `ساعت ${toPersianDigits(startHour)} تا ${toPersianDigits(endHour)}`;
    }

    return timeSlot || 'زمان انتخاب نشده';
};

const ShippingDeliveryTime = ({ value, onChange, options = [], shippingCost = 0 }) => {
    const selectedSlot = options.find((option) => getSlotKey(option) === value) || options[0];
    const selectedTimeLabel = selectedSlot ? formatTimeSlot(selectedSlot.timeSlot) : 'زمان انتخاب نشده';

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
                    زمان ارسال
                </h3>
                <span className="text-sm font-semibold text-[#002874] dark:text-[#9bb7ff]">
                    {value ? selectedTimeLabel : 'زمان انتخاب نشده'}
                </span>
            </div>

            <div dir="rtl" className="flex gap-2 overflow-x-auto pb-3 border-b border-gray-200 dark:border-gray-800">
                {options.map((option) => {
                    const date = parseSlotDate(option.date);
                    const key = getSlotKey(option);
                    const isSelected = value === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onChange(key)}
                            className={`w-[102px] flex-shrink-0 rounded-xl border px-3 py-3 text-center transition-all ${
                                isSelected
                                    ? 'border-gray-950 dark:border-white bg-white dark:bg-[#171717] shadow-sm'
                                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] hover:border-gray-400 dark:hover:border-gray-600'
                            }`}
                        >
                            <span className={`block text-sm font-bold ${isSelected ? 'text-gray-950 dark:text-white' : 'text-[#1d2a57] dark:text-gray-200'}`}>
                                {getDateTitle(date)}
                            </span>
                            <span className="mt-3 block text-sm font-semibold text-gray-500 dark:text-gray-400">
                                {formatDate(date)}
                            </span>
                            <span className="mt-3 block rounded-lg bg-gray-100 dark:bg-gray-900 px-2 py-2 text-[11px] font-extrabold leading-5 text-[#1d2a57] dark:text-gray-100">
                                {formatPrice(shippingCost)}
                            </span>
                        </button>
                    );
                })}
            </div>

            {selectedSlot && (
                <div className="flex items-center justify-between gap-3 pt-4 text-sm font-semibold text-gray-900 dark:text-white">
                    <span>{formatTimeSlot(selectedSlot.timeSlot)}</span>
                    <span className="h-6 w-6 rounded-full border-2 border-gray-500 dark:border-gray-400 flex items-center justify-center">
                        <span className="h-3 w-3 rounded-full bg-[#002874] dark:bg-[#4C6FB6]" />
                    </span>
                </div>
            )}
        </div>
    );
};

export default ShippingDeliveryTime;
