// =============================================================================
// FILE: sellerProfileReviews.jsx
// =============================================================================
import React from 'react';
import { Star, User } from 'react-feather';

const SellerProfileReviews = ({ reviews = [] }) => (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Star size={18} className="text-amber-400 fill-amber-400" />
            نظرات مشتریان
        </h3>

        {reviews.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">هنوز نظری ثبت نشده است.</p>
        ) : (
            <div className="space-y-4">
                {reviews.map(review => (
                    <div key={review.id} className="pb-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#002874]/10 dark:bg-[#4C6FB6]/20 flex items-center justify-center text-[#002874] dark:text-[#4C6FB6] font-bold text-xs">
                                {review.avatar ? <img src={review.avatar} alt={review.user} className="w-full h-full rounded-full object-cover" /> : review.user[0]}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{review.user}</p>
                                <div className="flex items-center gap-0.5">
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} size={10} className={i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                                    ))}
                                    <span className="text-[10px] text-gray-400 mr-1">{review.date}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{review.text}</p>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default SellerProfileReviews;