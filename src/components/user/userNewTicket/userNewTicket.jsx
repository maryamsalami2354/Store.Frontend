// =============================================================================
// FILE: userNewTicket.jsx
// =============================================================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Image, X, MessageSquare } from 'react-feather';
import { toast } from 'react-toastify';
import CustomSelect from '../../common/customSelect/customSelect';

const subjectOptions = [
    { value: 'order', label: 'پیگیری سفارش' },
    { value: 'return', label: 'بازگشت کالا' },
    { value: 'payment', label: 'مشکل پرداخت' },
    { value: 'technical', label: 'مشکل فنی' },
    { value: 'product', label: 'سوال درباره محصول' },
    { value: 'other', label: 'سایر' },
];

const UserNewTicket = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [attachmentPreview, setAttachmentPreview] = useState('');

    const handleAttachment = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) return;
        setAttachment(file);
        const reader = new FileReader();
        reader.onloadend = () => setAttachmentPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeAttachment = () => {
        setAttachment(null);
        setAttachmentPreview('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!subject || !message) return;

        // اینجا می‌تونیم API call داشته باشیم
        toast.success('تیکت شما با موفقیت ثبت شد');
        navigate('/user/tickets');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link to="/user/tickets" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                    <ChevronLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">تیکت جدید</h1>
                    <p className="text-xs text-gray-500">مشکل یا سوال خود را مطرح کنید</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Subject */}
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">موضوع</label>
                        <CustomSelect
                            options={subjectOptions}
                            value={subject}
                            onChange={setSubject}
                            placeholder="انتخاب موضوع تیکت"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">توضیحات</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            placeholder="لطفاً مشکل یا سوال خود را با جزئیات کامل توضیح دهید..."
                            className="w-full p-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#002874] dark:focus:ring-[#4C6FB6] focus:border-transparent resize-none"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">حداقل ۱۰ کاراکتر</p>
                    </div>

                    {/* Attachment */}
                    <div>
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">پیوست (اختیاری)</label>

                        {attachmentPreview ? (
                            <div className="relative inline-block">
                                <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img src={attachmentPreview} alt="Attachment" className="w-full h-full object-cover" />
                                </div>
                                <button
                                    type="button"
                                    onClick={removeAttachment}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ) : (
                            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                                <Image size={16} />
                                بارگذاری تصویر
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAttachment}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <p className="text-[10px] text-gray-400 mt-1">حداکثر ۵ مگابایت - فقط عکس</p>
                    </div>

                    {/* Info Card */}
                    <div className="bg-[#002874]/5 dark:bg-[#4C6FB6]/10 rounded-xl p-4 flex items-start gap-3">
                        <MessageSquare size={18} className="text-[#002874] dark:text-[#4C6FB6] mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">نکته</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                تیم پشتیبانی ما معمولاً در کمتر از ۲۴ ساعت پاسخگوی تیکت‌ها خواهد بود.
                                در روزهای تعطیل این زمان ممکن است بیشتر طول بکشد.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Link
                            to="/user/tickets"
                            className="px-5 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            انصراف
                        </Link>
                        <button
                            type="submit"
                            disabled={!subject || message.length < 10}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={16} />
                            ارسال تیکت
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserNewTicket;