// =============================================================================
// paymentResultPage.jsx
// =============================================================================
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Home, RefreshCw, ShoppingBag, ChevronLeft } from 'react-feather';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import PaymentResultPageSkeleton from '../skeleton/PaymentResultPageSkeleton/PaymentResultPageSkeleton.jsx';

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // فقط ?status=ok یا ?status=nok
    const status = searchParams.get('status'); // "ok" | "nok"
    const isSuccess = status === 'ok';
    const refId = searchParams.get('refId');
    const message = searchParams.get('message');

    useEffect(() => {
        if (!status || (status !== 'ok' && status !== 'nok')) {
            navigate('/');
            return;
        }
        const timer = setTimeout(() => setIsLoading(false), 600);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, [status, navigate]);

    if (isLoading) return <PaymentResultPageSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">

                <Breadcrumb items={[{ title: 'نتیجه پرداخت' }]} />

                <div className="max-w-lg mx-auto mt-10">

                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-8 sm:p-10 text-center">

                        {/* Icon */}
                        <div className={`inline-flex p-5 rounded-full mb-6 ${
                            isSuccess
                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                            {isSuccess
                                ? <CheckCircle size={56} className="text-emerald-600 dark:text-emerald-400" />
                                : <XCircle size={56} className="text-red-500 dark:text-red-400" />
                            }
                        </div>

                        {/* Title */}
                        <h1 className={`text-2xl sm:text-3xl font-extrabold mb-3 ${
                            isSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                        }`}>
                            {isSuccess ? 'پرداخت با موفقیت انجام شد' : 'پرداخت ناموفق بود'}
                        </h1>

                        {/* Description */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                            {isSuccess
                                ? 'سفارش شما ثبت شد و به زودی برای شما ارسال خواهد شد.'
                                : 'متأسفانه مشکلی در پرداخت پیش آمده. لطفاً دوباره تلاش کنید.'
                            }
                        </p>

                        {(refId || message) && (
                            <div className="mb-6 rounded-xl bg-gray-50 dark:bg-gray-900 p-3 text-xs text-gray-600 dark:text-gray-300 space-y-1">
                                {refId && <p>کد پیگیری زرین‌پال: {Number(refId).toLocaleString('fa-IR')}</p>}
                                {message && <p>{message}</p>}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {isSuccess ? (
                                <>
                                    <Link
                                        to="/"
                                        className="flex-1 py-3 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Home size={18} />
                                        بازگشت به خانه
                                    </Link>
                                    <Link
                                        to="/user/orders"
                                        className="flex-1 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={18} />
                                        سفارشات من
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="flex-1 py-3 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw size={18} />
                                        تلاش مجدد
                                    </button>
                                    <Link
                                        to="/cart"
                                        className="flex-1 py-3 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={18} />
                                        سبد خرید
                                    </Link>
                                </>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default PaymentResultPage;
