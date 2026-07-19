// src/components/user/userDashboard/userDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardSummaryCards from './dashboardSummaryCards';
import DashboardRecentOrders from './dashboardRecentOrders';
import DashboardRecommendedProducts from './dashboardRecommendedProducts';
import ordersData from '../../../../public/jsons/sellerOrders.json';
import productsData from '../../../../public/jsons/products.json';
import { getCatalogProducts } from '../../../services/catalogApi.js';

const UserDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));

            // گرفتن سفارشات از sellerOrders.json
            const userOrders = (ordersData.orders || []).slice(0, 5).map(order => ({
                ...order,
                // customer حالا یک آبجکت است، برای نمایش خلاصه اسمش رو می‌گیریم
                customerName: typeof order.customer === 'object' ? order.customer.name : order.customer,
            }));

            // گرفتن ۳ محصول پیشنهادی از products.json
            const response = await getCatalogProducts({ page: 1, pageSize: 20, sort: 'discounted' }).catch(() => ({ products: [] }));
            const recommended = (response.products?.length ? response.products : productsData.products || [])
                .filter(p => p.isAmazing || p.isNew)
                .slice(0, 3);

            setOrders(userOrders);
            setProducts(recommended);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // محاسبه خلاصه آماری از روی سفارشات
    const summary = useMemo(() => ({
        activeOrders: orders.filter(o => o.status === 'processing' || o.status === 'pending').length,
        deliveredOrders: orders.filter(o => o.status === 'completed').length,
        walletBalance: 2500000,  // این می‌تونه بعداً از یه API دیگه بیاد
        wishlistCount: 12,       // این هم می‌تونه از localStorage یا API بیاد
    }), [orders]);

    return (
        <div className="space-y-5 lg:space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    پیشخوان کاربری
                </h1>
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            <DashboardSummaryCards summary={summary} isLoading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <DashboardRecentOrders orders={orders} isLoading={isLoading} />
                </div>
                <div className="lg:col-span-1">
                    <DashboardRecommendedProducts products={products} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
