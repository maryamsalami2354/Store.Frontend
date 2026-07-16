import React from 'react';
import { MapPin, Edit2, Trash2, CheckCircle, Star } from 'react-feather';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
    return (
        <div className={`bg-white dark:bg-[#111] rounded-2xl border-2 p-5 transition-all ${address.isDefault ? 'border-[#002874] dark:border-[#4C6FB6]' : 'border-gray-200 dark:border-gray-800'} hover:shadow-md`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <MapPin size={18} className={address.isDefault ? 'text-[#002874] dark:text-[#4C6FB6]' : 'text-gray-400'} />
                    <h3 className="font-bold text-gray-900 dark:text-white">{address.title}</h3>
                    {address.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874] dark:text-[#4C6FB6] rounded-full text-xs">
                            <Star size={10} /> پیش‌فرض
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={onEdit} className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="ویرایش">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={onDelete} className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="حذف">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-1.5 text-sm">
                <p className="text-gray-700 dark:text-gray-300">{address.address}</p>
                <div className="flex flex-wrap items-center gap-3 text-gray-500 dark:text-gray-400">
                    <span>{address.province} - {address.city}</span>
                    {address.postalCode && <span>کد پستی: {address.postalCode}</span>}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-gray-500 dark:text-gray-400">
                    {address.plateNumber && <span>پلاک: {address.plateNumber}</span>}
                    {address.unitNumber && <span>واحد: {address.unitNumber}</span>}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-gray-500 dark:text-gray-400">
                    <span>{address.receiverName}</span>
                    <span className="dir-ltr">{address.phone}</span>
                </div>
            </div>

            {!address.isDefault && (
                <button
                    onClick={onSetDefault}
                    className="mt-3 flex items-center gap-1.5 text-sm text-[#002874] dark:text-[#4C6FB6] hover:underline"
                >
                    <CheckCircle size={14} />
                    انتخاب به‌عنوان آدرس پیش‌فرض
                </button>
            )}
        </div>
    );
};

export default AddressCard;
