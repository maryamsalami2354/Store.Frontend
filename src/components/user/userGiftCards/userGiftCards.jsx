// =============================================================================
// FILE: userGiftCards.jsx
// =============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Gift, Plus } from 'react-feather';
import UserGiftCardsFilterBar from './userGiftCardsFilterBar';
import UserGiftCardsCard from './userGiftCardsCard';
import UserGiftCardsEmpty from './userGiftCardsEmpty';
import UserGiftCardsSkeleton from './userGiftCardsSkeleton';
import UserGiftCardsSendModal from './userGiftCardsSendModal';
import ProductsPagination from '../../seller/sellerProducts/productsPagination';

const ITEMS_PER_PAGE = 6;

const sampleGiftCards = [
    { id: 1, code: 'GIFT-1234-5678', amount: 200000, remaining: 150000, from: 'علی محمدی', message: 'تولدت مبارک! 🎂', date: '۱۴۰۴/۰۲/۱۵', status: 'active', usedDate: null },
    { id: 2, code: 'GIFT-8765-4321', amount: 500000, remaining: 0, from: 'سارا رضایی', message: 'هدیه نوروزی', date: '۱۴۰۴/۰۱/۰۵', status: 'used', usedDate: '۱۴۰۴/۰۱/۲۰' },
    { id: 3, code: 'GIFT-1122-3344', amount: 300000, remaining: 300000, from: 'فروشگاه شاپ مارکت', message: 'تبریک ثبت‌نام', date: '۱۴۰۳/۱۲/۲۸', status: 'active', usedDate: null },
    { id: 4, code: 'GIFT-5566-7788', amount: 100000, remaining: 100000, from: 'مهرداد وفایی', message: 'خرید خوبی داشته باشی!', date: '۱۴۰۴/۰۲/۲۲', status: 'expired', usedDate: null },
];

const UserGiftCards = () => {
    const [giftCards, setGiftCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSendModal, setShowSendModal] = useState(false);

    useEffect(() => {
        const load = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            setGiftCards(sampleGiftCards);
            setIsLoading(false);
        };
        load();
    }, []);

    const filtered = useMemo(() => {
        let result = [...giftCards];
        if (filterStatus !== 'all') result = result.filter(c => c.status === filterStatus);
        switch (sortBy) {
            case 'oldest': result.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
            case 'amount': result.sort((a, b) => b.amount - a.amount); break;
            default: result.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        return result;
    }, [giftCards, filterStatus, sortBy]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [filterStatus, sortBy]);

    const handleSend = (data) => {
        const newCard = {
            id: Date.now(),
            code: `GIFT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            amount: parseInt(data.amount),
            remaining: parseInt(data.amount),
            from: 'شما',
            to: data.recipient,
            message: data.message,
            date: new Date().toLocaleDateString('fa-IR'),
            status: 'active',
            usedDate: null,
        };
        setGiftCards(prev => [newCard, ...prev]);
        toast.success('کارت هدیه با موفقیت ارسال شد');
    };

    if (isLoading) return <UserGiftCardsSkeleton />;

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">کارت‌های هدیه</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filtered.length} کارت</p>
                </div>
                <button
                    onClick={() => setShowSendModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition-colors"
                >
                    <Plus size={16} />
                    ارسال کارت هدیه
                </button>
            </div>

            <UserGiftCardsFilterBar
                filterStatus={filterStatus} setFilterStatus={setFilterStatus}
                sortBy={sortBy} setSortBy={setSortBy}
            />

            {filtered.length === 0 ? (
                <UserGiftCardsEmpty hasFilter={filterStatus !== 'all'} />
            ) : (
                <>
                    <div className="space-y-3">
                        {paginated.map(card => (
                            <UserGiftCardsCard key={card.id} card={card} />
                        ))}
                    </div>
                    {filtered.length > ITEMS_PER_PAGE && (
                        <ProductsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    )}
                </>
            )}

            {showSendModal && (
                <UserGiftCardsSendModal
                    onClose={() => setShowSendModal(false)}
                    onSend={handleSend}
                />
            )}
        </div>
    );
};

export default UserGiftCards;