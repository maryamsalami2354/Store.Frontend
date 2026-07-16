import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import OrdersFilterBar from './ordersFilterBar';
import OrdersList from './ordersList';
import OrdersSummaryCards from './ordersSummaryCards';
import OrderDetailsModal from './orderDetailsModal';
import ProductsPagination from '../sellerProducts/productsPagination';
import { getAdminOrders, updateOrderStatus } from '../../../services/orderApi.js';

const ITEMS_PER_PAGE = 10;

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const loadOrders = async () => {
            setIsLoading(true);
            try {
                const result = await getAdminOrders({ page: 1, pageSize: 200 });
                if (isMounted) setOrders(result.orders);
            } catch (error) {
                toast.error(error.message || 'خطا در دریافت سفارش‌ها');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadOrders();

        return () => {
            isMounted = false;
        };
    }, []);

    const summary = useMemo(() => ({
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        revenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amountValue, 0),
    }), [orders]);

    const filteredAndSortedOrders = useMemo(() => {
        let result = [...orders];

        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            result = result.filter(o =>
                String(o.id).includes(query) ||
                o.trackingCode?.toLowerCase().includes(query) ||
                o.customer?.name?.toLowerCase().includes(query) ||
                o.customer?.phone?.includes(query)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(o => o.status === statusFilter);
        }

        switch (sortBy) {
            case 'oldest':
                result.sort((a, b) => a.id - b.id);
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
    }, [orders, searchQuery, statusFilter, sortBy]);

    const totalPages = Math.ceil(filteredAndSortedOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = filteredAndSortedOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, sortBy]);

    const handleStatusChange = async (orderId, newStatus) => {
        const previousOrders = orders;
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setSelectedOrder(prev => prev?.id === orderId ? { ...prev, status: newStatus } : prev);

        try {
            await updateOrderStatus(orderId, newStatus);
            toast.success('وضعیت سفارش به‌روزرسانی شد');
        } catch (error) {
            setOrders(previousOrders);
            toast.error(error.message || 'خطا در تغییر وضعیت سفارش');
        }
    };

    const handleBulkStatusChange = async (newStatus) => {
        for (const orderId of selectedOrders) {
            await handleStatusChange(orderId, newStatus);
        }
        setSelectedOrders([]);
    };

    const handleSelectAll = (checked) => {
        setSelectedOrders(checked ? paginatedOrders.map(o => o.id) : []);
    };

    const handleSelectOrder = (orderId, checked) => {
        setSelectedOrders(prev =>
            checked ? [...prev, orderId] : prev.filter(id => id !== orderId)
        );
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    مدیریت سفارشات
                </h1>
            </div>

            <OrdersSummaryCards summary={summary} isLoading={isLoading} />

            <OrdersFilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <OrdersList
                isLoading={isLoading}
                orders={paginatedOrders}
                selectedOrders={selectedOrders}
                onSelectAll={handleSelectAll}
                onSelectOrder={handleSelectOrder}
                onView={setSelectedOrder}
                onStatusChange={handleStatusChange}
            />

            {!isLoading && filteredAndSortedOrders.length > 0 && (
                <ProductsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {selectedOrders.length > 0 && (
                <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-40 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-3 flex flex-wrap items-center justify-between gap-3 max-w-2xl md:max-w-3xl mx-auto">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedOrders.length.toLocaleString('fa-IR')} سفارش انتخاب شده
                    </span>
                    <div className="flex items-center gap-2">
                        <select
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                            onChange={(e) => e.target.value && handleBulkStatusChange(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>تغییر وضعیت گروهی</option>
                            <option value="processing">در انتظار ارسال</option>
                            <option value="shipped">ارسال سفارش</option>
                            <option value="completed">تحویل داده شد</option>
                            <option value="cancelled">لغو شده</option>
                        </select>
                        <button
                            onClick={() => setSelectedOrders([])}
                            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                        >
                            لغو انتخاب
                        </button>
                    </div>
                </div>
            )}

            <OrderDetailsModal
                isOpen={!!selectedOrder}
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onStatusChange={handleStatusChange}
                onAddNote={() => toast.info('یادداشت سفارش فعلاً فقط در همین نشست نمایش داده می‌شود')}
            />
        </div>
    );
};

export default SellerOrders;
