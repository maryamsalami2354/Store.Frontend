// =============================================================================
// FILE: sellerWelcome.jsx
// =============================================================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Play, Gift, Package, Users, BarChart2, BookOpen, Zap } from 'react-feather';

const tips = [
    { icon: Package, title: 'محصولات خود را ثبت کنید', desc: 'اولین قدم برای شروع فروش' },
    { icon: BarChart2, title: 'داشبورد را بشناسید', desc: 'گزارشات فروش و بازدید' },
    { icon: Gift, title: 'تخفیف و پیشنهاد ویژه', desc: 'جذب مشتری با کمپین‌ها' },
    { icon: Users, title: 'مشتریان خود را بشناسید', desc: 'مدیریت ارتباط با مشتری' },
];

const SellerWelcome = ({ shopName = 'فروشگاه شما', onGoToDashboard }) => {
    const [showVideo, setShowVideo] = useState(false);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Success Banner */}
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-8 sm:p-10 text-center">
                    <div className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur mb-4">
                        <CheckCircle size={48} className="text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">تبریک می‌گوییم! 🎉</h1>
                    <p className="text-white/80 text-sm">
                        فروشگاه <span className="font-bold text-white">{shopName}</span> با موفقیت ایجاد شد
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-6">
                    {/* Tips */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Zap size={18} className="text-amber-400" />
                            قدم‌های اولیه
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {tips.map((tip, idx) => (
                                <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                                    <div className="p-2 rounded-lg bg-[#002874]/10 dark:bg-[#4C6FB6]/20 inline-flex mb-2">
                                        <tip.icon size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
                                    </div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{tip.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tip.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Video Tutorial */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <BookOpen size={18} className="text-[#002874] dark:text-[#4C6FB6]" />
                            آموزش سریع
                        </h3>
                        <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
                            {showVideo ? (
                                <video
                                    src="/videos/seller-intro.mp4"
                                    controls
                                    autoPlay
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div class="absolute inset-0 flex items-center justify-center text-white/50 text-sm">ویدیو آموزشی در دسترس نیست</div>';
                                    }}
                                />
                            ) : (
                                <button
                                    onClick={() => setShowVideo(true)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Play size={28} className="text-white ml-1" />
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={onGoToDashboard}
                        className="w-full py-3.5 bg-[#002874] text-white rounded-xl font-medium text-sm hover:bg-[#001d5a] transition-colors flex items-center justify-center gap-2"
                    >
                        ورود به داشبورد فروشنده
                        <ArrowLeft size={18} />
                    </button>

                    <Link
                        to="/seller"
                        className="block text-center text-sm text-[#002874] dark:text-[#4C6FB6] hover:underline"
                    >
                        بعداً انجام می‌دهم
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SellerWelcome;