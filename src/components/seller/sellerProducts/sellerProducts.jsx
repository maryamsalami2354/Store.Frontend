// src/components/seller/sellerProducts/SellerProducts.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'react-feather';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductsFilterBar from './productsFilterBar';
import ProductsList from './productsList';
import ProductsPagination from './productsPagination';
import OperationConfirmModal from './operationConfirmModal.jsx';
import EditProductModal from './editProductModal.jsx';
import AddProductModal from './addProductModal.jsx';
import { getCatalogBrands, getCatalogCategories, getCatalogProducts } from '../../../services/catalogApi.js';

const enhanceProducts = (products) => {
    return products.map((product) => {
        const stock = Number(product.stock ?? product.availableQuantity ?? 0);

        return {
            ...product,
            stock,
            status: product.status ?? (stock > 0 ? 'active' : 'outofstock'),
        };
    });
};

const ITEMS_PER_PAGE = 10;

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [brands, setBrands] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
    const [editModal, setEditModal] = useState({ isOpen: false, product: null });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
                    getCatalogProducts({ page: 1, pageSize: 500 }),
                    getCatalogCategories(),
                    getCatalogBrands(),
                ]);

                setProducts(enhanceProducts(productsResponse.products || []));
                setCategories(categoriesResponse.categories || []);
                setBrands(brandsResponse.brands || []);
            } catch (error) {
                toast.error(error.message || 'خطا در دریافت اطلاعات کاتالوگ');
                setProducts([]);
                setCategories([]);
                setBrands([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (searchQuery.trim()) {
            result = result.filter(p => p.name.includes(searchQuery.trim()));
        }

        if (selectedCategory !== 'all') {
            result = result.filter(p => p.categoryId === Number(selectedCategory));
        }

        if (selectedStatus !== 'all') {
            result = result.filter(p => p.status === selectedStatus);
        }

        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
                    const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                result.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
                    const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
                    return priceB - priceA;
                });
                break;
            case 'sales':
                result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
                break;
            case 'oldest':
                result.sort((a, b) => a.id - b.id);
                break;
            default: // newest
                result.sort((a, b) => b.id - a.id);
        }

        return result;
    }, [products, searchQuery, selectedCategory, selectedStatus, sortBy]);
    const handleAddProduct = (newProduct) => {
        setProducts(prev => [newProduct, ...prev]);
    };
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

    const openDeleteModal = (product) => setDeleteModal({ isOpen: true, product });
    const openEditModal = (product) => setEditModal({ isOpen: true, product });

    const handleSaveEdit = (updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const handleDeleteConfirm = (product) => {
        setProducts(prev => prev.filter(p => p.id !== product.id));
        toast.success(`محصول "${product.name}" با موفقیت حذف شد`);
        setDeleteModal({ isOpen: false, product: null });
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                    مدیریت محصولات
                </h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition shadow-sm"
                >
                    <Plus size={18} />
                    افزودن محصول جدید
                </button>
            </div>

            <ProductsFilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                sortBy={sortBy}
                setSortBy={setSortBy}
                categories={categories}
            />

            <ProductsList
                isLoading={isLoading}
                products={paginatedProducts}
                categories={categories}
                onDelete={openDeleteModal}
                onEdit={openEditModal}
            />

            {!isLoading && filteredProducts.length > 0 && (
                <ProductsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <OperationConfirmModal
                isOpen={deleteModal.isOpen}
                type="delete"
                product={deleteModal.product}
                onClose={() => setDeleteModal({ isOpen: false, product: null })}
                onConfirm={handleDeleteConfirm}
            />

            <EditProductModal
                isOpen={editModal.isOpen}
                product={editModal.product}
                onClose={() => setEditModal({ isOpen: false, product: null })}
                onSave={handleSaveEdit}
            />
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddProduct}
                categories={categories}
                brands={brands}
            />
        </div>
    );
};

export default SellerProducts;
