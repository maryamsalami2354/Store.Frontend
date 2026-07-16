import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddressCard from './addressCard';
import AddressFormModal from './addressFormModal';
import AddressDeleteModal from './addressDeleteModal';
import {
    createAddress,
    deleteAddress,
    getMyAddresses,
    setDefaultAddress,
    updateAddress,
} from '../../../services/addressApi.js';
import useStore from '../../../store/index.js';

const UserAddresses = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const accessToken = useStore((state) => state.accessToken);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formModal, setFormModal] = useState({ isOpen: false, address: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, address: null });
    const [maxLimit] = useState(5);

    const redirectTarget = searchParams.get('redirect');

    const loadAddresses = async () => {
        if (!accessToken) {
            navigate('/login?redirect=/user/addresses', { replace: true });
            return;
        }

        setIsLoading(true);
        try {
            const data = await getMyAddresses();
            setAddresses(data);
        } catch (error) {
            toast.error(error.message || 'خطا در دریافت آدرس‌ها');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, [accessToken]);

    const handleAdd = () => {
        if (addresses.length >= maxLimit) {
            toast.error(`حداکثر ${maxLimit.toLocaleString('fa-IR')} آدرس می‌توانید ثبت کنید`);
            return;
        }
        setFormModal({ isOpen: true, address: null });
    };

    const handleEdit = (address) => {
        setFormModal({ isOpen: true, address });
    };

    const handleDelete = (address) => {
        setDeleteModal({ isOpen: true, address });
    };

    const handleSave = async (formData) => {
        setIsSaving(true);
        try {
            if (formData.id) {
                const saved = await updateAddress(formData.id, formData);
                setAddresses((prev) => prev.map((address) => address.id === saved.id ? saved : address));
                toast.success('آدرس با موفقیت ویرایش شد');
            } else {
                const saved = await createAddress(formData);
                setAddresses((prev) => [saved, ...prev]);
                toast.success('آدرس جدید با موفقیت اضافه شد');

                if (redirectTarget === 'shipping') {
                    navigate('/shipping');
                    return;
                }
            }

            await loadAddresses();
            setFormModal({ isOpen: false, address: null });
        } catch (error) {
            toast.error(error.message || 'خطا در ذخیره آدرس');
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmDelete = async (addressId) => {
        if (!addressId) return;

        try {
            await deleteAddress(addressId);
            await loadAddresses();
            toast.success('آدرس با موفقیت حذف شد');
            setDeleteModal({ isOpen: false, address: null });
        } catch (error) {
            toast.error(error.message || 'خطا در حذف آدرس');
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await setDefaultAddress(addressId);
            await loadAddresses();
            toast.success('آدرس پیش‌فرض تغییر کرد');
        } catch (error) {
            toast.error(error.message || 'خطا در تغییر آدرس پیش‌فرض');
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">آدرس‌های من</h1>
                <button
                    onClick={handleAdd}
                    disabled={addresses.length >= maxLimit}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#002874] text-white rounded-xl text-sm font-medium hover:bg-[#001d5a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + افزودن آدرس جدید
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 animate-pulse">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-3" />
                            <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                            <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
                        </div>
                    ))}
                </div>
            ) : addresses.length === 0 ? (
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">هنوز آدرسی ثبت نکرده‌اید</p>
                    <button onClick={handleAdd} className="px-6 py-2.5 bg-[#002874] dark:bg-[#4C6FB6] text-white rounded-xl text-sm font-medium">
                        ثبت آدرس جدید
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(address => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onEdit={() => handleEdit(address)}
                            onDelete={() => handleDelete(address)}
                            onSetDefault={() => handleSetDefault(address.id)}
                        />
                    ))}
                </div>
            )}

            <AddressFormModal
                isOpen={formModal.isOpen}
                address={formModal.address}
                isSaving={isSaving}
                onClose={() => setFormModal({ isOpen: false, address: null })}
                onSave={handleSave}
            />

            <AddressDeleteModal
                isOpen={deleteModal.isOpen}
                address={deleteModal.address}
                onClose={() => setDeleteModal({ isOpen: false, address: null })}
                onConfirm={() => handleConfirmDelete(deleteModal.address?.id)}
            />
        </div>
    );
};

export default UserAddresses;
