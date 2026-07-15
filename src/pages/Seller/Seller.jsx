// =============================================================================
// FILE: Seller.jsx (اصلاح‌شده - مسیر tickets)
// =============================================================================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SellerLayout from '../../components/seller/sellerLayout';
import SellerHome from '../../components/seller/sellerHome/sellerHome.jsx';
import SellerProducts from '../../components/seller/sellerProducts/sellerProducts';
import SellerOrders from '../../components/seller/sellerOrders/sellerOrders';
import SellerFinance from '../../components/seller/sellerFinance/sellerFinance';
import SellerReviews from '../../components/seller/sellerReviews/sellerReviews';
import SellerInventory from '../../components/seller/sellerInventory/sellerInventory';
import SellerAnalytics from '../../components/seller/sellerAnalytics/sellerAnalytics';
import SellerReturns from '../../components/seller/sellerReturns/sellerReturns';
import SellerTickets from '../../components/seller/sellerTickets/sellerTickets';

const Seller = () => {
    return (
        <SellerLayout>
            <Routes>
                <Route index element={<SellerHome />} />
                <Route path="products" element={<SellerProducts />} />
                <Route path="orders" element={<SellerOrders />} />
                <Route path="returns" element={<SellerReturns />} />
                <Route path="tickets" element={<SellerTickets />} />
                <Route path="finance" element={<SellerFinance />} />
                <Route path="reviews" element={<SellerReviews />} />
                <Route path="inventory" element={<SellerInventory />} />
                <Route path="analytics" element={<SellerAnalytics />} />
            </Routes>
        </SellerLayout>
    );
};

export default Seller;