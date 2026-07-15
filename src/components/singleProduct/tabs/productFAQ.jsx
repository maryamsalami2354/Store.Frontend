// src/components/singleProduct/tabs/productFAQ.jsx
import React, { useState } from 'react';
import { Search, ThumbsUp, ThumbsDown, User, Check } from 'react-feather';
import { toast } from 'react-toastify';

// داده‌های ساختگی
const mockQuestions = [
    {
        id: 1,
        user: 'محمد رضایی',
        isBuyer: true,
        question: 'نزدیک یک ماهه استفاده میکنم صورتم همش جوش های ریز ودرشت میزنه کسی علتشو میدونه؟؟',
        date: '۲ روز پیش',
        answers: [
            { id: 1, user: 'گالری تاوک', isSeller: true, text: 'سلام اوایل استفاده از این محصول جوش های زیر پوستی میریزه بیرون بعد به مرور زمان بهتر می شود.', date: '۱۴۰۲/۱۰/۱۵', likes: 8, dislikes: 1 },
            { id: 2, user: 'ساناز محمدی', isBuyer: true, text: 'عادیه، پوست بعد از استفاده از رتینول ممکنه جوش های ریزی بده یا بعضا ممکنه خشک و قرمز بشه. به این مرحله purging میگن که موقتیه...', date: '۱۴۰۲/۱۰/۱۴', likes: 15, dislikes: 2 },
        ],
    },
    {
        id: 2,
        user: 'فاطمه کریمی',
        isBuyer: false,
        question: 'آیا این محصول برای پوست های حساس مناسب هست؟ کسی تجربه استفاده داره؟',
        date: '۵ ساعت پیش',
        answers: [],
    },
    {
        id: 3,
        user: 'علی احمدی',
        isBuyer: true,
        question: 'بعد از چند روز استفاده نتیجه میده؟',
        date: '۱ هفته پیش',
        answers: [
            { id: 3, user: 'گالری تاوک', isSeller: true, text: 'بسته به نوع پوست متفاوته ولی معمولاً بعد از ۲ هفته نتیجه اولیه رو میبینید.', date: '۱۴۰۲/۱۰/۱۲', likes: 5, dislikes: 0 },
        ],
    },
];

const ProductFAQ = ({ productId }) => {
    const [questions, setQuestions] = useState(mockQuestions);
    const [expandedId, setExpandedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [newQuestion, setNewQuestion] = useState({ name: '', email: '', text: '', saveInfo: false });

    // فیلتر و مرتب‌سازی
    const filteredQuestions = questions
        .filter(q => !searchQuery.trim() || q.question.includes(searchQuery.trim()))
        .sort((a, b) => sortBy === 'newest' ? -1 : 1);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleSubmitQuestion = (e) => {
        e.preventDefault();
        if (!newQuestion.name.trim() || !newQuestion.text.trim()) {
            toast.error('لطفاً نام و سوال خود را وارد کنید');
            return;
        }
        const question = {
            id: Date.now(),
            user: newQuestion.name,
            isBuyer: false,
            question: newQuestion.text,
            date: 'لحظاتی پیش',
            answers: [],
        };
        setQuestions(prev => [question, ...prev]);
        setNewQuestion({ name: '', email: '', text: '', saveInfo: false });
        toast.success('سوال شما با موفقیت ثبت شد');
    };

    return (
        <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 relative pb-3 before:absolute before:bottom-0 before:right-0 before:h-1 before:w-20 before:bg-[#002874] dark:before:bg-[#4C6FB6] before:rounded">
                پرسش و پاسخ
            </h2>

            {/* Question Form */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">سوالی داری در مورد این محصول؟</h3>
                <p className="text-xs text-gray-500 mb-4">برای ثبت سوال، فرم زیر را پر کنید.</p>
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input type="text" value={newQuestion.name} onChange={e => setNewQuestion(p => ({ ...p, name: e.target.value }))} placeholder="نام و نام خانوادگی" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
                        <input type="email" value={newQuestion.email} onChange={e => setNewQuestion(p => ({ ...p, email: e.target.value }))} placeholder="ایمیل" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dir-ltr text-left" />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <input type="checkbox" checked={newQuestion.saveInfo} onChange={e => setNewQuestion(p => ({ ...p, saveInfo: e.target.checked }))} className="rounded" />
                        ذخیره اطلاعات
                    </label>
                    <textarea value={newQuestion.text} onChange={e => setNewQuestion(p => ({ ...p, text: e.target.value }))} placeholder="متن سوال..." rows={3} className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
                    <button type="submit" className="px-8 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium transition">ثبت سوال</button>
                </form>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">مرتب‌سازی:</span>
                    <button onClick={() => setSortBy('newest')} className={`px-3 py-1.5 rounded-lg text-xs ${sortBy === 'newest' ? 'bg-[#002874] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600'}`}>جدیدترین</button>
                    <button onClick={() => setSortBy('oldest')} className={`px-3 py-1.5 rounded-lg text-xs ${sortBy === 'oldest' ? 'bg-[#002874] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600'}`}>قدیمی‌ترین</button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{questions.length} سوال</span>
                    <div className="relative">
                        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="جستجو..." className="w-40 pr-8 pl-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs" />
                    </div>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {filteredQuestions.map(q => (
                    <div key={q.id} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                        {/* Question Header */}
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                                        {q.user[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-2">
                                            {q.user}
                                            {q.isBuyer && <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 px-2 py-0.5 rounded-full">خریدار</span>}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">{q.date}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full ${q.answers.length > 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700'}`}>
                  {q.answers.length > 0 ? 'پاسخ داده شده' : 'در انتظار پاسخ'}
                </span>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">{q.question}</h3>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>🛒 {q.answers.length} پاسخ</span>
                                <button onClick={() => toggleExpand(q.id)} className="text-[#002874]  dark:text-[#4C6FB6] hover:underline">
                                    {expandedId === q.id ? 'بستن پاسخ‌ها' : 'مشاهده پاسخ‌ها'}
                                </button>
                            </div>
                        </div>

                        {/* Answers */}
                        {expandedId === q.id && q.answers.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5 space-y-4">
                                {q.answers.map(ans => (
                                    <div key={ans.id} className={`p-4 rounded-xl ${ans.isSeller ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30' : 'bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800'}`}>
                                        <div className="flex items-start gap-3 mb-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${ans.isSeller ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                                                {ans.user[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-800 dark:text-white flex items-center gap-2">
                                                    {ans.user}
                                                    {ans.isSeller && <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 px-2 py-0.5 rounded-full">فروشنده</span>}
                                                    {!ans.isSeller && ans.isBuyer && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 px-2 py-0.5 rounded-full">خریدار</span>}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{ans.text}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <span className="text-xs text-gray-500">{ans.date}</span>
                                            <div className="flex items-center gap-3">
                                                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-500 transition">
                                                    <ThumbsUp size={12} /> {ans.likes}
                                                </button>
                                                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition">
                                                    <ThumbsDown size={12} /> {ans.dislikes}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Load More */}
            {filteredQuestions.length > 3 && (
                <div className="text-center mt-6">
                    <button className="px-8 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl text-sm hover:border-[#002874] hover:text-[#002874]  dark:hover:border-[#4C6FB6] dark:hover:text-[#4C6FB6] transition">
                        مشاهده سوالات بیشتر
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductFAQ;