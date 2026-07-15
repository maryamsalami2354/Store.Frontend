// src/components/seller/sellerFinance/financeWallet.jsx (اصلاح جدول - راست‌چین کردن شماره‌ها)
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DollarSign, CreditCard, Copy, Plus, Trash2, X, Save, Archive } from 'react-feather';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../../common/customSelect/customSelect';

const FinanceWallet = ({ wallet, isLoading }) => {
    const [accounts, setAccounts] = useState([
        { id: 1, type: 'card', label: 'بانک ملت', number: wallet?.cardNumber || '6037-****-****-1234' },
        { id: 2, type: 'shaba', label: 'حساب اصلی', number: wallet?.shaba || 'IR123456789012345678901234' },
    ]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAccountType, setNewAccountType] = useState('card');
    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [newAccountLabel, setNewAccountLabel] = useState('');

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('کپی شد');
    };

    const handleDelete = (id) => {
        setAccounts(prev => prev.filter(a => a.id !== id));
        toast.success('حساب با موفقیت حذف شد');
    };

    const handleAddAccount = () => {
        if (!newAccountNumber.trim() || !newAccountLabel.trim()) {
            toast.error('نام و شماره حساب را وارد کنید');
            return;
        }
        const newAccount = {
            id: Date.now(),
            type: newAccountType,
            label: newAccountLabel,
            number: newAccountNumber,
        };
        setAccounts(prev => [...prev, newAccount]);
        setNewAccountNumber('');
        setNewAccountLabel('');
        setShowAddForm(false);
        toast.success('حساب جدید اضافه شد');
    };

    if (isLoading) {
        return (
            <div className="space-y-5">
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                    <Skeleton width={200} height={24} className="dark:!bg-gray-800 mb-4" />
                    <Skeleton width={300} height={36} className="dark:!bg-gray-800 mb-6" />
                    <Skeleton width="100%" height={80} className="dark:!bg-gray-800" />
                </div>
            </div>
        );
    }

    if (!wallet) return null;

    return (
        <div className="space-y-5">
            {/* کارت موجودی */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 bg-gradient-to-l from-[#002874]/10 to-transparent dark:from-[#4C6FB6]/20 dark:to-transparent">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#002874] to-[#4C6FB6] flex items-center justify-center shadow-lg shadow-[#002874]/30">
                            <Archive size={28} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">کیف پول فروشنده</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">موجودی قابل برداشت</p>
                        </div>
                    </div>
                    <p className="text-4xl font-extrabold text-[#002874]  dark:text-[#4C6FB6] mb-4">
                        {wallet.balance.toLocaleString('fa-IR')}
                        <span className="text-lg font-normal text-gray-500 mr-2">تومان</span>
                    </p>
                    <div className="flex items-center gap-3">
                        <button className="px-5 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition shadow-md">
                            شارژ کیف پول
                        </button>
                        <button className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            گزارش مالی
                        </button>
                    </div>
                </div>
            </div>

            {/* جدول حساب‌ها */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <CreditCard size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">حساب‌های بانکی</h2>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition"
                    >
                        <Plus size={16} /> {showAddForm ? 'انصراف' : 'افزودن حساب'}
                    </button>
                </div>

                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-b border-gray-200 dark:border-gray-800"
                        >
                            <div className="p-5 bg-gray-50 dark:bg-gray-900/50 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={newAccountLabel}
                                        onChange={(e) => setNewAccountLabel(e.target.value)}
                                        placeholder="نام حساب (مثلاً بانک ملت)"
                                        className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent transition"
                                    />
                                    <CustomSelect
                                        options={[
                                            { value: 'card', label: 'کارت بانکی' },
                                            { value: 'shaba', label: 'شماره شبا' },
                                        ]}
                                        value={newAccountType}
                                        onChange={setNewAccountType}
                                        placeholder="نوع حساب"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={newAccountNumber}
                                    onChange={(e) => setNewAccountNumber(e.target.value)}
                                    placeholder={newAccountType === 'card' ? 'شماره ۱۶ رقمی کارت' : 'IR... شماره شبا'}
                                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent transition dir-ltr text-left"
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleAddAccount} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                                        <Save size={14} /> ذخیره
                                    </button>
                                    <button onClick={() => setShowAddForm(false)} className="flex items-center gap-1 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                        <X size={14} /> انصراف
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">نام حساب</th>
                            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">نوع</th>
                            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">شماره حساب / شبا</th>
                            <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">عملیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {accounts.map(account => (
                            <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                                <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">{account.label}</td>
                                <td className="px-5 py-4">
                    <span className="inline-flex whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {account.type === 'card' ? 'کارت بانکی' : 'شماره شبا'}
                    </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 dir-ltr text-right font-mono">{account.number}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-center gap-1">
                                        <button onClick={() => handleCopy(account.number)} className="p-2 text-[#002874]  dark:text-[#4C6FB6] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition" title="کپی">
                                            <Copy size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(account.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="حذف">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinanceWallet;