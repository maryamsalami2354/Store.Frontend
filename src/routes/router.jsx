import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MiddleWar from "../services/authService.jsx";
import Root from "../pages/Root";
import Login from "../pages/Login";
import SellerDisabled from "../pages/SellerDisabled";
import Admin from "../pages/Admin";
import AdminLogin from "../pages/AdminLogin";
import User from "../pages/User";
import Blogs from "../pages/Blogs";
import PageSkeleton from "../components/skeleton/MainSkeleton/MainSkeleton";
import SingleProduct from "../pages/SingleProduct";
import ProductsPageSearch from "../pages/ProductsSearch";
import Faq from "../pages/Faq";
import ContactUs from "../pages/ContactUs";
import AboutUs from "../pages/AboutUs";
import TermsAndConditions from "../pages/TermsAndConditions";
import Brands from "../pages/Brands";
import Categories from "../pages/Categories";
import Category from "../pages/Category";
import AmazingProducts from "../pages/AmazingProducts";
import MostVisitedProducts from "../pages/MostVisitedProducts";
import Brand from "../pages/Brand";
import Blog from "../pages/Blog";
import Cart from "../pages/Cart";
import Shipping from "../pages/Shipping";
import Payment from "../pages/Payment";
import PaymentResult from "../pages/PaymentResult";
import SellerRegister from "../pages/SellerRegister";
import NotFound from "../pages/NotFound";
import Comparison from "../pages/Comparison";
import BestSellers from "../pages/BestSellers";
import SellerProfile from "../pages/SellerProfile";
import ReturnPolicy from "../pages/ReturnPolicy";
import Privacy from "../pages/Privacy";
import Guarantee from "../pages/Guarantee";
import Club from "../pages/Club";
import Index2 from "../pages/index2";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MiddleWar />,
    children: [
      // =========================================================================
      // HOME
      // =========================================================================
      { index: true, element: <Root /> },
      { path: "index2", element: <Index2 /> },
      // =========================================================================
      // AUTH
      // =========================================================================
      { path: "login", element: <PageSkeleton><Login /></PageSkeleton> },
      { path: "admin/login", element: <AdminLogin /> },

      // =========================================================================
      // PRODUCTS
      // =========================================================================
      { path: "product/:id", element: <PageSkeleton><SingleProduct /></PageSkeleton> },
      { path: "search", element: <PageSkeleton><ProductsPageSearch /></PageSkeleton> },
      { path: "amazing", element: <PageSkeleton><AmazingProducts /></PageSkeleton> },
      { path: "most-viewed", element: <PageSkeleton><MostVisitedProducts /></PageSkeleton> },
      { path: "comparison", element: <PageSkeleton><Comparison /></PageSkeleton> },

      // =========================================================================
      // CATEGORIES & BRANDS
      // =========================================================================
      { path: "categories", element: <PageSkeleton><Categories /></PageSkeleton> },
      { path: "category/:id", element: <PageSkeleton><Category /></PageSkeleton> },
      { path: "brands", element: <PageSkeleton><Brands /></PageSkeleton> },
      { path: "brand/:id", element: <PageSkeleton><Brand /></PageSkeleton> },

      // =========================================================================
      // SELLERS
      // =========================================================================
      { path: "seller-register", element: <PageSkeleton><SellerRegister /></PageSkeleton> },
      { path: "best-sellers", element: <PageSkeleton><BestSellers /></PageSkeleton> },
      { path: "seller-profile/:id", element: <PageSkeleton><SellerProfile /></PageSkeleton> },

      // =========================================================================
      // CART & CHECKOUT
      // =========================================================================
      { path: "cart", element: <PageSkeleton><Cart /></PageSkeleton> },
      { path: "shipping", element: <PageSkeleton><Shipping /></PageSkeleton> },
      { path: "payment", element: <PageSkeleton><Payment /></PageSkeleton> },
      { path: "payment/result", element: <PageSkeleton><PaymentResult /></PageSkeleton> },

      // =========================================================================
      // BLOG
      // =========================================================================
      { path: "blogs", element: <PageSkeleton><Blogs /></PageSkeleton> },
      { path: "blog/:id", element: <PageSkeleton><Blog /></PageSkeleton> },

      // =========================================================================
      // CUSTOMER CLUB
      // =========================================================================
      { path: "club", element: <PageSkeleton><Club /></PageSkeleton> },

      // =========================================================================
      // STATIC PAGES
      // =========================================================================
      { path: "about", element: <PageSkeleton><AboutUs /></PageSkeleton> },
      { path: "contact", element: <PageSkeleton><ContactUs /></PageSkeleton> },
      { path: "faq", element: <PageSkeleton><Faq /></PageSkeleton> },
      { path: "terms", element: <PageSkeleton><TermsAndConditions /></PageSkeleton> },
      { path: "privacy", element: <PageSkeleton><Privacy /></PageSkeleton> },
      { path: "return-policy", element: <PageSkeleton><ReturnPolicy /></PageSkeleton> },
      { path: "guarantee", element: <PageSkeleton><Guarantee /></PageSkeleton> },

      // =========================================================================
      // USER PANEL
      // =========================================================================
      { path: "user/*", element: <PageSkeleton><User /></PageSkeleton> },

      // =========================================================================
      // SELLER PANEL
      // =========================================================================
      { path: "seller/*", element: <PageSkeleton><SellerDisabled /></PageSkeleton> },

      // =========================================================================
      // ADMIN PANEL
      // =========================================================================
      { path: "admin/*", element: <Admin /> },

      // =========================================================================
      // 404
      // =========================================================================
      { path: "*", element: <PageSkeleton><NotFound /></PageSkeleton> },
    ],
  },
]);

export default router;
