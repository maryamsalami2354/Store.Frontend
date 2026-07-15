// =============================================================================
// FILE: shippingSavedAddresses.jsx
// =============================================================================
import React from 'react';
import { MapPin, Plus, Check, Home, Briefcase, Heart } from 'react-feather';

const iconMap = {
    'منزل': Home,
    'محل کار': Briefcase,
    'خانه پدری': Heart,
};

const ShippingSavedAddresses = ({ addresses = [], selectedId, onSelect, onAddNew }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
                آدرس‌های ذخیره شده
            </h3>
            <button
                onClick={onAddNew}
                className="flex items-center gap-1.5 text-xs font-medium text-[#002874] dark:text-[#4C6FB6] hover:underline"
            >
                <Plus size={14} />
                آدرس جدید
            </button>
        </div>

        <div className="space-y-3">
            {addresses.map(address => {
                const Icon = iconMap[address.title] || MapPin;
                const isSelected = address.id === selectedId;

                return (
                    <button
                        key={address.id}
                        onClick={() => onSelect(address)}
                        className={`w-full text-right p-4 rounded-xl border transition-all ${
                            isSelected
                                ? 'border-[#002874] bg-[#002874]/5'
                                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                                isSelected ? 'bg-[#002874] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                            }`}>
                                <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 dark:text-white">{address.title}</span>
                                    {address.isDefault && (
                                        <span className="text-[10px] bg-[#002874]/10 dark:bg-[#4C6FB6]/20 text-[#002874] dark:text-[#4C6FB6] px-2 py-0.5 rounded-full">
                      پیش‌فرض
                    </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{address.address}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{address.receiverName}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                    <span className="dir-ltr">{address.phone}</span>
                                </div>
                            </div>
                            {isSelected && (
                                <div className="w-6 h-6 rounded-full bg-[#002874] flex items-center justify-center flex-shrink-0">
                                    <Check size={14} className="text-white" />
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    </div>
);

export default ShippingSavedAddresses;