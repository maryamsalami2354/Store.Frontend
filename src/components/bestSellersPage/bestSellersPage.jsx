// =============================================================================
// FILE: bestSellersPage.jsx (بدون infinite scroll)
// =============================================================================
import React, { useState, useEffect } from 'react';
import { Award } from 'react-feather';
import sellersData from '../../../public/jsons/sellers.json';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import BestSellersPageSkeleton from '../skeleton/BestSellersPageSkeleton/BestSellersPageSkeleton';
import BestSellersHero from './bestSellersHero';
import BestSellersGrid from './bestSellersGrid';
import BestSellersEmpty from './bestSellersEmpty';

const BestSellersPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        const load = async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            const allSellers = (sellersData.sellers || []).map((s, i) => ({
                ...s,
                rank: i + 1,
                rating: (4.0 + Math.random() * 1.0).toFixed(1),
                totalSales: Math.floor(Math.random() * 5000) + 500,
                totalProducts: Math.floor(Math.random() * 200) + 10,
                joinedDate: new Date(Date.now() - Math.random() * 365 * 86400000).toLocaleDateString('fa-IR'),
            }));
            // مرتب‌سازی بر اساس rating
            allSellers.sort((a, b) => b.rating - a.rating);
            allSellers.forEach((s, i) => s.rank = i + 1);
            setSellers(allSellers);
            setIsLoading(false);
        };
        load();
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) return <BestSellersPageSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <Breadcrumb items={[{ title: 'بهترین فروشندگان', link: '/best-sellers', icon: Award }]} />
                <BestSellersHero total={sellers.length} />

                {sellers.length === 0 ? (
                    <BestSellersEmpty />
                ) : (
                    <BestSellersGrid sellers={sellers} />
                )}
            </div>
        </div>
    );
};

export default BestSellersPage;