import React from 'react';
import { Eye, XCircle, RotateCcw } from 'react-feather';

const statusConfig = {
    pending: { label: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    processing: { label: 'در انتظار ارسال', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    shipped: { label: 'ارسال سفارش', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    completed: { label: 'تحویل داده شد', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const OrderCard = ({ variant, order, onView, onCancel, onReturn }) => {
    const status = statusConfig[order.status] || statusConfig.pending;
    const canCancel = order.status === 'pending';
    const canReturn = order.status === 'completed';

    if (variant === 'row') {
        return (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                <td className="px-4 py-3 text-sm font-medium text-[#002874] dark:text-[#4C6FB6]">{order.id}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{order.date}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{order.amount} تومان</td>
                <td className="px-4 py-3"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span></td>
                <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onView(order)} className="p-2 rounded-lg text-gray-500 hover:text-[#002874] hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="مشاهده"><Eye size={16} /></button>
                        {canCancel && (
                            <button onClick={() => onCancel(order)} className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="لغو"><XCircle size={16} /></button>
                        )}
                        {canReturn && (
                            <button onClick={() => onReturn(order)} className="p-2 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition" title="درخواست مرجوعی">
                                <RotateCcw size={16} />
                            </button>
                        )}
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#002874] dark:text-[#4C6FB6]">{order.id}</span>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{order.date}</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{order.amount} تومان</span>
            </div>
            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button onClick={() => onView(order)} className="flex-1 py-2 rounded-lg text-gray-500 hover:text-[#002874] hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-1"><Eye size={14} /> مشاهده</button>
                {canCancel && (
                    <button onClick={() => onCancel(order)} className="flex-1 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center gap-1"><XCircle size={14} /> لغو</button>
                )}
                {canReturn && (
                    <button onClick={() => onReturn(order)} className="flex-1 py-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition flex items-center justify-center gap-1">
                        <RotateCcw size={14} /> مرجوعی
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderCard;
