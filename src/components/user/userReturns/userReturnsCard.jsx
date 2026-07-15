// =============================================================================
// FILE: userReturnsCard.jsx (کامل - با LazyLoadImage)
// =============================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ChevronLeft, XCircle } from 'react-feather';
import 'react-lazy-load-image-component/src/effects/blur.css';

const UserReturnsCard = ({ returnData, statusMap, onCancel }) => {
    const st = statusMap[returnData.status] || statusMap.pending;

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row items-start gap-4">

                {/* Product Image */}
                <Link
                    to={`/product/${returnData.product.id}`}
                    className="w-20 h-20 min-w-[80px] min-h-[80px] flex-shrink-0 rounded-xl bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-center overflow-hidden"
                >
                    <LazyLoadImage
                        src={returnData.product.image}
                        alt={returnData.product.name}
                        effect="blur"
                        wrapperClassName="w-full h-full flex items-center justify-center"
                        className="max-w-full max-h-full object-contain"
                    />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <Link to={`/product/${returnData.product.id}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#002874] dark:hover:text-[#4C6FB6] transition-colors line-clamp-1">
                                {returnData.product.name}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">کد پیگیری: {returnData.trackingCode}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${st.color}`}>
              {st.label}
            </span>
                    </div>

                    <div className="flex flex-wrap items-end justify-between mt-3 gap-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                            <p>تاریخ درخواست: {returnData.requestDate}</p>
                            <p>دلیل: {returnData.reason}</p>
                            <p className="font-bold text-gray-700 dark:text-gray-300">مبلغ: {returnData.refundAmount} تومان</p>
                        </div>

                        <div className="flex items-center gap-2">
                            {returnData.status === 'pending' && (
                                <button
                                    onClick={onCancel}
                                    className="flex items-center gap-1 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <XCircle size={14} />
                                    لغو درخواست
                                </button>
                            )}
                            <Link
                                to={`/user/returns/${returnData.id}`}
                                className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                جزئیات
                                <ChevronLeft size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserReturnsCard;