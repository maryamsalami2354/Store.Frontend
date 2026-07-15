// src/components/user/userAddresses/addressFormModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const provinces = ['تهران', 'اصفهان', 'خراسان رضوی', 'فارس', 'آذربایجان شرقی', 'خوزستان', 'مازندران', 'کرمان'];

const AddressFormModal = ({ isOpen, address, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        receiverName: '',
        phone: '',
        province: '',
        city: '',
        address: '',
        postalCode: '',
        isDefault: false,
    });

    useEffect(() => {
        if (address) {
            setFormData(address);
        } else {
            setFormData({
                title: '', receiverName: '', phone: '', province: '', city: '', address: '', postalCode: '', isDefault: false,
            });
        }
    }, [address]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.receiverName.trim() || !formData.phone.trim() || !formData.province || !formData.city.trim() || !formData.address.trim()) {
            toast.error('لطفاً تمام فیلدهای الزامی را پر کنید');
            return;
        }
        onSave(formData);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111] rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{address ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}</h3>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">نام آدرس *</label>
                                    <input name="title" value={formData.title} onChange={handleChange} placeholder="مثال: منزل" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">نام تحویل‌گیرنده *</label>
                                    <input name="receiverName" value={formData.receiverName} onChange={handleChange} placeholder="نام کامل" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">شماره تماس *</label>
                                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="09xxxxxxxxx" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm dir-ltr text-left focus:ring-2 focus:ring-[#002874]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">کد پستی</label>
                                    <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="۱۰ رقمی" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm dir-ltr text-left focus:ring-2 focus:ring-[#002874]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">استان *</label>
                                    <select name="province" value={formData.province} onChange={handleChange} className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874]">
                                        <option value="">انتخاب استان</option>
                                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">شهر *</label>
                                    <input name="city" value={formData.city} onChange={handleChange} placeholder="نام شهر" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">آدرس کامل *</label>
                                <textarea name="address" value={formData.address} onChange={handleChange} rows={2} placeholder="خیابان، کوچه، پلاک، واحد" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874]" />
                            </div>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="rounded" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">آدرس پیش‌فرض</span>
                            </label>
                            <div className="flex gap-3 pt-3">
                                <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">انصراف</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#002874] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#001d5a] transition"><Save size={16} /> ذخیره</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddressFormModal;