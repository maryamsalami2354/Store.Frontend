// src/components/seller/sellerAnalytics/sellerAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { Download } from 'react-feather';
import AnalyticsSummaryCards from './analyticsSummaryCards';
import AnalyticsSalesChart from './analyticsSalesChart';
import AnalyticsTopProducts from './analyticsTopProducts';
import AnalyticsOrdersStatus from './analyticsOrdersStatus';
import analyticsData from '../../../../public/jsons/sellerAnalytics.json';

const SellerAnalytics = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            setData(analyticsData);
            setIsLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">گزارشات تحلیلی</h1>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition">
                    <Download size={16} /> دانلود گزارش
                </button>
            </div>

            <AnalyticsSummaryCards summary={data?.summary} isLoading={isLoading} />

            <AnalyticsSalesChart salesData={data?.salesData} isLoading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <AnalyticsTopProducts products={data?.topProducts} isLoading={isLoading} />
                <AnalyticsOrdersStatus
                    ordersByStatus={data?.ordersByStatus}
                    incomeExpense={data?.incomeExpense}
                    hourlyTraffic={data?.hourlyTraffic}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default SellerAnalytics;