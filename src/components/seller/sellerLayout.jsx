// =============================================================================
// FILE: SellerLayout.jsx (اصلاح‌شده - کامل)
// =============================================================================
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    PieChart, Package, ShoppingBag, DollarSign, Star,
    Archive, BarChart2, LogOut, Menu, X, Home,
    ChevronLeft, Award, RotateCcw, MessageSquare
} from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import usersData from '../../../public/jsons/users.json';

const menuItems = [
    { path: '/seller', label: 'پیشخوان', icon: PieChart, exact: true },
    { path: '/seller/products', label: 'محصولات', icon: Package },
    { path: '/seller/orders', label: 'سفارش‌ها', icon: ShoppingBag },
    { path: '/seller/returns', label: 'مرجوعی‌ها', icon: RotateCcw },
    { path: '/seller/tickets', label: 'تیکت‌ها', icon: MessageSquare },
    { path: '/seller/finance', label: 'مالی', icon: DollarSign },
    { path: '/seller/reviews', label: 'نظرات', icon: Star },
    { path: '/seller/inventory', label: 'انبار', icon: Archive },
    { path: '/seller/analytics', label: 'گزارشات', icon: BarChart2 },
];

const SellerLayout = ( { children } ) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    useEffect(() => {
        const loadUser = async () => {
            await new Promise(resolve => setTimeout(resolve, 0.1));
            setUser(usersData[0] || null);
            setIsLoading(false);
        };
        loadUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('با موفقیت خارج شدید');
        navigate('/login');
    };

    const isActive = (path, exact) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a]" dir="rtl">
            <div className="flex max-w-[1440px] mx-auto min-h-screen">
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                <aside className={`fixed lg:sticky top-0 right-0 h-full w-64 bg-white dark:bg-[#0f1117] border-l border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 transition-transform duration-300 ease-out z-50 lg:z-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                    <div className="p-4 bg-gradient-to-l from-[#002874]/10 to-transparent dark:from-[#4C6FB6]/10">
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute left-4 top-4 p-2 rounded-lg hover:bg-white/20">
                            <X size={18} className="text-gray-700 dark:text-gray-300" />
                        </button>
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-2">
                                {isLoading ? (
                                    <Skeleton width={64} height={64} borderRadius={16} className="dark:!bg-gray-800" />
                                ) : (
                                    <>
                                        <img src={`${user?.avatar || '1.png'}`} alt={user?.name || 'Avatar'} className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-md" />
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                    </>
                                )}
                            </div>
                            {isLoading ? (
                                <>
                                    <Skeleton width={100} height={20} className="dark:!bg-gray-800 mb-1" />
                                    <Skeleton width={140} height={12} className="dark:!bg-gray-800" />
                                </>
                            ) : (
                                <>
                                    <h3 className="font-bold text-gray-800 dark:text-white text-base">{user?.name || 'فروشگاه کالا'}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email || 'mehrdad@example.com'}</p>
                                </>
                            )}
                            <div className="flex items-center gap-1 mt-2">
                                <Award size={14} className="text-[#002874] dark:text-[#4C6FB6]" />
                                <span className="text-[10px] font-medium text-[#002874] dark:text-[#4C6FB6] bg-[#002874]/10 dark:bg-[#4C6FB6]/20 px-2 py-0.5 rounded-full">فروشنده ویژه</span>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 py-3 px-3 min-h-0">
                        <p className="px-2 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">مدیریت فروشگاه</p>
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const active = isActive(item.path, item.exact);
                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                                active
                                                    ? 'bg-[#002874] text-white shadow-md'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <item.icon size={18} className={`transition-transform group-hover:scale-110 ${active ? 'text-white' : ''}`} />
                                            <span className="text-xs font-medium flex-1">{item.label}</span>
                                            {active && <ChevronLeft size={14} className="opacity-70" />}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1.5 flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            <Home size={18} /><span className="text-xs font-medium">بازگشت به فروشگاه</span>
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                            <LogOut size={18} /><span className="text-xs font-medium">خروج از حساب</span>
                        </button>
                    </div>
                </aside>

                <div className="flex-1 flex flex-col min-w-0">
                    <div className="lg:hidden sticky top-0 right-0 z-30 p-4 bg-gray-100 dark:bg-[#0a0a0a]">
                        <button onClick={() => setSidebarOpen(true)} className="p-2.5 rounded-xl bg-white dark:bg-[#0f1117] shadow-lg border border-gray-200 dark:border-gray-800">
                            <Menu size={20} className="text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>
                    <main className="flex-1 p-4 lg:p-6">
                        {children || <Outlet />}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SellerLayout;