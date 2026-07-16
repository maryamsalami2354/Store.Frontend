import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { toast } from 'react-toastify';
import { X, ChevronLeft } from 'react-feather';
import OrdersFilterBar from './ordersFilterBar';
import OrdersList from './ordersList';
import OrderDetailsModal from './orderDetailsModal';
import ProductsPagination from '../../seller/sellerProducts/productsPagination';
import { getMyOrders } from '../../../services/orderApi.js';

const ITEMS_PER_PAGE = 10;

const reasonsList = [
    { id: 'damaged', label: 'کالا آسیب دیده', icon: '📦' },
    { id: 'not_match', label: 'مغایرت با توضیحات', icon: '!' },
    { id: 'quality', label: 'کیفیت نامناسب', icon: '-' },
    { id: 'wrong_item', label: 'ارسال کالای اشتباه', icon: '↻' },
    { id: 'no_need', label: 'انصراف از خرید', icon: '×' },
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
    const [returnModal, setReturnModal] = useState({ isOpen: false, order: null });

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const result = await getMyOrders({ page: 1, pageSize: 100 });
                if (isMounted) setOrders(result.orders);
            } catch (error) {
                toast.error(error.message || 'خطا در دریافت سفارش‌ها');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    const fuse = useMemo(() => new Fuse(orders, {
        keys: ['id', 'amount', 'trackingCode', 'recipientName'],
        threshold: 0.3,
        minMatchCharLength: 2,
    }), [orders]);

    const filteredOrders = useMemo(() => {
        let result = searchQuery.trim()
            ? fuse.search(searchQuery.trim()).map(r => r.item)
            : [...orders];

        if (statusFilter !== 'all') {
            result = result.filter(o => o.status === statusFilter);
        }

        switch (sortBy) {
            case 'oldest':
                result.sort((a, b) => new Date(a.deliveryDate || a.date) - new Date(b.deliveryDate || b.date));
                break;
            case 'amount-desc':
                result.sort((a, b) => b.amountValue - a.amountValue);
                break;
            case 'amount-asc':
                result.sort((a, b) => a.amountValue - b.amountValue);
                break;
            default:
                result.sort((a, b) => b.id - a.id);
        }

        return result;
    }, [orders, searchQuery, statusFilter, sortBy, fuse]);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, sortBy]);

    const handleReturnWithReason = (reason) => {
        if (!returnModal.order) return;
        navigate(`/user/returns/new?orderId=${returnModal.order.id}&reason=${reason}`);
        setReturnModal({ isOpen: false, order: null });
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">سفارشات من</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{filteredOrders.length.toLocaleString('fa-IR')} سفارش</p>
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
                onCancel={() => toast.info('لغو سفارش از پنل کاربر فعلاً فعال نیست')}
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
