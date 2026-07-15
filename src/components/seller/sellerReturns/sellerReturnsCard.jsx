// =============================================================================
// FILE: sellerReturnsCard.jsx
// =============================================================================
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Eye } from 'react-feather';
import 'react-lazy-load-image-component/src/effects/blur.css';

const SellerReturnsCard = ({ returnData, statusMap, onView }) => {
    const st = statusMap[returnData.status] || statusMap.pending;

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 min-w-[64px] min-h-[64px] flex-shrink-0 rounded-xl bg-gray-50 dark:bg-gray-800 p-2 flex items-center justify-center overflow-hidden">
                    <LazyLoadImage
                        src={returnData.product.image}
                        alt={returnData.product.name}
                        effect="blur"
                        wrapperClassName="w-full h-full flex items-center justify-center"
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
                <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{returnData.product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">مشتری: {returnData.customer}</p>
                            <p className="text-xs text-gray-400">{returnData.trackingCode} | {returnData.requestDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${st.color}`}>{st.label}</span>
                            {returnData.status === 'pending' && (
                                <button onClick={onView} className="p-2 rounded-lg bg-[#002874] text-white hover:bg-[#001d5a] transition-colors">
                                    <Eye size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>دلیل: {returnData.reason}</span>
                        <span className="font-bold text-gray-700 dark:text-gray-300">{returnData.refundAmount} تومان</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerReturnsCard;