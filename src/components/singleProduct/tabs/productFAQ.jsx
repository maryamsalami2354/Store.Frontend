import React, { useEffect, useMemo, useState } from 'react';
import { Search, User, MessageCircle } from 'react-feather';
import { toast } from 'react-toastify';
import { getProductQuestions, submitProductQuestion } from '../../../services/productInteractionApi.js';
import useStore from '../../../store/index.js';

const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('fa-IR');
};

const ProductFAQ = ({ productId }) => {
    const accessToken = useStore((state) => state.accessToken);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [questionText, setQuestionText] = useState('');

    const loadQuestions = async () => {
        if (!productId) return;
        setIsLoading(true);
        try {
            setQuestions(await getProductQuestions(productId));
        } catch (error) {
            toast.error(error.message || 'خطا در دریافت پرسش‌ها');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadQuestions();
    }, [productId]);

    const filteredQuestions = useMemo(() => {
        return questions
            .filter((item) => !searchQuery.trim() || (item.question || item.questionText || '').includes(searchQuery.trim()))
            .sort((a, b) => {
                const first = new Date(a.createdAt || 0).getTime();
                const second = new Date(b.createdAt || 0).getTime();
                return sortBy === 'newest' ? second - first : first - second;
            });
    }, [questions, searchQuery, sortBy]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!accessToken) {
            toast.error('برای ثبت پرسش ابتدا وارد حساب کاربری شوید');
            return;
        }

        if (!questionText.trim()) {
            toast.error('متن پرسش را وارد کنید');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitProductQuestion(productId, { questionText: questionText.trim() });
            setQuestionText('');
            toast.success(result?.message || 'پرسش شما پس از تایید مدیر نمایش داده می‌شود');
        } catch (error) {
            toast.error(error.message || 'خطا در ثبت پرسش');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="relative mb-6 pb-3 text-xl font-extrabold text-gray-900 before:absolute before:bottom-0 before:right-0 before:h-1 before:w-20 before:rounded before:bg-[#002874] dark:text-white dark:before:bg-[#4C6FB6]">
                پرسش و پاسخ
            </h2>

            <div className="mb-6 rounded-lg bg-gray-50 p-5 dark:bg-gray-900/50">
                <h3 className="mb-2 font-bold text-gray-900 dark:text-white">سوالی درباره این محصول داری؟</h3>
                <p className="mb-4 text-xs text-gray-500">پرسش بعد از تایید مدیر زیر محصول نمایش داده می‌شود.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={questionText}
                        onChange={(event) => setQuestionText(event.target.value)}
                        placeholder="متن پرسش..."
                        rows={3}
                        className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-[#002874] px-8 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? 'در حال ثبت...' : 'ثبت پرسش'}
                    </button>
                </form>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">مرتب‌سازی:</span>
                    <button onClick={() => setSortBy('newest')} className={`rounded-lg px-3 py-1.5 text-xs ${sortBy === 'newest' ? 'bg-[#002874] text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700'}`}>جدیدترین</button>
                    <button onClick={() => setSortBy('oldest')} className={`rounded-lg px-3 py-1.5 text-xs ${sortBy === 'oldest' ? 'bg-[#002874] text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700'}`}>قدیمی‌ترین</button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{questions.length.toLocaleString('fa-IR')} پرسش تاییدشده</span>
                    <div className="relative">
                        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="جستجو..."
                            className="w-40 rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-xs dark:border-gray-700 dark:bg-gray-800"
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="rounded-lg border border-gray-200 p-5 text-sm text-gray-500 dark:border-gray-800">در حال دریافت پرسش‌ها...</div>
            ) : filteredQuestions.length === 0 ? (
                <div className="rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-gray-800">
                    <MessageCircle className="mx-auto mb-3 text-gray-400" />
                    هنوز پرسش تاییدشده‌ای برای این محصول ثبت نشده است.
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredQuestions.map((item) => {
                        const hasAnswer = Boolean(item.answer || item.answerText);
                        return (
                            <div key={item.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111]">
                                <div className="p-5">
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 dark:text-white">{item.userName || 'کاربر کیان شاپ'}</p>
                                                <p className="mt-0.5 text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                                            </div>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs ${hasAnswer ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {hasAnswer ? 'پاسخ داده شده' : 'در انتظار پاسخ'}
                                        </span>
                                    </div>
                                    <h3 className="mb-3 text-sm font-semibold leading-7 text-gray-800 dark:text-white">{item.question || item.questionText}</h3>
                                    {hasAnswer && (
                                        <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="text-xs text-[#002874] hover:underline dark:text-[#4C6FB6]">
                                            {expandedId === item.id ? 'بستن پاسخ' : 'مشاهده پاسخ'}
                                        </button>
                                    )}
                                </div>
                                {expandedId === item.id && hasAnswer && (
                                    <div className="border-t border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
                                        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm leading-7 text-green-800 dark:border-green-800/30 dark:bg-green-900/10 dark:text-green-200">
                                            <p className="mb-1 font-bold">پاسخ مدیر کیان شاپ</p>
                                            <p>{item.answer || item.answerText}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProductFAQ;
