// =============================================================================
// FILE: reviewsList.jsx (اصلاح‌شده - متن وضعیت در یک خط)
// =============================================================================
import React from 'react';
import ReviewCard from './reviewCard.jsx';

const TableSkeleton = () => (
    <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                    {['مشتری', 'محصول', 'امتیاز', 'نظر', 'تاریخ', 'وضعیت', 'عملیات'].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-right text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                        {[...Array(7)].map((_, j) => (
                            <td key={j} className="px-4 py-3">
                                <div className={`${j === 3 ? 'h-4 w-40' : j === 0 ? 'h-4 w-24' : j === 5 ? 'h-6 w-16 rounded-full' : 'h-4 w-20'} bg-gray-200 dark:bg-gray-800 rounded animate-pulse`} />
                            </td>
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
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    <div className="flex-1"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" /><div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></div>
                </div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-3" />
                <div className="flex items-center justify-between"><div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" /><div className="flex gap-1"><div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" /><div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" /></div></div>
            </div>
        ))}
    </div>
);

const ReviewsList = ({ isLoading, reviews, onStatusChange, onReply, onView }) => {
    if (isLoading) return <><TableSkeleton /><MobileSkeleton /></>;
    if (!reviews.length) return <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center"><p className="text-gray-500">نظری یافت نشد</p></div>;

    return (
        <>
            <div className="hidden md:block bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 whitespace-nowrap">مشتری</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 whitespace-nowrap">محصول</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 whitespace-nowrap">امتیاز</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 whitespace-nowrap">نظر</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 whitespace-nowrap">تاریخ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 whitespace-nowrap">وضعیت</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 whitespace-nowrap">عملیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {reviews.map(review => (
                            <ReviewCard key={review.id} variant="row" review={review} onStatusChange={onStatusChange} onReply={onReply} onView={onView} />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="md:hidden space-y-4">
                {reviews.map(review => (
                    <ReviewCard key={review.id} variant="card" review={review} onStatusChange={onStatusChange} onReply={onReply} onView={onView} />
                ))}
            </div>
        </>
    );
};

export default ReviewsList;