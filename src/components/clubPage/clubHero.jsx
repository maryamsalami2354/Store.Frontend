// =============================================================================
// FILE: clubHero.jsx
// =============================================================================
import React from 'react';
import { Award, Gift, TrendingUp, ArrowLeft } from 'react-feather';
import { Link } from 'react-router-dom';

const tiers = {
    silver: { name: 'نقره‌ای', icon: '🥈', color: 'from-gray-300 to-gray-400', nextPoints: 20000 },
    gold: { name: 'طلایی', icon: '🥇', color: 'from-yellow-400 to-amber-500', nextPoints: 50000 },
    platinum: { name: 'پلاتینیوم', icon: '💎', color: 'from-purple-400 to-indigo-500', nextPoints: null },
};

const ClubHero = ({ isLoggedIn = false }) => {
    const points = 12500;
    const currentTier = 'gold';
    const t = tiers[currentTier];

    return (
        <div className="relative mt-3 rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#1a1a5e] p-6 sm:p-8 lg:p-10 mb-6 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.07]">
                <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border-[12px] border-white" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[12px] border-white" />
            </div>

            <div className="relative z-10 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-white/20 backdrop-blur mb-4">
                    <Award size={32} className="text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2">
                    باشگاه <span className="text-amber-400">مشتریان</span>
                </h1>
                <p className="text-sm text-white/70 max-w-xl mx-auto mb-6">
                    با هر خرید امتیاز جمع کنید و از مزایای ویژه بهره‌مند شوید.
                </p>

                {!isLoggedIn ? (
                    <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-[#002874] rounded-xl font-bold text-sm hover:bg-amber-300 transition-colors">
                        ورود / ثبت‌نام برای شروع
                        <ArrowLeft size={16} />
                    </Link>
                ) : (
                    <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur rounded-2xl px-6 py-4">
                        <div className="text-center">
                            <Gift size={24} className="text-amber-400 mx-auto mb-1" />
                            <div className="text-2xl font-extrabold text-white">{points.toLocaleString('fa-IR')}</div>
                            <div className="text-xs text-white/60">امتیاز شما</div>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <span className="text-3xl">{t.icon}</span>
                            <div className="text-sm font-bold text-white">{t.name}</div>
                            <div className="text-xs text-white/60">سطح شما</div>
                        </div>
                        {t.nextPoints && (
                            <>
                                <div className="w-px h-10 bg-white/20" />
                                <div className="text-center">
                                    <TrendingUp size={24} className="text-amber-400 mx-auto mb-1" />
                                    <div className="text-xs text-white/60">{t.nextPoints.toLocaleString('fa-IR')} تا سطح بعدی</div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClubHero;