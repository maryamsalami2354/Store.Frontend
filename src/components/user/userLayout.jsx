// =============================================================================
// FILE: userLayout.jsx (اصلاح‌شده - منوی تیکت‌ها اضافه شد + Outlet)
// =============================================================================
import React, {useState, useEffect} from 'react';
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    Grid, ShoppingBag, MapPin, Heart, DollarSign, User, LogOut,
    Menu, X, Home, ChevronLeft, Bell, Sun, Moon, Gift, RotateCcw, MessageSquare
} from 'react-feather';
import {toast} from 'react-toastify';
import useStore from '../../store/index.js';
import { getMe } from '../../services/authApi.js';
import { DEFAULT_AVATAR, getUserFullName, normalizeAuthUser } from '../../utils/helpers/authUser.js';

const menuItems = [
    {path: '/user', label: 'پیشخوان', icon: Grid, exact: true},
    {path: '/user/orders', label: 'سفارشات من', icon: ShoppingBag},
    {path: '/user/addresses', label: 'آدرس‌های من', icon: MapPin},
    {path: '/user/wishlist', label: 'علاقه‌مندی‌ها', icon: Heart},
    {path: '/user/wallet', label: 'کیف پول', icon: DollarSign},
    {path: '/user/gift-cards', label: 'کارت هدیه', icon: Gift},
    {path: '/user/returns', label: 'بازگشت کالا', icon: RotateCcw},
    {path: '/user/tickets', label: 'تیکت‌ها', icon: MessageSquare},
    {path: '/user/profile', label: 'پروفایل', icon: User},
];

const UserLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const accessToken = useStore((state) => state.accessToken);
    const setAuthState = useStore((state) => state.setState);
    const logout = useStore((state) => state.logout);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    useEffect(() => {
        let ignore = false;

        const loadUser = async () => {
            if (!accessToken) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            try {
                const profile = normalizeAuthUser(await getMe());

                if (ignore) return;

                setUser(profile);
                setAuthState({ accessToken, user: profile });
            } catch {
                if (!ignore) {
                    setUser(normalizeAuthUser(useStore.getState().user));
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        loadUser();
        return () => {
            ignore = true;
        };
    }, [accessToken, setAuthState]);

    const handleLogout = async () => {
        await logout();
        toast.success('با موفقیت خارج شدید');
        navigate('/login');
    };

    const isActive = (path, exact) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a]" dir="rtl">
            <div className="lg:flex max-w-[1440px] mx-auto min-h-screen">
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside
                    className={`
                        fixed lg:sticky top-0 right-0 h-full w-64 
                        bg-white dark:bg-[#0f1117] 
                        border-l border-gray-200 dark:border-gray-800
                        flex flex-col flex-shrink-0
                        transition-transform duration-300 ease-out
                        z-50 lg:z-0
                        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                    `}>
                    <div className="p-4 bg-gradient-to-l from-[#002874]/10 to-transparent dark:from-[#4C6FB6]/10">
                        <button onClick={() => setSidebarOpen(false)}
                                className="lg:hidden absolute left-4 top-4 p-2 rounded-lg hover:bg-white/20">
                            <X size={18} className="text-gray-700 dark:text-gray-300"/>
                        </button>
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-2">
                                {isLoading ? (
                                    <Skeleton width={64} height={64} borderRadius={16} className="dark:!bg-gray-800"/>
                                ) : (
                                    <>
                                        <img src={user?.avatar || DEFAULT_AVATAR} alt={getUserFullName(user)}
                                             className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-md"/>
                                        <span
                                            className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                    </>
                                )}
                            </div>
                            {isLoading ? (
                                <>
                                    <Skeleton width={100} height={20} className="dark:!bg-gray-800 mb-1"/>
                                    <Skeleton width={140} height={12} className="dark:!bg-gray-800"/>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-bold text-gray-800 dark:text-white text-base">{getUserFullName(user)}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email || user?.phoneNumber || ''}</p>
                                </>
                            )}
                        </div>
                    </div>

                    <nav className="flex-1 py-3 px-3 overflow-y-auto">
                        <p className="px-2 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">حساب کاربری</p>
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const active = isActive(item.path, item.exact);
                                return (
                                    <li key={item.path}>
                                        <Link to={item.path}
                                              className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 ${active ? 'bg-[#002874] text-white shadow-md ' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                            <item.icon size={18}
                                                       className={`transition-transform group-hover:scale-110 ${active ? 'text-white' : ''}`}/>
                                            <span className="text-xs font-medium flex-1">{item.label}</span>
                                            {active && <ChevronLeft size={14} className="opacity-70"/>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1.5">
                        <Link to="/"
                              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            <Home size={18}/><span className="text-xs font-medium">بازگشت به فروشگاه</span>
                        </Link>
                        <button onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                            <LogOut size={18}/><span className="text-xs font-medium">خروج</span>
                        </button>
                    </div>
                </aside>

                <div className="flex-1 flex flex-col min-w-0">
                    <div
                        className="lg:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-white dark:bg-[#0f1117] border-b border-gray-200 dark:border-gray-800">
                        <button onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Menu size={22} className="text-gray-700 dark:text-gray-300"/>
                        </button>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">پنل کاربری</h2>
                        <div className="w-10"/>
                    </div>
                    <main className="flex-1 p-4 lg:p-6">
                        {children || <Outlet />}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default UserLayout;
