import React from 'react';
import { Eye, ChevronDown } from 'react-feather';

const statusConfig = {
    pending: { label: 'در انتظار پرداخت', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    processing: { label: 'در انتظار ارسال', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    shipped: { label: 'ارسال سفارش', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    completed: { label: 'تحویل داده شد', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    cancelled: { label: 'لغو شده', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const nextStatusMap = {
    pending: 'processing',
    processing: 'shipped',
    shipped: 'completed',
};

const OrderCard = ({ variant, order, selected, onSelect, onView, onStatusChange }) => {
    const status = statusConfig[order.status] || statusConfig.pending;
    const nextStatus = nextStatusMap[order.status];

    if (variant === 'row') {
        return (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                <td className="px-4 py-3">
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => onSelect(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#002874] focus:ring-[#002874]"
                    />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-[#002874] dark:text-[#4C6FB6]">{order.id}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{order.customer?.name || 'مشتری'}</td>
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{order.date}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{order.amount} تومان</td>
                <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                        <button
                            onClick={() => onView(order)}
                            className="p-2 rounded-lg text-gray-500 hover:text-[#002874] dark:text-gray-400 dark:hover:text-[#4C6FB6] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            title="مشاهده جزئیات"
                        >
                            <Eye size={16} />
                        </button>
                        {nextStatus ? (
                            <button
                                onClick={() => onStatusChange(order.id, nextStatus)}
                                className="p-2 rounded-lg text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                title={`تغییر به ${statusConfig[nextStatus]?.label || nextStatus}`}
                            >
                                <ChevronDown size={16} />
                            </button>
                        ) : (
                            <span className="px-2 text-sm text-gray-400 dark:text-gray-600">--</span>
                        )}
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => onSelect(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#002874] focus:ring-[#002874]"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#002874] dark:text-[#4C6FB6]">{order.id}</span>
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{order.customer?.name || 'مشتری'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{order.customer?.phone || '---'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{order.date}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{order.amount} تومان</span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onView(order)}
                                className="p-2 rounded-lg text-gray-500 hover:text-[#002874] dark:text-gray-400 dark:hover:text-[#4C6FB6] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                <Eye size={16} />
                            </button>
                            {nextStatus && (
                                <button
                                    onClick={() => onStatusChange(order.id, nextStatus)}
                                    className="p-2 rounded-lg text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                >
                                    <ChevronDown size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
