// =============================================================================
// FILE: reviewCard.jsx (اصلاح‌شده - whitespace-nowrap + flex-shrink-0)
// =============================================================================
import React from 'react';
import { Star, CheckCircle, XCircle, Eye, MessageCircle, Clock } from 'react-feather';

const statusConfig = {
    approved: { label: 'تأیید شده', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    pending: { label: 'در انتظار', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    rejected: { label: 'رد شده', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

const ReviewCard = ({ variant, review, onStatusChange, onReply, onView }) => {
    const status = statusConfig[review.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    if (variant === 'row') {
        return (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{review.customer.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{review.productName}</td>
                <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(i => (
                            <Star key={i} size={14} className={i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                        ))}
                    </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{review.text}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{review.date}</td>
                <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${status.color}`}>
                        <StatusIcon size={12} /> {status.label}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onView(review)} className="p-2 rounded-lg text-gray-500 hover:text-[#002874] dark:hover:text-[#4C6FB6] hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="مشاهده"><Eye size={16} /></button>
                        <button onClick={() => onReply(review)} className="p-2 rounded-lg text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="پاسخ"><MessageCircle size={16} /></button>
                        {review.status === 'pending' && (
                            <div className="flex items-center gap-1">
                                <button onClick={() => onStatusChange(review.id, 'approved')} className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition" title="تأیید"><CheckCircle size={16} /></button>
                                <button onClick={() => onStatusChange(review.id, 'rejected')} className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="رد"><XCircle size={16} /></button>
                            </div>
                        )}
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
                <img src={review.customer.avatar} className="w-10 h-10 rounded-full" alt="" />
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{review.customer.name}</p>
                    <p className="text-xs text-gray-500 truncate">{review.date} - {review.productName}</p>
                </div>
            </div>
            <div className="flex items-center gap-0.5 mb-2">
                {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} className={i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{review.text}</p>
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${status.color}`}>
                    <StatusIcon size={12} /> {status.label}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => onView(review)} className="p-2 rounded-lg text-gray-500 hover:text-[#002874] dark:hover:text-[#4C6FB6]"><Eye size={16} /></button>
                    <button onClick={() => onReply(review)} className="p-2 rounded-lg text-gray-500 hover:text-blue-600"><MessageCircle size={16} /></button>
                    {review.status === 'pending' && (
                        <div className="flex items-center gap-1">
                            <button onClick={() => onStatusChange(review.id, 'approved')} className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"><CheckCircle size={16} /></button>
                            <button onClick={() => onStatusChange(review.id, 'rejected')} className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><XCircle size={16} /></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;