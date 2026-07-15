// src/components/seller/SellerHome/SellerHome.jsx
import React from 'react';
import StatCards from './statCards.jsx';
import WeeklySalesChart from './weeklySalesChart.jsx';
import RecentOrdersTable from './recentOrdersTable.jsx';
import TopProductsList from './topProductsList.jsx';
import StoreSummary from './storeSummary.jsx';

const SellerHome = () => {
    return (
        <div className="space-y-5 lg:space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    پیشخوان فروشنده
                </h1>
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString('fa-IR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>
            <StatCards />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <WeeklySalesChart />
                </div>
                <div className="lg:col-span-1">
                    <TopProductsList />
                </div>
            </div>
            <RecentOrdersTable />
            <StoreSummary />
        </div>
    );
};

export default SellerHome;