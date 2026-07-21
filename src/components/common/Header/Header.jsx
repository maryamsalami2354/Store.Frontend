// =============================================================================
// FILE: Header.jsx (کامل - با منوی کاربری ریسپانسیو)
// =============================================================================
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import navItemsDataJson from '../../../../public/jsons/navItems.json';
import { getCatalogBrands, getCatalogCategories, getCatalogProducts } from '../../../services/catalogApi.js';
import { getCart, removeCartItem, updateCartItem } from '../../../services/cartApi.js';
import { toAssetUrl } from '../../../services/authApi.js';
import useStore from '../../../store/index.js';
import { getUserFullName } from '../../../utils/helpers/authUser.js';
import { toast } from 'react-toastify';
import {
    Menu, X, Search, ShoppingBag, User, Sun, Moon,
    Home, Grid, HelpCircle, Truck, FileText, Phone, ChevronDown,
    ChevronRight, Smartphone, Watch, Coffee, Tool, ShoppingBag as BagIcon, ChevronLeft,
    Trash2, Plus, Minus, AlertCircle, Tag, LogOut
} from 'react-feather';
const getCategoryName = (categoryId, categories) => {
    if (!categories) return 'نامشخص';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'نامشخص';
};
const getBrandName = (brandId, brands) => {
    if (!brands) return 'نامشخص';
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : 'نامشخص';
};
const Header = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);
    const [activeMegaCategory, setActiveMegaCategory] = useState(1);
    const [offcanvasLeft, setOffcanvasLeft] = useState(false);
    const [offcanvasRight, setOffcanvasRight] = useState(false);
    const [mobileCategoryOpen, setMobileCategoryOpen] = useState(null);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [catalogCategories, setCatalogCategories] = useState([]);
    const [catalogBrands, setCatalogBrands] = useState([]);
    const [catalogProducts, setCatalogProducts] = useState([]);
    const lastScrollY = useRef(0);
    const headerRef = useRef(null);
    const headerHeightRef = useRef(0);
    const categoriesData = useMemo(() => ({ categories: catalogCategories }), [catalogCategories]);
    const navItemsData = navItemsDataJson;
    const accessToken = useStore((state) => state.accessToken);
    const user = useStore((state) => state.user);
    const logout = useStore((state) => state.logout);
    const setCartStore = useStore((state) => state.setCart);
    const cartStore = useStore((state) => state.cart);
    const isLoggedIn = !!accessToken;
    const userFullName = getUserFullName(user);
    const toEnglishDigits = (str) => {
        if (!str) return '';
        const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let result = str;
        persian.forEach((p, i) => result = result.replace(new RegExp(p, 'g'), english[i]));
        return result;
    };
    const [cartItems, setCartItems] = useState([]);
    const searchRef = useRef(null);
    const megaMenuRef = useRef(null);
    const mobileSearchRef = useRef(null);
    const desktopUserMenuRef = useRef(null);
    const mobileUserMenuRef = useRef(null);
    const fuse = useMemo(() => {
        if (!catalogProducts.length) return null;
        return new Fuse(catalogProducts, { keys: ['name'], threshold: 0.3 });
    }, [catalogProducts]);
    useEffect(() => {
        let isMounted = true;

        const loadHeaderCategories = async () => {
            try {
                const [categoriesResponse, brandsResponse, productsResponse] = await Promise.all([
                    getCatalogCategories(),
                    getCatalogBrands(),
                    getCatalogProducts({ page: 1, pageSize: 200 }),
                ]);

                if (!isMounted) return;
                setCatalogCategories(categoriesResponse.categories || []);
                setCatalogBrands(brandsResponse.brands || []);
                setCatalogProducts(productsResponse.products || []);
            } catch {
                if (!isMounted) return;
                setCatalogCategories([]);
                setCatalogBrands([]);
                setCatalogProducts([]);
            }
        };

        loadHeaderCategories();

        return () => {
            isMounted = false;
        };
    }, []);
    useEffect(() => {
        let isMounted = true;

        const loadCart = async () => {
            try {
                const data = await getCart();
                if (!isMounted) return;
                setCartItems(data.items || []);
                setCartStore(data);
            } catch {
                if (!isMounted) return;
                setCartItems([]);
                setCartStore({ items: [], subtotal: 0, grandTotal: 0, totalItems: 0, totalItemCount: 0 });
            }
        };

        loadCart();

        return () => {
            isMounted = false;
        };
    }, [accessToken, setCartStore]);
    useEffect(() => {
        if (cartStore) setCartItems(cartStore.items || []);
    }, [cartStore]);
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) setShowResults(false);
            if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) setActiveMegaMenu(null);
            if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) setMobileSearchOpen(false);
            const clickedInsideDesktopUserMenu = desktopUserMenuRef.current?.contains(event.target);
            const clickedInsideMobileUserMenu = mobileUserMenuRef.current?.contains(event.target);
            if (!clickedInsideDesktopUserMenu && !clickedInsideMobileUserMenu) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    useEffect(() => {
        document.body.style.overflowX = 'hidden';
        return () => { document.body.style.overflowX = ''; };
    }, []);
    useEffect(() => {
        const updateHeaderHeight = () => { if (headerRef.current) headerHeightRef.current = headerRef.current.offsetHeight; };
        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);
        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, []);
    useEffect(() => {
        const handleScroll = () => {
            const current = window.scrollY;
            if (current > lastScrollY.current && current > headerHeightRef.current) setShowHeader(false);
            else setShowHeader(true);
            lastScrollY.current = current;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 0 && fuse) {
            setSearchResults(fuse.search(query).map(r => r.item));
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };
    const toggleMegaMenu = (id) => { setActiveMegaMenu(id); if (categoriesData?.categories?.length) setActiveMegaCategory(categoriesData.categories[0].id); };
    const closeMegaMenu = () => setActiveMegaMenu(null);
    const toggleMobileCategory = (id) => setMobileCategoryOpen(prev => prev === id ? null : id);
    const getCategoryIcon = (iconName) => {
        const icons = { Smartphone, Watch, Home, Coffee, Tool, BagIcon };
        const Icon = icons[iconName] || Smartphone;
        return <Icon className="size-5" />;
    };
    const updateQuantity = async (id, q) => {
        if (q < 1) return;

        try {
            const data = await updateCartItem({ itemId: id, quantity: q });
            setCartItems(data.items || []);
            setCartStore(data);
        } catch (error) {
            toast.error(error.message || 'خطا در تغییر تعداد محصول');
        }
    };
    const removeItem = async (id) => {
        try {
            const data = await removeCartItem(id);
            setCartItems(data.items || []);
            setCartStore(data);
        } catch (error) {
            toast.error(error.message || 'خطا در حذف محصول از سبد');
        }
    };
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const formattedTotalPrice = useMemo(() => {
        const total = cartItems.reduce((sum, item) => {
            const cleaned = toEnglishDigits(item.price || '').replace(/[^\d]/g, '');
            const num = parseInt(cleaned, 10);
            return sum + (isNaN(num) ? 0 : num * item.quantity);
        }, 0);
        return total.toLocaleString('fa-IR');
    }, [cartItems]);
    const handleLogout = async () => {
        await logout();
        setUserMenuOpen(false);
        navigate('/');
    };
    return (
        <>
            <header
                ref={headerRef}
                className={`sticky top-0 start-0 end-0 z-50 transition-transform duration-300 bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 shadow-sm w-full ${
                    !showHeader ? '-translate-y-full' : 'translate-y-0'
                }`}
            >
                <div className="px-3 md:px-4 lg:px-6 max-w-[1440px] mx-auto w-full">
                    {/* ردیف بالایی */}
                    <div className="flex items-center justify-between py-2">
                        <button onClick={() => setOffcanvasRight(true)} className="xl:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Menu className="size-6 text-gray-700 dark:text-gray-200" />
                        </button>
                        <Link to="/" className="flex-shrink-0">
                            <img src="/images/logos/with-border.svg" className="h-11 md:h-13 w-auto" alt="Logo" />
                        </Link>
                        <div className="hidden xl:block flex-1 max-w-2xl mx-6" ref={searchRef}>
                            <div className="relative">
                                <input
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    onFocus={() => searchQuery && setShowResults(true)}
                                    placeholder="جستجوی محصولات ...."
                                    className="w-full py-2.5 ps-4 pe-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-[#002874]"
                                />
                                <button className="absolute end-1 top-1/2 -translate-y-1/2 p-2">
                                    <Search className="size-4 text-gray-400" />
                                </button>
                                {showResults && (
                                    <div className="absolute top-full start-0 end-0 z-[70] mt-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
                                        {searchResults.length > 0 ? (
                                            <div className="max-h-80 overflow-y-auto">
                                                {searchResults.map(res => (
                                                    <div
                                                        key={res.id}
                                                        onClick={() => { setShowResults(false); setSearchQuery(''); navigate(`/product/${res.id}`); }}
                                                        className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b last:border-0"
                                                    >
                                                        <div className="w-9 h-9 rounded-xl bg-[#002874]/10 dark:bg-[#4C6FB6]/20 flex items-center justify-center ml-3">
                                                            <Search className="size-4 text-[#002874]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{res.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {getCategoryName(res.categoryId, categoriesData?.categories)} • {getBrandName(res.brandId, catalogBrands)}
                                                            </p>
                                                        </div>
                                                        <span className="mr-auto text-xs font-medium" style={{ color: '#4C6FB6' }}>{res.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 text-center text-gray-500">محصولی یافت نشد</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setMobileSearchOpen(true)} className="xl:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Search className="size-5" />
                            </button>
                            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                                {darkMode ? <Sun className="size-5 text-amber-400" /> : <Moon className="size-5" />}
                            </button>
                            <button onClick={() => setOffcanvasLeft(true)} className="relative p-2 rounded-xl bg-[#002874] text-white hover:bg-[#001d5a]">
                                <ShoppingBag className="size-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -end-1 size-5 text-xs bg-red-500 rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                            {/* ================================================================ */}
                            {/* DESKTOP USER MENU */}
                            {/* ================================================================ */}
                            <div className="hidden xl:flex items-center" ref={desktopUserMenuRef}>
                                {isLoggedIn ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-[#002874] hover:text-white dark:hover:bg-[#4C6FB6] transition-colors"
                                            title={userFullName}
                                        >
                                            <User className="size-5" />
                                        </button>
                                        {userMenuOpen && (
                                            <div className="absolute top-full left-0 mt-1 w-60 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{userFullName}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user?.phoneNumber || user?.email || ''}</p>
                                                </div>
                                                <Link to="/user" onClick={() => { setUserMenuOpen(false); navigate('/user'); }} className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-[#002874] dark:hover:text-[#4C6FB6] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <User size={16} /> پنل کاربری
                                                </Link>
                                                <Link to="/seller" onClick={() => { setUserMenuOpen(false); navigate('/seller'); }} className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                                                    <ShoppingBag size={16} /> پنل فروشندگی غیرفعال
                                                </Link>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-100 dark:border-gray-800">
                                                    <LogOut size={16} /> خروج
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link to="/login" className="flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <User className="size-5" />
                                        <span className="text-sm font-medium">ورود | ثبت نام</span>
                                    </Link>
                                )}
                            </div>
                            {/* ================================================================ */}
                            {/* MOBILE USER ICON */}
                            {/* ================================================================ */}
                            <div className="xl:hidden" ref={mobileUserMenuRef}>
                                {isLoggedIn ? (
                                    <div className="relative">
                                        <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800" title={userFullName}>
                                            <User className="size-5" />
                                        </button>
                                        {userMenuOpen && (
                                            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{userFullName}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user?.phoneNumber || user?.email || ''}</p>
                                                </div>
                                                <Link to="/user" onClick={() => { setUserMenuOpen(false); navigate('/user'); }} className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-[#002874] dark:hover:text-[#4C6FB6] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <User size={16} /> پنل کاربری
                                                </Link>
                                                <Link to="/seller" onClick={() => { setUserMenuOpen(false); navigate('/seller'); }} className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                                                    <ShoppingBag size={16} /> پنل فروشندگی غیرفعال
                                                </Link>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-100 dark:border-gray-800">
                                                    <LogOut size={16} /> خروج
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link to="/login" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <User className="size-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* مگامنو */}
                    <div ref={megaMenuRef} className="hidden xl:block relative" onMouseLeave={closeMegaMenu}>
                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-900">
                            <ul className="flex items-center gap-x-1">
                                <li className="relative" onMouseEnter={() => toggleMegaMenu('fire')}>
                                    <a href="#" className="flex items-center gap-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <Grid className="size-5" /> فروشگاه <ChevronDown className="size-4" />
                                    </a>
                                    {activeMegaMenu === 'fire' && categoriesData?.categories && (
                                        <div className="absolute start-0 top-full mt-2 w-[900px] max-w-[90vw] bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-[100]">
                                            <div className="grid grid-cols-12">
                                                <div className="col-span-3 h-[420px] overflow-y-auto border-e border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-s-2xl">
                                                    <ul className="py-2">
                                                        {categoriesData.categories.map(cat => (
                                                            <li key={cat.id} onMouseEnter={() => setActiveMegaCategory(cat.id)} className={`mx-2 my-0.5 rounded-xl cursor-pointer ${activeMegaCategory === cat.id ? 'bg-[#002874] text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                                                                <div className="flex items-center justify-between py-2.5 px-3">
                                                                    <div className="flex items-center">
                                                                        <span className="ml-2">{getCategoryIcon(cat.icon)}</span>
                                                                        <span className="text-sm font-medium">{cat.name}</span>
                                                                    </div>
                                                                    <ChevronLeft className="size-4" />
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="col-span-9 bg-white dark:bg-[#111] rounded-e-2xl">
                                                    {categoriesData.categories.map(cat => (
                                                        <div key={cat.id} className={`h-[420px] overflow-y-auto p-5 ${activeMegaCategory === cat.id ? 'block' : 'hidden'}`}>
                                                            <div className="grid grid-cols-4 gap-6">
                                                                <div className="col-span-3">
                                                                    <div className="grid grid-cols-3 gap-4">
                                                                        {cat.subcategories?.map(sub => (
                                                                            <div key={sub.id}>
                                                                                <p className="text-sm font-bold text-[#002874] dark:text-[#4C6FB6] mb-3">{sub.name}</p>
                                                                                <div className="space-y-2">
                                                                                    {sub.items?.map((item, idx) => (
                                                                                        <Link key={`${sub.id}-${idx}`} to={`/category/${cat.id}/${sub.id}`} className="block text-xs text-gray-600 hover:text-[#002874]">{item}</Link>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    {cat.accessories && (
                                                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                                                            <p className="text-sm font-bold mb-3">لوازم جانبی</p>
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {cat.accessories.map(acc => (
                                                                                    <Link key={acc.id} to={`/accessory/${acc.id}`} className="text-xs px-3 py-1.5 bg-gray-100 rounded-full hover:bg-[#002874] dark:hover:bg-[#4C6FB6] hover:text-white">{acc.name}</Link>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <Link to={`/category/${cat.id}`}>
                                                                        <img src={cat.banner} className="w-full rounded-xl object-cover" alt={cat.name} />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </li>
                                {navItemsData?.navItems?.map(item => (
                                    <li key={item.id}>
                                        <Link to={item.href} className="flex items-center gap-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                            {item.icon === 'Home' && <Home className="size-5" />}
                                            {item.icon === 'Grid' && <Grid className="size-5" />}
                                            {item.icon === 'HelpCircle' && <HelpCircle className="size-5" />}
                                            {item.icon === 'Truck' && <Truck className="size-5" />}
                                            {item.icon === 'FileText' && <FileText className="size-5" />}
                                            {item.icon === 'Phone' && <Phone className="size-5" />}
                                            {item.icon === 'AlertCircle' && <AlertCircle className="size-5" />}
                                            {item.icon === 'Tag' && <Tag className="size-5" />}
                                            <span className="text-sm">{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <a href={`tel:${navItemsData?.hotline?.number}`} className="flex items-center gap-x-2 px-4 py-2.5 bg-[#002874] text-white rounded-2xl text-sm">
                                <Phone className="size-4" />
                                <span>{navItemsData?.hotline?.number}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            {/* Offcanvas Right (منوی موبایل) */}
            <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${offcanvasRight ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOffcanvasRight(false)} />
                <div className={`absolute top-0 start-0 h-full w-80 max-w-[85vw] bg-white dark:bg-[#0a0a0a] shadow-2xl transition-transform duration-300 overflow-y-auto ${offcanvasRight ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#0a0a0a]">
                        <img src="/images/logos/with-border.svg" className="h-13" alt="Logo" />
                        <button onClick={() => setOffcanvasRight(false)} className="p-2"><X className="size-5" /></button>
                    </div>
                    <nav className="p-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">دسته‌بندی محصولات</h3>
                        <div className="space-y-1">
                            {categoriesData?.categories?.map(cat => (
                                <div key={cat.id}>
                                    <button onClick={() => toggleMobileCategory(cat.id)} className="flex items-center justify-between w-full py-2.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <span className="flex items-center gap-3">{getCategoryIcon(cat.icon)} <span className="text-sm">{cat.name}</span></span>
                                        <ChevronDown className={`size-4 transition-transform ${mobileCategoryOpen === cat.id ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`overflow-hidden transition-all ${mobileCategoryOpen === cat.id ? 'max-h-96' : 'max-h-0'}`}>
                                        <div className="pr-8 py-1">
                                            {cat.subcategories?.map(sub => (
                                                <div key={sub.id} className="py-2">
                                                    <p className="text-xs font-bold text-[#002874] px-2">{sub.name}</p>
                                                    {sub.items?.map((item, idx) => (
                                                        <Link key={`${sub.id}-${idx}`} to={`/category/${cat.id}/${sub.id}`} onClick={() => setOffcanvasRight(false)} className="block py-2 px-2 text-xs text-gray-600 hover:text-[#002874]">{item}</Link>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t my-4"></div>
                        <ul className="space-y-1">
                            {navItemsData?.navItems?.map(item => (
                                <li key={item.id}>
                                    <Link to={item.href} onClick={() => setOffcanvasRight(false)} className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                                        {item.icon === 'Home' && <Home className="size-5" />}
                                        {item.icon === 'Grid' && <Grid className="size-5" />}
                                        {item.icon === 'HelpCircle' && <HelpCircle className="size-5" />}
                                        {item.icon === 'Truck' && <Truck className="size-5" />}
                                        {item.icon === 'FileText' && <FileText className="size-5" />}
                                        {item.icon === 'Phone' && <Phone className="size-5" />}
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t my-4"></div>
                        <button onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-3 w-full py-3 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                            {darkMode ? <Sun className="size-5 text-amber-400" /> : <Moon className="size-5" />}
                            <span>{darkMode ? 'حالت روشن' : 'حالت تاریک'}</span>
                        </button>
                    </nav>
                </div>
            </div>
            {/* مودال سرچ موبایل */}
            <div className={`fixed inset-0 z-[60] transition-opacity ${mobileSearchOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSearchOpen(false)} />
                <div ref={mobileSearchRef} className={`absolute inset-0 bg-white dark:bg-[#0a0a0a] transition-transform duration-300 overflow-y-auto ${mobileSearchOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white dark:bg-[#0a0a0a]">
                        <h2 className="text-lg font-bold flex items-center gap-2"><Search className="size-5" /> جستجو</h2>
                        <button onClick={() => setMobileSearchOpen(false)}><X className="size-5" /></button>
                    </div>
                    <div className="p-4">
                        <div className="relative">
                            <input value={searchQuery} onChange={handleSearch} autoFocus placeholder="جستجوی محصولات ...." className="w-full py-3 ps-4 pe-12 rounded-2xl border bg-gray-50 dark:bg-gray-900" />
                            <button className="absolute end-1 top-1/2 -translate-y-1/2 p-2"><Search className="size-4" /></button>
                        </div>
                    </div>
                    {searchQuery && (
                        <div className="px-4 pb-4">
                            <div className="border rounded-2xl overflow-hidden">
                                {searchResults.length > 0 ? (
                                    <div className="max-h-[60vh] overflow-y-auto">
                                        {searchResults.map(res => (
                                            <div key={res.id} onClick={() => { setMobileSearchOpen(false); navigate(`/product/${res.id}`); }} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0">
                                                <div className="w-9 h-9 rounded-xl bg-[#002874]/10 flex items-center justify-center ml-3"><Search className="size-4 text-[#002874]" /></div>
                                                <div><p className="text-sm">{res.name}</p><p className="text-xs text-gray-500">{getCategoryName(res.categoryId, categoriesData?.categories)}</p></div>
                                                <span className="mr-auto text-xs font-medium" style={{ color: '#4C6FB6' }}>{res.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : <div className="p-6 text-center text-gray-500">محصولی یافت نشد</div>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Offcanvas سبد خرید */}
            <div className={`fixed inset-0 z-[60] transition-opacity ${offcanvasLeft ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOffcanvasLeft(false)} />
                <div className={`absolute top-0 end-0 h-full w-full max-w-md bg-white dark:bg-[#0a0a0a] shadow-2xl transition-transform duration-300 flex flex-col ${offcanvasLeft ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingBag className="size-5" /> سبد خرید {totalItems > 0 && <span className="text-sm font-normal">({totalItems} کالا)</span>}</h2>
                        <button onClick={() => setOffcanvasLeft(false)}><X className="size-5" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingBag className="size-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">سبد خرید شما خالی است</p>
                                <button onClick={() => setOffcanvasLeft(false)} className="mt-6 px-6 py-2 bg-[#002874] text-white rounded-xl">بازگشت به فروشگاه</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg border flex items-center justify-center">
                                            {item.image ? <img src={toAssetUrl(item.image)} className="w-full h-full object-contain p-1" alt={item.name || item.productName} /> : <ShoppingBag className="size-6 text-gray-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium truncate">{item.name || item.productName}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.brand && `${item.brand} • `}{item.category}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-sm font-bold text-[#002874]">{item.price}</span>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1"><Minus className="size-3" /></button>
                                                    <span className="w-6 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1"><Plus className="size-3" /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="self-start p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="size-4" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {cartItems.length > 0 && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-[#0a0a0a]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">جمع کل:</span>
                                <span className="text-lg font-bold text-[#002874] dark:text-[#4C6FB6]">{formattedTotalPrice} تومان</span>
                            </div>
                            <Link to="/cart" onClick={() => setOffcanvasLeft(false)} className="w-full py-3 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#001d5a] dark:hover:bg-[#3a5a9a] transition-colors">
                                <ShoppingBag className="size-4" /> ادامه فرآیند خرید
                            </Link>
                            <button onClick={() => setOffcanvasLeft(false)} className="w-full mt-2 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                ادامه خرید
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default Header;
