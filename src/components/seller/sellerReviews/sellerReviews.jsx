// src/components/seller/sellerReviews/sellerReviews.jsx
import React, { useState, useEffect } from 'react';
import { X, Star } from 'react-feather';
import { toast } from 'react-toastify';
import ReviewsSummaryCards from './reviewsSummaryCards';
import ReviewsFilterBar from './reviewsFilterBar';
import ReviewsList from './reviewsList';
import ReviewReplyModal from './reviewReplyModal';
import reviewsData from '../../../../public/jsons/reviews.json';

const SellerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [replyModal, setReplyModal] = useState({ isOpen: false, review: null });
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            // بررسی ساختار JSON
            const loadedReviews = reviewsData.reviews || reviewsData.reviewsData || reviewsData || [];
            setReviews(loadedReviews);
            setSummary(reviewsData.summary || {
                total: loadedReviews.length,
                averageRating: loadedReviews.reduce((acc, r) => acc + r.rating, 0) / loadedReviews.length,
                pending: loadedReviews.filter(r => r.status === 'pending').length,
                approved: loadedReviews.filter(r => r.status === 'approved').length,
                rejected: loadedReviews.filter(r => r.status === 'rejected').length,
                withImages: loadedReviews.filter(r => r.images?.length > 0).length,
            });
            setIsLoading(false);
        };
        loadData();
    }, []);

    // فیلتر و مرتب‌سازی
    const filteredReviews = reviews.filter(review => {
        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            if (!review.customer.name.toLowerCase().includes(query) &&
                !review.productName.toLowerCase().includes(query) &&
                !review.text.toLowerCase().includes(query)) {
                return false;
            }
        }
        if (statusFilter !== 'all' && review.status !== statusFilter) return false;
        if (ratingFilter !== 'all' && Math.floor(review.rating) !== parseInt(ratingFilter)) return false;
        return true;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'oldest': return new Date(a.date) - new Date(b.date);
            case 'rating-desc': return b.rating - a.rating;
            case 'rating-asc': return a.rating - b.rating;
            default: return new Date(b.date) - new Date(a.date);
        }
    });

    const handleStatusChange = (reviewId, newStatus) => {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
        toast.success(`نظر ${newStatus === 'approved' ? 'تأیید' : 'رد'} شد`);
    };

    const handleReply = (reviewId, replyText) => {
        setReviews(prev => prev.map(r => r.id === reviewId ? {
            ...r,
            reply: { text: replyText, date: new Date().toLocaleDateString('fa-IR'), author: 'فروشنده' }
        } : r));
        toast.success('پاسخ با موفقیت ثبت شد');
    };

    const ReviewDetailModal = ({ review, onClose }) => {
        if (!review) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
                <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#111] rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">جزئیات نظر</h3>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <img src={review.customer.avatar} className="w-12 h-12 rounded-full" alt="" />
                            <div>
                                <p className="font-medium">{review.customer.name}</p>
                                <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(i => (
                                <Star key={i} size={18} className={i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                            ))}
                            <span className="text-sm font-medium mr-2">{review.rating}</span>
                        </div>
                        <h4 className="font-bold">{review.title}</h4>
                        <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
                        {review.images?.length > 0 && (
                            <div className="flex gap-2">
                                {review.images.map((img, i) => (
                                    <img key={i} src={img} className="w-20 h-20 object-cover rounded-lg" alt="" />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">مدیریت نظرات</h1>
            </div>

            <ReviewsSummaryCards summary={summary} isLoading={isLoading} />

            <ReviewsFilterBar
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                ratingFilter={ratingFilter} setRatingFilter={setRatingFilter}
                sortBy={sortBy} setSortBy={setSortBy}
            />

            <ReviewsList
                isLoading={isLoading}
                reviews={filteredReviews}
                onStatusChange={handleStatusChange}
                onReply={(review) => setReplyModal({ isOpen: true, review })}
                onView={(review) => setSelectedReview(review)}
            />

            <ReviewReplyModal
                isOpen={replyModal.isOpen}
                review={replyModal.review}
                onClose={() => setReplyModal({ isOpen: false, review: null })}
                onReply={handleReply}
            />

            {selectedReview && <ReviewDetailModal review={selectedReview} onClose={() => setSelectedReview(null)} />}
        </div>
    );
};

export default SellerReviews;