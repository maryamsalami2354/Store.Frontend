// src/components/seller/sellerInventory/inventoryList.jsx
import React from 'react';
import InventoryCard from './inventoryCard';

const TableSkeleton = () => (
    <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                    {['محصول', 'کد', 'موجودی', 'حداقل', 'وضعیت', 'آخرین بروزرسانی', 'عملیات'].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-right text-xs font-medium text-gray-500">{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                        {[...Array(7)].map((_, j) => (
                            <td key={j} className="px-4 py-3"><div className={`h-4 ${j === 2 || j === 3 ? 'w-12' : j === 4 ? 'w-16 rounded-full' : 'w-20'} bg-gray-200 dark:bg-gray-800 rounded animate-pulse`} /></td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

const MobileSkeleton = () => (
    <div className="md:hidden space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                    <div className="flex-1"><div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" /><div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></div>
                </div>
                <div className="flex items-center justify-between"><div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" /><div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" /></div>
            </div>
        ))}
    </div>
);

const InventoryList = ({ isLoading, products, onAdjust }) => {
    if (isLoading) return <><TableSkeleton /><MobileSkeleton /></>;
    if (!products.length) return <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center"><p className="text-gray-500">محصولی یافت نشد</p></div>;

    return (
        <>
            <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">محصول</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">کد</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">موجودی</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">حداقل</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">آخرین بروزرسانی</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">عملیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {products.map(product => (
                            <InventoryCard key={product.id} variant="row" product={product} onAdjust={onAdjust} />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="md:hidden space-y-4">
                {products.map(product => (
                    <InventoryCard key={product.id} variant="card" product={product} onAdjust={onAdjust} />
                ))}
            </div>
        </>
    );
};

export default InventoryList;