// =============================================================================
// FILE: productSidebar.jsx (اصلاح‌شده - حالت ناموجود)
// =============================================================================
import React, {useState} from 'react';
import {
    Star,
    ShoppingBag,
    Plus,
    Minus,
    Shield,
    Truck,
    Clock,
    ChevronDown,
    ChevronUp,
    Award,
    Zap,
    Bell,
    BellOff
} from 'react-feather';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';

const ProductSidebar = ({product, onAddToCart}) => {
    const [quantity, setQuantity] = useState(1);
    const [showStock, setShowStock] = useState(false);
    const [notifyMe, setNotifyMe] = useState(false);

    const formatPrice = (p) => {
        if (!p) return '۰';
        return Number(String(p).replace(/[^\d]/g, '')).toLocaleString('fa-IR');
    };

    const isOutOfStock = product?.stock === 0;

    const handleNotifyMe = () => {
        setNotifyMe(true);
        toast.success('شماره شما ثبت شد. به محض موجود شدن اطلاع می‌دهیم');
    };

    return (
        <div className="space-y-3">
            {/* کارت فروشنده */}
            <div
                className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 space-y-3">
                {/* هدر فروشنده */}
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm">فروشنده</h3>
                    <Link to="/seller"
                          className="text-xs text-[#002874] dark:text-[#4C6FB6] hover:underline">پروفایل</Link>
                </div>

                {/* نام فروشنده */}
                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3">
                    <div
                        className="w-10 h-10 bg-gradient-to-br from-[#002874] to-[#4C6FB6] rounded-xl flex items-center justify-center text-white font-bold shadow-md">ف
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">فروشگاه اصلی</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span
                                className="text-blue-500 text-[10px] bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-full">✓ تایید شده</span>
                            <div className="flex items-center">
                                <Star size={10} className="text-amber-400 fill-amber-400"/>
                                <span className="text-[10px] text-gray-500 mr-0.5">۴.۸</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* امتیازات */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-2.5 text-center">
                        <span className="text-xs text-gray-500 block">رضایت خریداران</span>
                        <span className="text-sm font-bold text-green-600 mt-0.5 block">۸۸٪</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-2.5 text-center">
                        <span className="text-xs text-gray-500 block">عملکرد</span>
                        <span className="text-sm font-bold text-green-600 mt-0.5 block">عالی</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-2.5 text-center">
                        <span className="text-xs text-gray-500 block">تعداد فروش</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-white mt-0.5 block">۱۲۴ عدد</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-2.5 text-center">
                        <span className="text-xs text-gray-500 block">پاسخگویی</span>
                        <span className="text-sm font-bold text-green-600 mt-0.5 block">سریع</span>
                    </div>
                </div>

                {/* ویژگی‌های فروشنده */}
                <div className="grid grid-cols-3 gap-2 bg-white dark:bg-gray-800 rounded-xl p-3">
                    <div className="flex flex-col items-center gap-1.5 text-center">
                        <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Shield size={14} className="text-blue-600"/>
                        </div>
                        <span
                            className="text-[11px] font-medium text-gray-700 dark:text-gray-300">گارانتی ۱۸ ماهه</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center">
                        <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <Truck size={14} className="text-green-600"/>
                        </div>
                        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">ارسال سریع</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center">
                        <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <Clock size={14} className="text-orange-600"/>
                        </div>
                        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">بازگشت ۷ روز</span>
                    </div>
                </div>

                {/* موجودی - قابل کلیک */}
                <button onClick={() => setShowStock(!showStock)}
                        className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <span className="flex items-center gap-2">
                        <span
                            className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
                        <span
                            className={`font-medium ${isOutOfStock ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                            {isOutOfStock ? 'ناموجود' : 'موجود در انبار'}
                        </span>
                    </span>
                    {showStock ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {showStock && (
                    <div
                        className="p-3 bg-white dark:bg-gray-800 rounded-xl text-[11px] space-y-2 text-gray-500 border border-gray-200 dark:border-gray-700">
                        {isOutOfStock ? (
                            <div className="text-center text-gray-400 py-2">موجودی انبار به اتمام رسیده است</div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-lg bg-green-100 dark:bg-green-900/30"><Truck size={12}
                                                                                                             className="text-green-600"/>
                                    </div>
                                    ارسال شاپ مارکت (۱-۲ روز کاری)
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/30"><Shield size={12}
                                                                                                            className="text-blue-600"/>
                                    </div>
                                    ارسال توسط فروشنده (۲-۴ روز)
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-lg bg-purple-100 dark:bg-purple-900/30"><Clock size={12}
                                                                                                               className="text-purple-600"/>
                                    </div>
                                    ارسال فوری (تهران) - امروز
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* کارت قیمت و خرید */}
            <div className={`rounded-2xl p-4 text-white space-y-3 shadow-lg ${
                isOutOfStock
                    ? 'bg-gradient-to-br from-gray-600 to-gray-800 shadow-gray-600/30'
                    : 'bg-gradient-to-br from-[#002874] to-[#001d5a] shadow-[#002874]/30 dark:shadow-[#4C6FB6]/30'
            }`}>
                {/* قیمت */}
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-2xl font-extrabold">{formatPrice(product?.price)}</span>
                        <span className="text-sm text-white/70 mr-1">تومان</span>
                    </div>
                    {product?.discount > 0 && product?.oldPrice && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/50 line-through">{formatPrice(product?.oldPrice)}</span>
                            <span
                                className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">٪{product?.discount}</span>
                        </div>
                    )}
                </div>

                {/* دکمه‌ها - حالت عادی یا ناموجود */}
                {isOutOfStock ? (
                    <div className="space-y-3">
                        {/* Badge ناموجود */}
                        <div
                            className="bg-red-500/20 backdrop-blur rounded-xl p-3 text-center border border-red-400/30">
                            <p className="font-bold text-white">این محصول در حال حاضر ناموجود است</p>
                        </div>

                        {/* دکمه خبرم کن */}
                        {!notifyMe ? (
                            <button
                                onClick={handleNotifyMe}
                                className="w-full py-3 bg-white text-[#002874] dark:text-[#4C6FB6] rounded-xl font-bold text-sm hover:bg-gray-100 transition flex items-center justify-center gap-2"
                            >
                                <Bell size={18}/>
                                به محض موجود شدن خبرم بده
                            </button>
                        ) : (
                            <div
                                className="bg-emerald-500/20 backdrop-blur rounded-xl p-3 text-center border border-emerald-400/30">
                                <BellOff size={20} className="mx-auto mb-1 text-white"/>
                                <p className="text-sm font-medium text-white">شماره شما ثبت شد ✓</p>
                                <p className="text-xs text-white/70 mt-0.5">به محض موجود شدن اطلاع می‌دهیم</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* تعداد و دکمه خرید */}
                        <div className="flex-col flex justify-center items-center gap-2">
                            <div
                                className="flex w-[55%] items-center justify-between bg-white/20 rounded-lg backdrop-blur-sm">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="p-2 w-full hover:bg-white/30 transition rounded-r-lg">
                                    <Minus size={16} className="text-white"/>
                                </button>
                                <span className="w-10 text-center w-full font-bold text-lg">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)}
                                        className="p-2 w-full hover:bg-white/30 transition rounded-l-lg">
                                    <Plus size={16} className="text-white"/>
                                </button>
                            </div>
                            <button
                                onClick={() => onAddToCart?.(quantity)}
                                className="flex-1 w-full py-3 bg-white text-[#002874] dark:text-[#4C6FB6] rounded-xl font-bold text-sm hover:bg-gray-100 transition flex items-center justify-center gap-2"
                            >
                                <ShoppingBag size={18}/>
                                افزودن به سبد خرید
                            </button>
                        </div>
                    </>
                )}

                {/* امتیاز */}
                <div className="flex items-center justify-between text-xs text-white/80 border-t border-white/20 pt-2">
                    <span className="flex items-center gap-1.5">
                        <div className="p-1 rounded-lg bg-amber-400/20"><Star size={12}
                                                                              className="text-amber-400 fill-amber-400"/></div>
                        امتیاز باشگاه مشتریان
                    </span>
                    <span className="font-bold text-white">
                        {((parseInt(formatPrice(product?.price).replace(/,/g, '')) || 0) / 10000).toFixed(0)} امتیاز
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductSidebar;
