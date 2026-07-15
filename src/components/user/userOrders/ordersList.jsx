// =============================================================================
// FILE: ordersList.jsx (اصلاح‌شده - onReturn اضافه شد)
// =============================================================================
import React from 'react';
import OrderCard from './orderCard';

const TableSkeleton = () => (
    <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
                {['کد سفارش', 'تاریخ', 'مبلغ', 'وضعیت', 'عملیات'].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-right text-xs font-medium text-gray-500">{h}</th>
                ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {[...Array(5)].map((_, i) => (
                <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className={`h-4 ${j === 3 ? 'w-16 rounded-full' : 'w-20'} bg-gray-200 dark:bg-gray-800 rounded animate-pulse`} /></td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

const MobileSkeleton = () => (
    <div className="md:hidden space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex justify-between mb-3"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /><div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" /></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
                <div className="flex justify-end gap-1"><div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" /><div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg" /></div>
            </div>
        ))}
    </div>
);

const OrdersList = ({ isLoading, orders, onView, onCancel, onReturn }) => {
    if (isLoading) return <><TableSkeleton /><MobileSkeleton /></>;
    if (!orders.length) return <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center"><p className="text-gray-500">سفارشی یافت نشد</p></div>;

    return (
        <>
            <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">کد سفارش</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">تاریخ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">مبلغ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">عملیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {orders.map(order => (
                            <OrderCard key={order.id} variant="row" order={order} onView={onView} onCancel={onCancel} onReturn={onReturn} />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="md:hidden space-y-4">
                {orders.map(order => (
                    <OrderCard key={order.id} variant="card" order={order} onView={onView} onCancel={onCancel} onReturn={onReturn} />
                ))}
            </div>
        </>
    );
};

export default OrdersList;