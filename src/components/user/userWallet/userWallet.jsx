// src/components/user/userWallet/userWallet.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import WalletBalanceCard from './walletBalanceCard';
import WalletTransactions from './walletTransactions';
import WalletChargeModal from './walletChargeModal';
import walletData from '../../../../public/jsons/userWallet.json';

const UserWallet = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chargeModal, setChargeModal] = useState(false);
    const [withdrawModal, setWithdrawModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            setBalance(walletData.balance || 0);
            setTransactions(walletData.transactions || []);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleCharge = (amount, trackingCode) => {
        const newTransaction = {
            id: Date.now(),
            type: 'deposit',
            amount: amount,
            date: new Date().toLocaleDateString('fa-IR'),
            time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            status: 'successful',
            trackingCode: trackingCode || `TRX-${Date.now()}`,
            description: 'شارژ کیف پول',
        };
        setTransactions(prev => [newTransaction, ...prev]);
        setBalance(prev => prev + amount);
        toast.success(`کیف پول با موفقیت ${amount.toLocaleString('fa-IR')} تومان شارژ شد`);
    };

    const handleWithdraw = (amount) => {
        if (amount > balance) {
            toast.error('موجودی کافی نیست');
            return;
        }
        const newTransaction = {
            id: Date.now(),
            type: 'withdrawal',
            amount: amount,
            date: new Date().toLocaleDateString('fa-IR'),
            time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            status: 'pending',
            trackingCode: `WTH-${Date.now()}`,
            description: 'درخواست برداشت',
        };
        setTransactions(prev => [newTransaction, ...prev]);
        setBalance(prev => prev - amount);
        toast.success('درخواست برداشت ثبت شد');
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">کیف پول</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">مدیریت اعتبار و تراکنش‌ها</p>
                </div>
            </div>

            <WalletBalanceCard
                balance={balance}
                isLoading={isLoading}
                onCharge={() => setChargeModal(true)}
                onWithdraw={() => setWithdrawModal(true)}
            />

            <WalletTransactions transactions={transactions} isLoading={isLoading} />

            <WalletChargeModal
                isOpen={chargeModal}
                onClose={() => setChargeModal(false)}
                onConfirm={handleCharge}
                title="شارژ کیف پول"
                type="charge"
            />

            <WalletChargeModal
                isOpen={withdrawModal}
                onClose={() => setWithdrawModal(false)}
                onConfirm={(amount) => handleWithdraw(amount)}
                title="برداشت از کیف پول"
                type="withdraw"
                maxAmount={balance}
            />
        </div>
    );
};

export default UserWallet;