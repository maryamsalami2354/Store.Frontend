// src/components/common/persianDatePicker/persianDatePicker.jsx
import React, { forwardRef, useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft } from 'react-feather';
import { toGregorian, toJalaali } from 'jalaali-js';

const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const PersianDatePicker = forwardRef(({ value, onChange, placeholder, className = '' }, ref) => {
    // اگر value ورودی داشت، آن را به شمسی تبدیل کن، در غیر این صورت سال پیش‌فرض ۱۴۰۴
    const initialJalaali = value
        ? toJalaali(new Date(value))
        : { jy: 1404, jm: 1, jd: 1 };

    const [showCalendar, setShowCalendar] = useState(false);
    const [viewYear, setViewYear] = useState(initialJalaali.jy);
    const [viewMonth, setViewMonth] = useState(initialJalaali.jm);
    const [selectedJd, setSelectedJd] = useState(initialJalaali.jd);
    const [inputText, setInputText] = useState(
        value
            ? `${initialJalaali.jy}/${String(initialJalaali.jm).padStart(2, '0')}/${String(initialJalaali.jd).padStart(2, '0')}`
            : ''
    );

    const daysInMonth = useMemo(() => {
        if (viewMonth <= 6) return 31;
        if (viewMonth <= 11) return 30;
        return toJalaali(new Date(viewYear + 621, 2, 21)).jd === 30 ? 30 : 29;
    }, [viewMonth, viewYear]);

    const handlePrevMonth = () => {
        if (viewMonth === 1) {
            setViewMonth(12);
            setViewYear(y => y - 1);
        } else {
            setViewMonth(m => m - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 12) {
            setViewMonth(1);
            setViewYear(y => y + 1);
        } else {
            setViewMonth(m => m + 1);
        }
    };

    const handleSelectDay = (day) => {
        const text = `${viewYear}/${String(viewMonth).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
        setInputText(text);
        setSelectedJd(day);

        // تبدیل دقیق شمسی به میلادی با jalaali-js
        const gDate = toGregorian(viewYear, viewMonth, day);
        const gregorianDate = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
        onChange?.(gregorianDate.toISOString().split('T')[0]);
        setShowCalendar(false);
    };

    const handleClear = () => {
        setInputText('');
        onChange?.('');
        setShowCalendar(false);
    };

    // هنگام باز شدن تقویم، با مقدار جدید همگام شو
    const handleOpen = () => {
        if (value) {
            const j = toJalaali(new Date(value));
            setViewYear(j.jy);
            setViewMonth(j.jm);
            setSelectedJd(j.jd);
        }
        setShowCalendar(true);
    };

    return (
        <div className="relative" ref={ref}>
            <div className="relative">
                <input
                    value={inputText}
                    placeholder={placeholder}
                    readOnly
                    onClick={handleOpen}
                    className={`w-full py-2.5 px-4 pl-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent focus:outline-none transition-all duration-200 cursor-pointer ${className}`}
                />
                <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>

            {showCalendar && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowCalendar(false)} />
                    <div className="absolute top-full right-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-72">
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={handlePrevMonth} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ChevronRight size={18} />
                            </button>
                            <span className="font-medium text-gray-900 dark:text-white">{months[viewMonth - 1]} {viewYear}</span>
                            <button onClick={handleNextMonth} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ChevronLeft size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(d => <div key={d} className="text-center text-xs text-gray-500">{d}</div>)}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                                <button
                                    key={day}
                                    onClick={() => handleSelectDay(day)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition ${
                                        day === selectedJd && viewMonth === (value ? toJalaali(new Date(value)).jm : null) && viewYear === (value ? toJalaali(new Date(value)).jy : null)
                                            ? 'bg-[#002874] text-white dark:bg-[#4C6FB6]'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button onClick={handleClear} className="flex-1 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                                پاک کردن
                            </button>
                            <button onClick={() => setShowCalendar(false)} className="flex-1 py-2 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-lg text-sm">
                                بستن
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});

PersianDatePicker.displayName = 'PersianDatePicker';
export default PersianDatePicker;