// =============================================================================
// FILE: sellerProfileEmpty.jsx
// =============================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'react-feather';

const SellerProfileEmpty = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Award size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">فروشنده یافت نشد</h2>
            <Link to="/best-sellers" className="text-[#002874] dark:text-[#4C6FB6] hover:underline text-sm">
                مشاهده بهترین فروشندگان
            </Link>
        </div>
    </div>
);

export default SellerProfileEmpty;