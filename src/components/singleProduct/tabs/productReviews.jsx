// src/components/singleProduct/tabs/productReviews.jsx
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, User, Check, X } from 'react-feather';
import { toast } from 'react-toastify';
import reviewsData from '../../../../public/jsons/reviews.json';

// داده‌های ساختگی اضافی برای نظرات
const mockReviews = [
    {
        id: 101,
        customer: { name: 'حسین امیری', avatar: null },
        rating: 4,
        text: 'این گوشی مناسب است و از نظر کیفیت و متریال با مدل‌های مشابه برابری می‌کند. طراحی زیبا و امکانات کامل آن واقعاً راضی‌کننده است.',
        date: '۵ روز پیش',
        isBuyer: true,
        positivePoints: ['قیمت مناسب', 'باتری عالی', 'کیفیت ساخت بالا', 'آنتن‌دهی قوی'],
        negativePoints: ['رابط کاربری ضعیف'],
        likes: 12,
        dislikes: 2,
        color: 'مشکی',
        seller: 'دیجی کالا',
    },
    {
        id: 102,
        customer: { name: 'مریم رضایی', avatar: null },
        rating: 5,
        text: 'این محصول واقعاً عالی است. از خریدم کاملاً راضی هستم و به همه دوستانم توصیه می‌کنم. کیفیت ساخت فوق‌العاده‌ای دارد.',
        date: '۲ روز پیش',
        isBuyer: true,
        positivePoints: ['طراحی شیک و زیبا', 'ارزش خرید بالا', 'خدمات پس از فروش خوب'],
        negativePoints: [],
        likes: 8,
        dislikes: 1,
        color: 'مشکی',
        seller: 'دیجی کالا',
    },
    {
        id: 103,
        customer: { name: 'علی محمدی', avatar: null },
        rating: 3,
        text: 'محصول متوسطی بود. انتظار بیشتری داشتم ولی در کل بد نیست.',
        date: '۱ هفته پیش',
        isBuyer: false,
        positivePoints: ['قیمت مناسب'],
        negativePoints: ['کیفیت متوسط', 'بسته‌بندی ضعیف'],
        likes: 3,
        dislikes: 5,
    },
];

const ProductReviews = ({ productId, productName }) => {
    const [reviews, setReviews] = useState([...mockReviews, ...(reviewsData.reviews || reviewsData.reviewsData || []).filter(r => r.productId === productId)]);
    const [sortBy, setSortBy] = useState('newest');
    const [newReview, setNewReview] = useState({ name: '', email: '', text: '', rating: 5, positiveInput: '', negativeInput: '', positives: [], negatives: [], saveInfo: false });
    const [likedReviews, setLikedReviews] = useState({});
    const [dislikedReviews, setDislikedReviews] = useState({});

    const handleSort = (type) => setSortBy(type);

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'newest') return -1;
        if (sortBy === 'oldest') return 1;
        return 0;
    });

    const handleLike = (reviewId) => {
        if (likedReviews[reviewId]) return;
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r));
        setLikedReviews(prev => ({ ...prev, [reviewId]: true }));
    };

    const handleDislike = (reviewId) => {
        if (dislikedReviews[reviewId]) return;
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, dislikes: (r.dislikes || 0) + 1 } : r));
        setDislikedReviews(prev => ({ ...prev, [reviewId]: true }));
    };

    const handleAddPositiveTag = (e) => {
        if (e.key === 'Enter' && newReview.positiveInput.trim()) {
            e.preventDefault();
            setNewReview(prev => ({
                ...prev,
                positives: [...prev.positives, prev.positiveInput.trim()],
                positiveInput: '',
            }));
        }
    };

    const handleAddNegativeTag = (e) => {
        if (e.key === 'Enter' && newReview.negativeInput.trim()) {
            e.preventDefault();
            setNewReview(prev => ({
                ...prev,
                negatives: [...prev.negatives, prev.negativeInput.trim()],
                negativeInput: '',
            }));
        }
    };

    const removeTag = (type, index) => {
        setNewReview(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index),
        }));
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!newReview.name.trim() || !newReview.text.trim()) {
            toast.error('لطفاً نام و متن نظر را وارد کنید');
            return;
        }
        const review = {
            id: Date.now(),
            customer: { name: newReview.name, avatar: null },
            rating: newReview.rating,
            text: newReview.text,
            date: 'لحظاتی پیش',
            isBuyer: false,
            positivePoints: newReview.positives,
            negativePoints: newReview.negatives,
            likes: 0,
            dislikes: 0,
        };
        setReviews(prev => [review, ...prev]);
        setNewReview({ name: '', email: '', text: '', rating: 5, positiveInput: '', negativeInput: '', positives: [], negatives: [], saveInfo: false });
        toast.success('نظر شما با موفقیت ثبت شد');
    };

    return (
        <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 relative pb-3 before:absolute before:bottom-0 before:right-0 before:h-1 before:w-20 before:bg-[#002874] dark:before:bg-[#4C6FB6] before:rounded">
                نظرات کاربران
            </h2>

            {/* Review Form */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">نظرت در مورد این محصول چیه؟</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input
                            type="text" value={newReview.name} onChange={e => setNewReview(p => ({ ...p, name: e.target.value }))}
                            placeholder="نام و نام خانوادگی"
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                        />
                        <input
                            type="email" value={newReview.email} onChange={e => setNewReview(p => ({ ...p, email: e.target.value }))}
                            placeholder="ایمیل"
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dir-ltr text-left"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <input type="checkbox" checked={newReview.saveInfo} onChange={e => setNewReview(p => ({ ...p, saveInfo: e.target.checked }))} className="rounded" />
                        ذخیره اطلاعات برای نظرات بعدی
                    </label>

                    {/* Rating Stars */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">امتیاز شما:</label>
                        <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(i => (
                                <button type="button" key={i} onClick={() => setNewReview(p => ({ ...p, rating: i }))}>
                                    <Star size={22} className={i <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <textarea
                        value={newReview.text} onChange={e => setNewReview(p => ({ ...p, text: e.target.value }))}
                        placeholder="متن نظر..."
                        rows={4}
                        className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                    />

                    {/* Tags */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">نقاط قوت:</label>
                            <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 min-h-[42px]">
                                {newReview.positives.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 text-xs rounded-full">
                    {tag} <button type="button" onClick={() => removeTag('positives', i)}><X size={12} /></button>
                  </span>
                                ))}
                                <input
                                    type="text" value={newReview.positiveInput} onChange={e => setNewReview(p => ({ ...p, positiveInput: e.target.value }))}
                                    onKeyDown={handleAddPositiveTag}
                                    placeholder="نقطه قوت را وارد کنید و Enter بزنید"
                                    className="flex-1 min-w-[120px] bg-transparent text-sm outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">نقاط ضعف:</label>
                            <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 min-h-[42px]">
                                {newReview.negatives.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 text-xs rounded-full">
                    {tag} <button type="button" onClick={() => removeTag('negatives', i)}><X size={12} /></button>
                  </span>
                                ))}
                                <input
                                    type="text" value={newReview.negativeInput} onChange={e => setNewReview(p => ({ ...p, negativeInput: e.target.value }))}
                                    onKeyDown={handleAddNegativeTag}
                                    placeholder="نقطه ضعف را وارد کنید و Enter بزنید"
                                    className="flex-1 min-w-[120px] bg-transparent text-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="px-8 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition">
                        ثبت نظر
                    </button>
                </form>
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">مرتب‌سازی:</span>
                    <button onClick={() => handleSort('newest')} className={`px-3 py-1.5 rounded-lg text-xs ${sortBy === 'newest' ? 'bg-[#002874] text-white ' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>جدیدترین</button>
                    <button onClick={() => handleSort('oldest')} className={`px-3 py-1.5 rounded-lg text-xs ${sortBy === 'oldest' ? 'bg-[#002874] text-white ' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>قدیمی‌ترین</button>
                </div>
                <span className="text-xs text-gray-500">{reviews.length} نظر</span>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {sortedReviews.map(review => (
                    <div key={review.id} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002874] to-[#4C6FB6] flex items-center justify-center text-white font-bold text-sm">
                                    {review.customer?.name?.[0] || 'م'}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-800 dark:text-white">{review.customer?.name || 'کاربر'}</p>
                                    <p className="text-xs text-gray-500">{review.date}</p>
                                </div>
                            </div>
                            {review.isBuyer && (
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full">خریدار</span>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-0.5 mb-3">
                            {[1,2,3,4,5].map(i => (
                                <Star key={i} size={16} className={i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                            ))}
                        </div>

                        {/* Text */}
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-7 mb-3">{review.text}</p>

                        {/* Pros & Cons */}
                        <div className="space-y-1 mb-4">
                            {review.positivePoints?.map((point, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Check size={14} className="text-green-500 flex-shrink-0" /> {point}
                                </div>
                            ))}
                            {review.negativePoints?.map((point, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <X size={14} className="text-red-500 flex-shrink-0" /> {point}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                {review.seller && <span>🛒 {review.seller}</span>}
                                {review.color && <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-800 border"></span> {review.color}</span>}
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-500">آیا این دیدگاه مفید بود؟</span>
                                <button onClick={() => handleLike(review.id)} className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition">
                                    <ThumbsUp size={14} /> <span className="text-xs">{review.likes || 0}</span>
                                </button>
                                <button onClick={() => handleDislike(review.id)} className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition">
                                    <ThumbsDown size={14} /> <span className="text-xs">{review.dislikes || 0}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductReviews;