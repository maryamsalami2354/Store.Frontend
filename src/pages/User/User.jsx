// =============================================================================
// FILE: User.jsx (اصلاح‌شده - مسیر tickets)
// =============================================================================
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from '../../components/user/userLayout';
import UserDashboard from '../../components/user/userDashboard/userDashboard';
import UserOrders from '../../components/user/userOrders/userOrders';
import UserAddresses from '../../components/user/userAddresses/userAddresses';
import UserWishlist from '../../components/user/userWishlist/userWishlist';
import UserWallet from '../../components/user/userWallet/userWallet';
import UserProfile from '../../components/user/userProfile/userProfile';
import UserGiftCards from "../../components/user/userGiftCards/userGiftCards.jsx";
import UserReturns from "../../components/user/userReturns/userReturns.jsx";
import UserReturnDetail from "../../components/user/userReturnDetail/userReturnDetail.jsx";
import UserTickets from "../../components/user/userTickets/userTickets.jsx";
import UserNewTicket from "../../components/user/userNewTicket/userNewTicket.jsx";

const User = () => {
    return (
        <UserLayout>
            <Routes>
                <Route index element={<UserDashboard />} />
                <Route path="orders" element={<UserOrders />} />
                <Route path="addresses" element={<UserAddresses />} />
                <Route path="wishlist" element={<UserWishlist />} />
                <Route path="wallet" element={<UserWallet />} />
                <Route path="tickets/new" element={<UserNewTicket />} />
                <Route path="returns" element={<UserReturns />} />
                <Route path="returns/:id" element={<UserReturnDetail />} />
                <Route path="tickets" element={<UserTickets />} />
                <Route path="gift-cards" element={<UserGiftCards />} />
                <Route path="profile" element={<UserProfile />} />
            </Routes>
        </UserLayout>
    );
};

export default User;