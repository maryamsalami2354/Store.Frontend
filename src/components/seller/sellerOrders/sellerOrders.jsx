// src/components/seller/sellerOrders/sellerOrders.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import OrdersFilterBar from './ordersFilterBar';
import OrdersList from './ordersList';
import OrdersSummaryCards from './ordersSummaryCards';
import OrderDetailsModal from './orderDetailsModal';
import ProductsPagination from '../sellerProducts/productsPagination';
import ordersData from '../../../../public/jsons/sellerOrders.json';

// تابع تبدیل اعداد فارسی به انگلیسی
const toEnglishDigits = (str) => {
    if (!str) return '';
    const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = str;
    persian.forEach((p, i) => result = result.replace(new RegExp(p, 'g'), english[i]));
    return result;
};

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
    const [summary, setSummary] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        cancelled: 0,
        revenue: 0
    });

    useEffect(() => {
        const loadOrders = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            setOrders(ordersData.orders || []);
            setSummary(ordersData.summary || {
                total: ordersData.orders?.length || 0,
                pending: ordersData.orders?.filter(o => o.status === 'pending').length || 0,
                processing: ordersData.orders?.filter(o => o.status === 'processing').length || 0,
                completed: ordersData.orders?.filter(o => o.status === 'completed').length || 0,
                cancelled: ordersData.orders?.filter(o => o.status === 'cancelled').length || 0,
                revenue: ordersData.orders?.filter(o => o.status === 'completed')
                    .reduce((sum, o) => sum + parseInt(toEnglishDigits(o.amount || '0').replace(/[^\d]/g, '')), 0) || 0
            });
            setIsLoading(false);
        };
        loadOrders();
    }, []);

    const filteredAndSortedOrders = useMemo(() => {
        let result = [...orders];

        // جستجو
        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            result = result.filter(o =>
                o.id.toLowerCase().includes(query) ||
                o.customer.name.toLowerCase().includes(query) ||
                o.customer.phone?.includes(query) ||
                o.customer.email?.toLowerCase().includes(query)
            );
        }

        // فیلتر وضعیت
        if (statusFilter !== 'all') {
            result = result.filter(o => o.status === statusFilter);
        }

        // مرتب‌سازی
        switch (sortBy) {
            case 'oldest':
                result.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'amount-desc':
                result.sort((a, b) => {
                    const aVal = parseInt(toEnglishDigits(a.amount || '0').replace(/[^\d]/g, ''));
                    const bVal = parseInt(toEnglishDigits(b.amount || '0').replace(/[^\d]/g, ''));
                    return bVal - aVal;
                });
                break;
            case 'amount-asc':
                result.sort((a, b) => {
                    const aVal = parseInt(toEnglishDigits(a.amount || '0').replace(/[^\d]/g, ''));
                    const bVal = parseInt(toEnglishDigits(b.amount || '0').replace(/[^\d]/g, ''));
                    return aVal - bVal;
                });
                break;
            default: // newest
                result.sort((a, b) => new Date(b.date) - new Date(a.date));
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

    const handleViewOrder = (order) => setSelectedOrder(order);
    const handleCloseModal = () => setSelectedOrder(null);

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
        ));
        toast.success(`وضعیت سفارش به "${newStatus}" تغییر یافت`);
    };

    const handleBulkStatusChange = (newStatus) => {
        setOrders(prev => prev.map(o =>
            selectedOrders.includes(o.id) ? { ...o, status: newStatus } : o
        ));
        toast.success(`${selectedOrders.length} سفارش به وضعیت "${newStatus}" تغییر یافت`);
        setSelectedOrders([]);
    };

    const handleAddNote = (orderId, note) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId
                ? { ...o, notes: [...(o.notes || []), { ...note, date: new Date().toLocaleDateString('fa-IR') }] }
                : o
        ));
        toast.success('یادداشت با موفقیت اضافه شد');
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
                onView={handleViewOrder}
                onStatusChange={handleStatusChange}
            />

            {!isLoading && filteredAndSortedOrders.length > 0 && (
                <ProductsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* نوار عملیات گروهی */}
            {selectedOrders.length > 0 && (
                <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-40 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-3 flex flex-wrap items-center justify-between gap-3 max-w-2xl md:max-w-3xl mx-auto">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {selectedOrders.length} سفارش انتخاب شده
          </span>
                    <div className="flex items-center gap-2">
                        <select
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                            onChange={(e) => e.target.value && handleBulkStatusChange(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>تغییر وضعیت گروهی</option>
                            <option value="pending">در انتظار</option>
                            <option value="processing">در حال پردازش</option>
                            <option value="shipped">ارسال شده</option>
                            <option value="completed">تکمیل شده</option>
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
                onClose={handleCloseModal}
                onStatusChange={handleStatusChange}
                onAddNote={handleAddNote}
            />
        </div>
    );
};

export default SellerOrders;