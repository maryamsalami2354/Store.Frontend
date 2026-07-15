// =============================================================================
// FILE: userOrders.jsx (اصلاح‌شده - مودال انتخاب دلیل مرجوعی)
// =============================================================================
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { toast } from 'react-toastify';
import { X, RotateCcw, ChevronLeft } from 'react-feather';
import OrdersFilterBar from './ordersFilterBar';
import OrdersList from './ordersList';
import OrderDetailsModal from './orderDetailsModal';
import ProductsPagination from '../../seller/sellerProducts/productsPagination';
import ordersData from '../../../../public/jsons/sellerOrders.json';

const ITEMS_PER_PAGE = 10;

const reasonsList = [
    { id: 'damaged', label: 'کالا آسیب دیده', icon: '📦' },
    { id: 'not_match', label: 'مغایرت با توضیحات', icon: '❌' },
    { id: 'quality', label: 'کیفیت نامناسب', icon: '👎' },
    { id: 'wrong_item', label: 'ارسال کالای اشتباه', icon: '🔄' },
    { id: 'no_need', label: 'انصراف از خرید', icon: '🤚' },
];

const UserOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelModal, setCancelModal] = useState({ isOpen: false, order: null });
    const [returnModal, setReturnModal] = useState({ isOpen: false, order: null });

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            setOrders(ordersData.orders || []);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const fuse = useMemo(() => {
        return new Fuse(orders, {
            keys: ['id', 'customer.name', 'amount', 'trackingCode'],
            threshold: 0.3,
            minMatchCharLength: 2,
        });
    }, [orders]);

    const filteredOrders = useMemo(() => {
        let result = searchQuery.trim()
            ? fuse.search(searchQuery.trim()).map(r => r.item)
            : [...orders];

        if (statusFilter !== 'all') {
            result = result.filter(o => o.status === statusFilter);
        }

        switch (sortBy) {
            case 'oldest': result.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
            case 'amount-desc':
                result.sort((a, b) => parseInt(b.amount?.replace(/[^\d]/g, '') || '0') - parseInt(a.amount?.replace(/[^\d]/g, '') || '0'));
                break;
            case 'amount-asc':
                result.sort((a, b) => parseInt(a.amount?.replace(/[^\d]/g, '') || '0') - parseInt(b.amount?.replace(/[^\d]/g, '') || '0'));
                break;
            default: result.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        return result;
    }, [orders, searchQuery, statusFilter, sortBy, fuse]);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, sortBy]);

    const handleCancelOrder = (orderId) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
        toast.success('سفارش با موفقیت لغو شد');
        setCancelModal({ isOpen: false, order: null });
    };

    const handleReturnWithReason = (reason) => {
        if (!returnModal.order) return;
        navigate(`/user/returns/new?orderId=${returnModal.order.id}&reason=${reason}`);
        setReturnModal({ isOpen: false, order: null });
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">سفارشات من</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{filteredOrders.length} سفارش</p>
            </div>

            <OrdersFilterBar
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                sortBy={sortBy} setSortBy={setSortBy}
            />

            <OrdersList
                isLoading={isLoading}
                orders={paginatedOrders}
                onView={(order) => setSelectedOrder(order)}
                onCancel={(order) => setCancelModal({ isOpen: true, order })}
                onReturn={(order) => setReturnModal({ isOpen: true, order })}
            />

            {!isLoading && filteredOrders.length > ITEMS_PER_PAGE && (
                <ProductsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <OrderDetailsModal
                isOpen={!!selectedOrder}
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />

            {cancelModal.isOpen && (
                <CancelOrderModal
                    order={cancelModal.order}
                    onClose={() => setCancelModal({ isOpen: false, order: null })}
                    onConfirm={() => handleCancelOrder(cancelModal.order.id)}
                />
            )}

            {returnModal.isOpen && (
                <ReturnReasonModal
                    order={returnModal.order}
                    onClose={() => setReturnModal({ isOpen: false, order: null })}
                    onSelectReason={handleReturnWithReason}
                />
            )}
        </div>
    );
};

// =============================================================================
// Cancel Order Modal
// =============================================================================
const CancelOrderModal = ({ order, onClose, onConfirm }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">لغو سفارش</h3>
            </div>
            <div className="p-5">
                <p className="text-gray-700 dark:text-gray-300">آیا از لغو سفارش <strong>{order?.id}</strong> اطمینان دارید؟</p>
                <p className="text-sm text-gray-500 mt-2">این عملیات قابل بازگشت نیست.</p>
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">انصراف</button>
                <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition">لغو سفارش</button>
            </div>
        </div>
    </div>
);

// =============================================================================
// Return Reason Modal
// =============================================================================
const ReturnReasonModal = ({ order, onClose, onSelectReason }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="relative w-full max-w-md bg-white dark:bg-[#111] rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">درخواست مرجوعی</h3>
                    <p className="text-xs text-gray-500 mt-0.5">سفارش: {order?.id}</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><X size={18} /></button>
            </div>

            <div className="p-5">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">لطفاً دلیل مرجوع کردن کالا را انتخاب کنید:</p>
                <div className="space-y-2">
                    {reasonsList.map(reason => (
                        <button
                            key={reason.id}
                            onClick={() => onSelectReason(reason.id)}
                            className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 text-right hover:border-[#002874]/30 dark:hover:border-[#4C6FB6]/30 hover:bg-[#002874]/5 dark:hover:bg-[#4C6FB6]/10 transition-all"
                        >
                            <span className="text-xl">{reason.icon}</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{reason.label}</span>
                            <ChevronLeft size={16} className="mr-auto text-gray-400" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default UserOrders;