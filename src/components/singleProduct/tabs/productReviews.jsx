import React, { useEffect, useMemo, useState } from 'react';
import { Star, User, MessageCircle } from 'react-feather';
import { toast } from 'react-toastify';
import { getProductReviews, submitProductReview } from '../../../services/productInteractionApi.js';
import useStore from '../../../store/index.js';

const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('fa-IR');
};

const ProductReviews = ({ productId }) => {
    const accessToken = useStore((state) => state.accessToken);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [form, setForm] = useState({ title: '', description: '', score: 5 });

    const loadReviews = async () => {
        if (!productId) return;
        setIsLoading(true);
        try {
            setReviews(await getProductReviews(productId));
        } catch (error) {
            toast.error(error.message || 'خطا در دریافت دیدگاه‌ها');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const sortedReviews = useMemo(() => {
        return [...reviews].sort((a, b) => {
            const first = new Date(a.createdAt || 0).getTime();
            const second = new Date(b.createdAt || 0).getTime();
            return sortBy === 'newest' ? second - first : first - second;
        });
    }, [reviews, sortBy]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!accessToken) {
            toast.error('برای ثبت دیدگاه ابتدا وارد حساب کاربری شوید');
            return;
        }

        if (!form.description.trim()) {
            toast.error('متن دیدگاه را وارد کنید');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitProductReview(productId, {
                title: form.title.trim(),
                description: form.description.trim(),
                score: Number(form.score),
            });
            setForm({ title: '', description: '', score: 5 });
            toast.success(result?.message || 'دیدگاه شما پس از تایید مدیر نمایش داده می‌شود');
        } catch (error) {
            toast.error(error.message || 'خطا در ثبت دیدگاه');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="relative mb-6 pb-3 text-xl font-extrabold text-gray-900 before:absolute before:bottom-0 before:right-0 before:h-1 before:w-20 before:rounded before:bg-[#002874] dark:text-white dark:before:bg-[#4C6FB6]">
                دیدگاه کاربران
            </h2>

            <div className="mb-6 rounded-lg bg-gray-50 p-5 dark:bg-gray-900/50">
                <h3 className="mb-4 font-bold text-gray-900 dark:text-white">دیدگاهت درباره این محصول چیست؟</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={form.title}
                        onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                        placeholder="عنوان دیدگاه"
                        className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">امتیاز شما:</label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <button key={item} type="button" onClick={() => setForm((prev) => ({ ...prev, score: item }))}>
                                    <Star size={22} className={item <= form.score ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <textarea
                        value={form.description}
                        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                        placeholder="متن دیدگاه..."
                        rows={4}
                        className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-[#002874] px-8 py-2.5 text-sm font-medium text-white transition hover:bg-[#001d5a] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'در حال ثبت...' : 'ثبت دیدگاه'}
                    </button>
                    <p className="text-xs text-gray-500">دیدگاه بعد از تایید مدیر زیر محصول نمایش داده می‌شود.</p>
                </form>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">مرتب‌سازی:</span>
                    <button onClick={() => setSortBy('newest')} className={`rounded-lg px-3 py-1.5 text-xs ${sortBy === 'newest' ? 'bg-[#002874] text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'}`}>جدیدترین</button>
                    <button onClick={() => setSortBy('oldest')} className={`rounded-lg px-3 py-1.5 text-xs ${sortBy === 'oldest' ? 'bg-[#002874] text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'}`}>قدیمی‌ترین</button>
                </div>
                <span className="text-xs text-gray-500">{reviews.length.toLocaleString('fa-IR')} دیدگاه تاییدشده</span>
            </div>

            {isLoading ? (
                <div className="rounded-lg border border-gray-200 p-5 text-sm text-gray-500 dark:border-gray-800">در حال دریافت دیدگاه‌ها...</div>
            ) : sortedReviews.length === 0 ? (
                <div className="rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-gray-800">
                    <MessageCircle className="mx-auto mb-3 text-gray-400" />
                    هنوز دیدگاه تاییدشده‌ای برای این محصول ثبت نشده است.
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedReviews.map((review) => (
                        <div key={review.id} className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#111]">
                            <div className="mb-3 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#002874] text-white">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800 dark:text-white">{review.userName || 'کاربر کیان شاپ'}</p>
                                        <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <Star key={item} size={15} className={item <= Number(review.rating || review.score) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                                    ))}
                                </div>
                            </div>
                            {review.title && <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">{review.title}</h3>}
                            <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">{review.text || review.description}</p>
                            {review.adminReply && (
                                <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                                    پاسخ مدیر: {review.adminReply}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;
