import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, MessageCircle, RefreshCw, Search, XCircle } from "react-feather";
import { toast } from "react-toastify";
import {
    getAdminComments,
    getAdminQuestions,
    updateAdminCommentStatus,
    updateAdminQuestionStatus,
} from "../../services/adminApi.js";

const statusOptions = [
    { value: "all", label: "همه" },
    { value: "pending", label: "در انتظار تایید" },
    { value: "approved", label: "تایید شده" },
    { value: "rejected", label: "رد شده" },
];

const statusLabels = {
    pending: "در انتظار تایید",
    approved: "تایید شده",
    rejected: "رد شده",
};

const statusClasses = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-red-200 bg-red-50 text-red-700",
};

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("fa-IR");
};

const AdminModeration = () => {
    const [activeTab, setActiveTab] = useState("comments");
    const [status, setStatus] = useState("pending");
    const [search, setSearch] = useState("");
    const [comments, setComments] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const params = status === "all" ? {} : { status };
            const [commentsResult, questionsResult] = await Promise.all([
                getAdminComments(params),
                getAdminQuestions(params),
            ]);
            setComments(commentsResult);
            setQuestions(questionsResult);
        } catch (error) {
            toast.error(error.message || "خطا در دریافت دیدگاه‌ها و پرسش‌ها");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [status]);

    const visibleItems = useMemo(() => {
        const items = activeTab === "comments" ? comments : questions;
        if (!search.trim()) return items;
        const term = search.trim();
        return items.filter((item) =>
            [item.productName, item.userName, item.title, item.text, item.description, item.question, item.questionText, item.answer, item.answerText]
                .filter(Boolean)
                .some((value) => String(value).includes(term))
        );
    }, [activeTab, comments, questions, search]);

    const moderateComment = async (item, nextStatus) => {
        setSavingId(`comment-${item.id}`);
        try {
            await updateAdminCommentStatus(item.id, { status: nextStatus, adminReply: item.adminReply || "" });
            toast.success("وضعیت دیدگاه بروزرسانی شد");
            await loadData();
        } catch (error) {
            toast.error(error.message || "خطا در بروزرسانی دیدگاه");
        } finally {
            setSavingId(null);
        }
    };

    const moderateQuestion = async (item, nextStatus) => {
        setSavingId(`question-${item.id}`);
        try {
            await updateAdminQuestionStatus(item.id, { status: nextStatus, answerText: item.answerText || item.answer || "" });
            toast.success("وضعیت پرسش بروزرسانی شد");
            await loadData();
        } catch (error) {
            toast.error(error.message || "خطا در بروزرسانی پرسش");
        } finally {
            setSavingId(null);
        }
    };

    const updateLocalComment = (id, field, value) => {
        setComments((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

    const updateLocalQuestion = (id, field, value) => {
        setQuestions((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111] lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">مدیریت دیدگاه و پرسش محصول</h2>
                    <p className="mt-1 text-sm text-gray-500">موارد ثبت‌شده کاربران بعد از تایید در صفحه محصول نمایش داده می‌شوند.</p>
                </div>
                <button onClick={loadData} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200">
                    <RefreshCw size={16} />
                    بروزرسانی
                </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111]">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex gap-2">
                        <button onClick={() => setActiveTab("comments")} className={`rounded-lg px-4 py-2 text-sm ${activeTab === "comments" ? "bg-[#002874] text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>دیدگاه‌ها</button>
                        <button onClick={() => setActiveTab("questions")} className={`rounded-lg px-4 py-2 text-sm ${activeTab === "questions" ? "bg-[#002874] text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>پرسش‌ها</button>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900">
                            {statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                        <div className="relative">
                            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جستجو..." className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm dark:border-gray-800 dark:bg-gray-900 sm:w-64" />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-[#111]">در حال دریافت اطلاعات...</div>
            ) : visibleItems.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-[#111]">
                    <MessageCircle className="mx-auto mb-3 text-gray-400" />
                    موردی برای نمایش وجود ندارد.
                </div>
            ) : activeTab === "comments" ? (
                <div className="space-y-3">
                    {visibleItems.map((item) => (
                        <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111]">
                            <ModerationHeader item={item} />
                            {item.title && <h3 className="mt-3 text-sm font-bold text-gray-900 dark:text-white">{item.title}</h3>}
                            <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">{item.text || item.description}</p>
                            <div className="mt-3 flex items-center gap-1 text-sm text-amber-500">امتیاز: {Number(item.rating || item.score || 0).toLocaleString("fa-IR")} از ۵</div>
                            <textarea value={item.adminReply || ""} onChange={(event) => updateLocalComment(item.id, "adminReply", event.target.value)} placeholder="پاسخ مدیر، اختیاری" rows={2} className="mt-4 w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm dark:border-gray-800 dark:bg-gray-900" />
                            <ModerationActions itemKey={`comment-${item.id}`} savingId={savingId} onApprove={() => moderateComment(item, "approved")} onReject={() => moderateComment(item, "rejected")} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {visibleItems.map((item) => (
                        <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#111]">
                            <ModerationHeader item={item} />
                            <p className="mt-3 text-sm font-semibold leading-7 text-gray-800 dark:text-white">{item.question || item.questionText}</p>
                            <textarea value={item.answerText || item.answer || ""} onChange={(event) => updateLocalQuestion(item.id, "answerText", event.target.value)} placeholder="پاسخ مدیر، اختیاری" rows={3} className="mt-4 w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm dark:border-gray-800 dark:bg-gray-900" />
                            <ModerationActions itemKey={`question-${item.id}`} savingId={savingId} onApprove={() => moderateQuestion(item, "approved")} onReject={() => moderateQuestion(item, "rejected")} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ModerationHeader = ({ item }) => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{item.productName || "محصول"}</p>
            <p className="mt-1 text-xs text-gray-500">{item.userName || "کاربر"} • {formatDate(item.createdAt)}</p>
        </div>
        <span className={`w-fit rounded-full border px-3 py-1 text-xs ${statusClasses[item.status] || statusClasses.pending}`}>
            {statusLabels[item.status] || item.status}
        </span>
    </div>
);

const ModerationActions = ({ itemKey, savingId, onApprove, onReject }) => (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button disabled={savingId === itemKey} onClick={onApprove} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-60">
            <CheckCircle size={16} />
            تایید
        </button>
        <button disabled={savingId === itemKey} onClick={onReject} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-60">
            <XCircle size={16} />
            رد
        </button>
    </div>
);

export default AdminModeration;
