// src/components/seller/sellerInventory/sellerInventory.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { toast } from 'react-toastify';
import InventorySummaryCards from './inventorySummaryCards';
import InventoryFilterBar from './inventoryFilterBar';
import InventoryList from './inventoryList';
import InventoryAdjustModal from './inventoryAdjustModal';
import ProductsPagination from '../sellerProducts/productsPagination';

const ITEMS_PER_PAGE = 10;

const SellerInventory = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [adjustModal, setAdjustModal] = useState({ isOpen: false, product: null });

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const enhanced = ([]).map(p => ({
                ...p,
                stock: p.stock ?? Math.floor(Math.random() * 30) + 1,
                minStock: p.minStock ?? 5,
                lastUpdated: p.lastUpdated ?? '۱۴۰۴/۰۱/۲۵',
                warehouse: p.warehouse ?? 'تهران',
            }));
            setProducts(enhanced);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // Fuse.js برای جستجوی هوشمند
    const fuse = useMemo(() => {
        return new Fuse(products, {
            keys: ['name', 'sku', 'shortDescription'],
            threshold: 0.3,
            minMatchCharLength: 2,
        });
    }, [products]);

    // خلاصه آماری
    const summary = useMemo(() => {
        const total = products.length;
        const available = products.filter(p => p.stock > (p.minStock || 5)).length;
        const lowStock = products.filter(p => p.stock > 0 && p.stock <= (p.minStock || 5)).length;
        const outOfStock = products.filter(p => p.stock === 0).length;
        const totalValue = products.reduce((sum, p) => {
            const price = parseInt((p.price || '0').replace(/[^\d]/g, ''));
            return sum + (price * (p.stock || 0));
        }, 0);
        return { total, available, lowStock, outOfStock, totalValue };
    }, [products]);

    // دسته‌بندی‌ها
    const categories = useMemo(() => {
        const cats = [...new Set(products.map(p => p.categoryId))];
        return cats.map(id => ({ id, name: `دسته ${id}` }));
    }, [products]);

    // فیلتر و جستجو
    const filteredProducts = useMemo(() => {
        let result = searchQuery.trim()
            ? fuse.search(searchQuery.trim()).map(r => r.item)
            : [...products];

        const min = 5;
        if (statusFilter === 'available') result = result.filter(p => p.stock > min);
        else if (statusFilter === 'low-stock') result = result.filter(p => p.stock > 0 && p.stock <= min);
        else if (statusFilter === 'out-of-stock') result = result.filter(p => p.stock === 0);

        if (categoryFilter !== 'all') {
            result = result.filter(p => p.categoryId === parseInt(categoryFilter));
        }

        switch (sortBy) {
            case 'stock-asc': result.sort((a, b) => a.stock - b.stock); break;
            case 'stock-desc': result.sort((a, b) => b.stock - a.stock); break;
            case 'newest': result.sort((a, b) => b.id - a.id); break;
            default: result.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
        }

        return result;
    }, [products, searchQuery, statusFilter, categoryFilter, sortBy, fuse]);

    // صفحه‌بندی
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, categoryFilter, sortBy]);

    const handleAdjust = (product, quantity, type, reason) => {
        const delta = type === 'increase' ? quantity : -quantity;
        setProducts(prev => prev.map(p =>
            p.id === product.id
                ? { ...p, stock: Math.max(0, p.stock + delta), lastUpdated: new Date().toLocaleDateString('fa-IR') }
                : p
        ));
        toast.success(`موجودی ${product.name} با موفقیت به‌روزرسانی شد`);
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">انبار و موجودی</h1>
            </div>

            <InventorySummaryCards summary={summary} isLoading={isLoading} />

            <InventoryFilterBar
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
                sortBy={sortBy} setSortBy={setSortBy}
                categories={categories}
            />

            <InventoryList
                isLoading={isLoading}
                products={paginatedProducts}
                onAdjust={(product) => setAdjustModal({ isOpen: true, product })}
            />

            {!isLoading && filteredProducts.length > 0 && (
                <ProductsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <InventoryAdjustModal
                isOpen={adjustModal.isOpen}
                product={adjustModal.product}
                onClose={() => setAdjustModal({ isOpen: false, product: null })}
                onAdjust={handleAdjust}
            />
        </div>
    );
};

export default SellerInventory;