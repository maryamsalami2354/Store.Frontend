// src/components/seller/sellerInventory/inventoryAdjustModal.jsx
import React, { useState } from 'react';
import { X, Save } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const reasons = [
    { value: 'restock', label: 'شارژ انبار' },
    { value: 'sale', label: 'فروش' },
    { value: 'return', label: 'مرجوعی' },
    { value: 'damage', label: 'آسیب‌دیدگی' },
    { value: 'inventory', label: 'انبارگردانی' },
    { value: 'other', label: 'سایر' },
];

const InventoryAdjustModal = ({ isOpen, product, onClose, onAdjust }) => {
    const [quantity, setQuantity] = useState(1);
    const [type, setType] = useState('increase');
    const [reason, setReason] = useState('restock');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!quantity || quantity <= 0) return toast.error('مقدار نامعتبر است');
        if (type === 'decrease' && quantity > product.stock) return toast.error('مقدار کاهش بیشتر از موجودی فعلی است');
        onAdjust(product, Number(quantity), type, reason);
        onClose();
    };

    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">تنظیم موجودی</h3>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">موجودی فعلی: <strong>{product.stock}</strong></p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setType('increase')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${type === 'increase' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>افزایش</button>
                                <button type="button" onClick={() => setType('decrease')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${type === 'decrease' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>کاهش</button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">مقدار</label>
                                <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6]" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">دلیل</label>
                                <select value={reason} onChange={e => setReason(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm">
                                    {reasons.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">انصراف</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#002874]  text-white flex items-center justify-center gap-2"><Save size={16} /> ثبت</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InventoryAdjustModal;