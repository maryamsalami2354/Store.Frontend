// src/components/user/userWishlist/userWishlist.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { toast } from 'react-toastify';
import useCartActions from '../../../hooks/useCartActions.js';
import WishlistFilterBar from './wishlistFilterBar';
import WishlistGrid from './wishlistGrid';
import WishlistEmptyState from './wishlistEmptyState';
import ProductsPagination from '../../seller/sellerProducts/productsPagination';
import productsData from '../../../../public/jsons/products.json';

const ITEMS_PER_PAGE = 10;

const UserWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const { addProductToCart } = useCartActions();

    useEffect(() => {
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            // گرفتن ۱۵ محصول تصادفی برای تست صفحه‌بندی
            const allProducts = productsData.products || [];
            const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 15).map(p => ({
                ...p,
                addedToWishlist: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fa-IR'),
            }));
            setWishlist(selected);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // Fuse.js با کلیدهای بهینه
    const fuse = useMemo(() => {
        return new Fuse(wishlist, {
            keys: [
                { name: 'name', weight: 0.5 },
                { name: 'shortDescription', weight: 0.3 },
                { name: 'price', weight: 0.2 }
            ],
            threshold: 0.3,
            minMatchCharLength: 2,
            includeScore: true,
        });
    }, [wishlist]);

    const filteredWishlist = useMemo(() => {
        let result = searchQuery.trim()
            ? fuse.search(searchQuery.trim()).map(r => r.item)
            : [...wishlist];

        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => {
                    const aPrice = parseInt((a.price || '0').replace(/[^\d]/g, ''));
                    const bPrice = parseInt((b.price || '0').replace(/[^\d]/g, ''));
                    return aPrice - bPrice;
                });
                break;
            case 'price-desc':
                result.sort((a, b) => {
                    const aPrice = parseInt((a.price || '0').replace(/[^\d]/g, ''));
                    const bPrice = parseInt((b.price || '0').replace(/[^\d]/g, ''));
                    return bPrice - aPrice;
                });
                break;
            case 'name':
                result.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'fa'));
                break;
            default:
                result.sort((a, b) => new Date(b.addedToWishlist) - new Date(a.addedToWishlist));
        }

        return result;
    }, [wishlist, searchQuery, sortBy, fuse]);

    // صفحه‌بندی
    const totalPages = Math.ceil(filteredWishlist.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredWishlist.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => { setCurrentPage(1); }, [searchQuery, sortBy]);

    const handleRemove = (productId) => {
        setWishlist(prev => prev.filter(p => p.id !== productId));
        toast.success('محصول از علاقه‌مندی‌ها حذف شد');
    };

    const handleAddToCart = (product) => addProductToCart(product);

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">علاقه‌مندی‌ها</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {filteredWishlist.length} محصول
                    </p>
                </div>
            </div>

            <WishlistFilterBar
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                sortBy={sortBy} setSortBy={setSortBy}
            />

            {isLoading ? (
                <WishlistGrid isLoading={true} products={[]} onRemove={() => {}} onAddToCart={() => {}} />
            ) : filteredWishlist.length === 0 ? (
                <WishlistEmptyState hasSearch={!!searchQuery.trim()} />
            ) : (
                <>
                    <WishlistGrid
                        isLoading={false}
                        products={paginatedProducts}
                        onRemove={handleRemove}
                        onAddToCart={handleAddToCart}
                    />
                    {filteredWishlist.length > ITEMS_PER_PAGE && (
                        <ProductsPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default UserWishlist;
