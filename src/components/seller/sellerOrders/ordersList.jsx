// src/components/seller/sellerOrders/ordersList.jsx
import React from 'react';
import OrderCard from './orderCard';

// اسکلتون جدول
const TableSkeleton = () => (
    <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">کد سفارش</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">مشتری</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">تاریخ</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">مبلغ</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">وضعیت</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">عملیات</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                        <td className="px-4 py-3"><div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" /></td>
                        <td className="px-4 py-3"><div className="flex justify-center gap-1"><div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" /><div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" /></div></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

// اسکلتون موبایل
const MobileSkeleton = () => (
    <div className="md:hidden space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="flex-1">
                        <div className="flex justify-between mb-2">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                        </div>
                        <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
                        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-3" />
                        <div className="flex justify-between">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                            <div className="flex gap-1">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const OrdersList = ({ isLoading, orders, selectedOrders, onSelectAll, onSelectOrder, onView, onStatusChange }) => {
    const allSelected = orders.length > 0 && orders.every(o => selectedOrders.includes(o.id));
    const someSelected = orders.some(o => selectedOrders.includes(o.id)) && !allSelected;

    if (isLoading) {
        return (
            <>
                <TableSkeleton />
                <MobileSkeleton />
            </>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">سفارشی یافت نشد</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-right">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={el => el && (el.indeterminate = someSelected)}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#002874]  focus:ring-[#002874]"
                                />
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">کد سفارش</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">مشتری</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">تاریخ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">مبلغ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">وضعیت</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">عملیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {orders.map(order => (
                            <OrderCard
                                key={order.id}
                                variant="row"
                                order={order}
                                selected={selectedOrders.includes(order.id)}
                                onSelect={(checked) => onSelectOrder(order.id, checked)}
                                onView={onView}
                                onStatusChange={onStatusChange}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {orders.map(order => (
                    <OrderCard
                        key={order.id}
                        variant="card"
                        order={order}
                        selected={selectedOrders.includes(order.id)}
                        onSelect={(checked) => onSelectOrder(order.id, checked)}
                        onView={onView}
                        onStatusChange={onStatusChange}
                    />
                ))}
            </div>
        </>
    );
};

export default OrdersList;