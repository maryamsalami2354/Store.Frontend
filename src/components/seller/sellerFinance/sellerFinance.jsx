// src/components/seller/sellerFinance/sellerFinance.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { toast } from 'react-toastify';
import FinanceSummaryCards from './financeSummaryCards';
import FinanceWallet from './financeWallet';
import FinanceTransactions from './financeTransactions';
import FinanceWithdrawal from './financeWithdrawal';
import FinanceWithdrawalModal from './financeWithdrawalModal';
import financeData from '../../../../public/jsons/sellerFinance.json';

const TABS = [
    { id: 'wallet', label: 'کیف پول' },
    { id: 'transactions', label: 'تراکنش‌ها' },
    { id: 'withdrawal', label: 'تسویه حساب' },
];

const SellerFinance = () => {
    const [activeTab, setActiveTab] = useState('wallet');
    const [isLoading, setIsLoading] = useState(true);
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [summary, setSummary] = useState(null);
    const [withdrawalModal, setWithdrawalModal] = useState({ isOpen: false, amount: 0 });

    // Fuse.js برای جستجوی تراکنش‌ها
    const fuseTransactions = useMemo(() => {
        return new Fuse(transactions, {
            keys: ['trackingCode', 'type', 'status'],
            threshold: 0.3,
        });
    }, [transactions]);

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            setWallet(financeData.wallet);
            setTransactions(financeData.transactions || []);
            setWithdrawals(financeData.withdrawals || []);
            setSummary(financeData.summary);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleRequestWithdrawal = (amount) => {
        if (!amount || amount <= 0) return toast.error('مبلغ نامعتبر');
        if (amount > wallet.balance) return toast.error('موجودی کافی نیست');
        setWithdrawalModal({ isOpen: true, amount });
    };

    const handleConfirmWithdrawal = async () => {
        const newWithdrawal = {
            id: Date.now(),
            amount: withdrawalModal.amount,
            requestDate: new Date().toLocaleDateString('fa-IR'),
            status: 'pending',
            paidDate: null,
            account: wallet.shaba || wallet.cardNumber,
        };
        setWithdrawals(prev => [newWithdrawal, ...prev]);
        setWallet(prev => ({ ...prev, balance: prev.balance - withdrawalModal.amount }));
        setSummary(prev => ({
            ...prev,
            balance: prev.balance - withdrawalModal.amount,
            pendingWithdrawals: prev.pendingWithdrawals + withdrawalModal.amount
        }));
        toast.success('درخواست تسویه ثبت شد');
        setWithdrawalModal({ isOpen: false, amount: 0 });
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">مالی و تسویه حساب</h1>
            </div>

            <FinanceSummaryCards summary={summary} isLoading={isLoading} />

            <div className="flex border-b border-gray-200 dark:border-gray-800">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? 'border-[#002874] text-[#002874]  dark:border-[#4C6FB6] dark:text-[#4C6FB6]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div>
                {activeTab === 'wallet' && <FinanceWallet wallet={wallet} isLoading={isLoading} />}
                {activeTab === 'transactions' && (
                    <FinanceTransactions
                        transactions={transactions}
                        isLoading={isLoading}
                        fuse={fuseTransactions}
                    />
                )}
                {activeTab === 'withdrawal' && (
                    <FinanceWithdrawal
                        wallet={wallet}
                        withdrawals={withdrawals}
                        isLoading={isLoading}
                        onRequestWithdrawal={handleRequestWithdrawal}
                    />
                )}
            </div>

            <FinanceWithdrawalModal
                isOpen={withdrawalModal.isOpen}
                amount={withdrawalModal.amount}
                wallet={wallet}
                onClose={() => setWithdrawalModal({ isOpen: false, amount: 0 })}
                onConfirm={handleConfirmWithdrawal}
            />
        </div>
    );
};

export default SellerFinance;