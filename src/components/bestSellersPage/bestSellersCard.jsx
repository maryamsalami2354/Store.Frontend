// =============================================================================
// FILE: bestSellersCard.jsx (همه اعداد از props - بدون Math.random در JSX)
// =============================================================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Star, TrendingUp, Package, ChevronLeft, Zap, Clock, Shield, CheckCircle, MapPin, Heart, ShoppingBag } from 'react-feather';
import 'react-lazy-load-image-component/src/effects/blur.css';

const medals = [
    { icon: '🥇', ring: 'from-yellow-400 to-amber-500', badge: 'bg-gradient-to-r from-yellow-400 to-amber-500', bgGlow: 'bg-yellow-400/10', borderGlow: 'border-yellow-400/50', statsBg: 'bg-yellow-50 dark:bg-yellow-900/20', bar: 'from-yellow-400 via-amber-500 to-yellow-600' },
    { icon: '🥈', ring: 'from-gray-300 to-gray-400', badge: 'bg-gradient-to-r from-gray-300 to-gray-400', bgGlow: 'bg-gray-400/10', borderGlow: 'border-gray-400/50', statsBg: 'bg-gray-50 dark:bg-gray-900/20', bar: 'from-gray-300 via-gray-400 to-gray-500' },
    { icon: '🥉', ring: 'from-orange-400 to-orange-600', badge: 'bg-gradient-to-r from-orange-400 to-orange-600', bgGlow: 'bg-orange-400/10', borderGlow: 'border-orange-400/50', statsBg: 'bg-orange-50 dark:bg-orange-900/20', bar: 'from-orange-400 via-orange-500 to-orange-600' },
];

const BestSellersCard = ({ seller }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isTop3 = seller.rank <= 3;
    if (!isTop3) return null;

    const medal = medals[seller.rank - 1];

    return (
        <Link
            to={`/seller-profile/${seller.id}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl border-2 transition-all group overflow-hidden w-full ${medal.bgGlow} ${medal.borderGlow} hover:shadow-2xl bg-white dark:bg-[#111]`}
        >
            {/* Rank Section */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2 z-10">
                <span className="text-6xl drop-shadow-xl">{medal.icon}</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${medal.badge}`}>
          {seller.rank === 1 ? 'مقام اول' : seller.rank === 2 ? 'مقام دوم' : 'مقام سوم'}
        </span>
            </div>

            {/* Avatar */}
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-0.5 bg-gradient-to-br ${medal.ring} shadow-lg flex-shrink-0 z-10`}>
                <div className="w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-[#111] ring-2 ring-white dark:ring-[#111]">
                    <LazyLoadImage src={seller.avatar || '/images/users/avatar-1.svg'} alt={seller.name} effect="blur" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 w-full z-10">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-extrabold text-lg sm:text-xl text-gray-900 dark:text-white group-hover:text-[#002874] transition-colors">{seller.name}</h3>
                    <CheckCircle size={18} className="text-blue-500 flex-shrink-0" />
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <Shield size={10} /> تأیید شده
          </span>
                </div>

                <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map(i => (
                        <Star key={i} size={16} className={i <= Math.floor(seller.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'} />
                    ))}
                    <span className="text-base font-bold text-gray-800 dark:text-gray-200 mr-1">{seller.rating}</span>
                    <span className="text-xs text-gray-400">({seller.reviews?.toLocaleString('fa-IR')} نظر)</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin size={12} />{seller.city}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Clock size={12} />از {seller.joinedDate}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><ShoppingBag size={12} />{seller.todayOrders} سفارش امروز</span>
                </div>

                <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 rounded-xl ${medal.statsBg}`}>
                    <div className="text-center">
                        <TrendingUp size={16} className="text-emerald-500 mx-auto mb-1" />
                        <div className="text-sm sm:text-base font-extrabold text-gray-800 dark:text-gray-200">{seller.totalSales?.toLocaleString('fa-IR')}</div>
                        <div className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">فروش کل</div>
                    </div>
                    <div className="text-center">
                        <Package size={16} className="text-blue-500 mx-auto mb-1" />
                        <div className="text-sm sm:text-base font-extrabold text-gray-800 dark:text-gray-200">{seller.totalProducts}</div>
                        <div className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">محصول فعال</div>
                    </div>
                    <div className="text-center">
                        <Zap size={16} className="text-purple-500 mx-auto mb-1" />
                        <div className="text-sm sm:text-base font-extrabold text-gray-800 dark:text-gray-200">{seller.satisfaction ? seller.satisfaction : "97"}%</div>
                        <div className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">رضایت</div>
                    </div>
                    <div className="text-center">
                        <Heart size={16} className="text-rose-500 mx-auto mb-1" />
                        <div className="text-sm sm:text-base font-extrabold text-gray-800 dark:text-gray-200">{seller.followers?.toLocaleString('fa-IR')}</div>
                        <div className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">دنبال‌کننده</div>
                    </div>
                </div>
            </div>

            <ChevronLeft size={24} className={`hidden sm:block text-gray-300 transition-all duration-300 flex-shrink-0 z-10 ${isHovered ? 'opacity-100 -translate-x-0' : 'opacity-0 translate-x-4'}`} />
            <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${medal.bar} z-10`} />
        </Link>
    );
};

export default BestSellersCard;