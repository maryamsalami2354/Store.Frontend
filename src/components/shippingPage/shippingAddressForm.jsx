// =============================================================================
// FILE: shippingAddressForm.jsx
// =============================================================================
import React, { useState } from 'react';
import { X, MapPin, User, Phone, Home } from 'react-feather';
import CustomSelect from '../../common/customSelect/customSelect';

const provinces = [
    { value: 'tehran', label: 'تهران' },
    { value: 'isfahan', label: 'اصفهان' },
    { value: 'shiraz', label: 'شیراز' },
    { value: 'mashhad', label: 'مشهد' },
    { value: 'tabriz', label: 'تبریز' },
];

const cities = {
    tehran: [{ value: 'tehran', label: 'تهران' }],
    isfahan: [{ value: 'isfahan', label: 'اصفهان' }, { value: 'kashan', label: 'کاشان' }],
    shiraz: [{ value: 'shiraz', label: 'شیراز' }],
    mashhad: [{ value: 'mashhad', label: 'مشهد' }],
    tabriz: [{ value: 'tabriz', label: 'تبریز' }],
};

const titleOptions = [
    { value: 'منزل', label: 'منزل' },
    { value: 'محل کار', label: 'محل کار' },
    { value: 'خانه پدری', label: 'خانه پدری' },
    { value: 'سایر', label: 'سایر' },
];

const ShippingAddressForm = ({ onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !province || !city || !address || !receiverName || !phone) {
            return;
        }
        onSubmit({
            title,
            province: provinces.find(p => p.value === province)?.label,
            city: cities[province]?.find(c => c.value === city)?.label,
            address,
            postalCode,
            receiverName,
            phone,
        });
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
                    آدرس جدید
                </h3>
                <button onClick={onCancel} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <X size={18} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">عنوان</label>
                        <CustomSelect options={titleOptions} value={title} onChange={setTitle} placeholder="انتخاب" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">نام تحویل گیرنده</label>
                        <input type="text" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} className="w-full p-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">استان</label>
                        <CustomSelect options={provinces} value={province} onChange={(v) => { setProvince(v); setCity(''); }} placeholder="انتخاب استان" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">شهر</label>
                        <CustomSelect options={cities[province] || []} value={city} onChange={setCity} placeholder="انتخاب شهر" disabled={!province} />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">آدرس کامل</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full p-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent resize-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">کد پستی</label>
                        <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full p-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent dir-ltr text-left" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">شماره موبایل</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent dir-ltr text-left" />
                    </div>
                </div>

                <button type="submit" className="w-full py-3 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] transition-colors">
                    ثبت آدرس
                </button>
            </form>
        </div>
    );
};

export default ShippingAddressForm;