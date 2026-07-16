// =============================================================================
// FILE: clubJoinCard.jsx
// =============================================================================
import React from 'react';
import { Award, ArrowLeft } from 'react-feather';
import { Link } from 'react-router-dom';

const ClubJoinCard = () => (
    <div className="bg-gradient-to-br from-[#002874] to-[#4C6FB6] rounded-2xl p-6 sm:p-8 text-center text-white">
        <Award size={40} className="mx-auto mb-4" />
        <h3 className="text-2xl font-extrabold mb-2">به خانواده کیان شاپ بپیوندید</h3>
        <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
            همین حالا عضو شوید، امتیاز جمع کنید و از تخفیف‌ها و جوایز ویژه بهره‌مند شوید.
        </p>
        <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 text-[#002874] rounded-xl font-bold text-sm hover:bg-amber-300 transition-colors">
            ورود / ثبت‌نام
            <ArrowLeft size={16} />
        </Link>
    </div>
);

export default ClubJoinCard;