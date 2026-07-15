// =============================================================================
// FILE: sellerProfileHero.jsx
// =============================================================================
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { CheckCircle, Shield, MapPin, Clock, Star, Award, ChevronLeft } from 'react-feather';

const medals = ['🥇', '🥈', '🥉'];

const SellerProfileHero = ({ seller }) => {
    const isTop3 = seller.rank <= 3;
    const medal = isTop3 ? medals[seller.rank - 1] : null;

    return (
        <div className="relative overflow-hidden mt-3 rounded-2xl bg-gradient-to-br from-[#002874] via-[#003399] to-[#1a1a5e] p-6 sm:p-8 lg:p-10 mb-6">
            <div className="absolute inset-0 opacity-[0.07]">
                <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full border-[12px] border-white" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border-[12px] border-white" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl p-0.5 flex-shrink-0 ${isTop3 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' : 'bg-white/20'}`}>
                    <div className="w-full h-full rounded-2xl overflow-hidden ring-4 ring-white/20">
                        <LazyLoadImage src={seller.avatar || '/images/users/avatar-1.svg'} alt={seller.name} effect="blur" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Info */}
                <div className="text-center sm:text-right flex-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                        {medal && <span className="text-3xl">{medal}</span>}
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{seller.name}</h1>
                        <CheckCircle size={20} className="text-blue-400" />
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-white/70">
                        <span className="flex items-center gap-1"><MapPin size={14} />{seller.city}</span>
                        <span className="flex items-center gap-1"><Clock size={14} />عضویت از {seller.joinedDate}</span>
                        <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" />{seller.rating}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                        {(seller.badges || []).map((badge, idx) => (
                            <span key={idx} className="text-[10px] bg-white/15 backdrop-blur text-white px-3 py-1 rounded-full flex items-center gap-1">
                <Award size={10} /> {badge}
              </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProfileHero;