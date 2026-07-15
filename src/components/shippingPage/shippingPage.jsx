import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'react-feather';
import addressesData from '../../../public/jsons/addresses.json';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import { toast } from 'react-toastify';
import ShippingPageSkeleton from '../skeleton/ShippingPageSkeleton/ShippingPageSkeleton.jsx';
import ShippingProgress from './shippingProgress';
import ShippingSavedAddresses from './shippingSavedAddresses';
import ShippingDeliveryTime from './shippingDeliveryTime';
import ShippingSummary from './shippingSummary';
import ShippingStickyFooter from './shippingStickyFooter';
import CartShipping from '../cartPage/cartShipping';
import { getCart } from '../../services/cartApi.js';
import { getShippingOptions } from '../../services/shippingApi.js';
import useStore from '../../store/index.js';

const CHECKOUT_STORAGE_KEY = 'checkoutInfo';

const deliverySlots = {
    morning: '09:00-12:00',
    afternoon: '15:00-18:00',
    evening: '18:00-21:00',
};

const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString();
};

const ShippingPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [deliveryTime, setDeliveryTime] = useState('');
    const [shippingMethods, setShippingMethods] = useState([]);
    const [shippingMethodCode, setShippingMethodCode] = useState('');
    const [addresses] = useState(addressesData.addresses || []);
    const cart = useStore((state) => state.cart);
    const setCart = useStore((state) => state.setCart);
    const cartItems = cart?.items || [];

    useEffect(() => {
        if (addresses.length && !selectedAddress) {
            setSelectedAddress(addresses.find(a => a.isDefault) || addresses[0]);
        }
    }, [addresses, selectedAddress]);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            setIsLoading(true);
            try {
                const [cartData, shippingData] = await Promise.all([
                    getCart(),
                    getShippingOptions(),
                ]);

                if (!isMounted) return;

                setCart(cartData);
                setShippingMethods(shippingData.methods);
                setShippingMethodCode((current) => {
                    if (current && shippingData.methods.some((method) => method.code === current)) return current;
                    return shippingData.methods.find((method) => method.code === 'standard')?.code || shippingData.methods[0]?.code || '';
                });

                if (!cartData.items?.length) {
                    toast.error('سبد خرید شما خالی است');
                    navigate('/cart', { replace: true });
                }
            } catch (error) {
                toast.error(error.message || 'خطا در دریافت اطلاعات ارسال');
                navigate('/cart', { replace: true });
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        load();
        window.scrollTo(0, 0);

        return () => {
            isMounted = false;
        };
    }, [navigate, setCart]);

    const subtotal = useMemo(() => {
        return Number(cart?.subtotal ?? cart?.grandTotal ?? cartItems.reduce((sum, item) => sum + Number(item.priceValue || 0) * item.quantity, 0));
    }, [cart, cartItems]);

    const selectedShippingMethod = useMemo(() => {
        return shippingMethods.find((method) => method.code === shippingMethodCode) || null;
    }, [shippingMethods, shippingMethodCode]);

    const shippingCost = Number(selectedShippingMethod?.cost || 0);
    const total = subtotal + shippingCost;

    const handleContinue = () => {
        if (!cartItems.length) {
            toast.error('سبد خرید شما خالی است');
            navigate('/cart');
            return;
        }
        if (!selectedAddress) {
            toast.error('لطفا یک آدرس انتخاب کنید');
            return;
        }
        if (!selectedShippingMethod) {
            toast.error('لطفا روش ارسال را انتخاب کنید');
            return;
        }
        if (!deliveryTime) {
            toast.error('لطفا زمان ارسال را انتخاب کنید');
            return;
        }

        const checkoutInfo = {
            shippingMethodCode: selectedShippingMethod.code,
            shippingMethodTitle: selectedShippingMethod.title,
            shippingMethodCost: selectedShippingMethod.cost,
            deliveryDate: getDeliveryDate(),
            deliveryTimeSlot: deliverySlots[deliveryTime] || deliveryTime,
            deliveryTime,
            shippingAddress: `${selectedAddress.province || ''}، ${selectedAddress.city || ''}، ${selectedAddress.address || ''}`,
            recipientName: selectedAddress.receiverName || selectedAddress.title || 'مشتری',
            recipientPhone: selectedAddress.phone || '',
            selectedAddress,
        };

        localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutInfo));
        navigate('/payment');
    };

    const handleAddAddress = () => {
        navigate('/user/addresses?redirect=shipping');
    };

    if (isLoading) return <ShippingPageSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <Breadcrumb items={[{ title: 'آدرس و ارسال', link: '/shipping', icon: MapPin }]} />
                <ShippingProgress currentStep={2} />

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                    آدرس و زمان ارسال
                </h1>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                        <ShippingSavedAddresses
                            addresses={addresses}
                            selectedId={selectedAddress?.id}
                            onSelect={setSelectedAddress}
                            onAddNew={handleAddAddress}
                        />

                        <CartShipping
                            selected={shippingMethodCode}
                            onSelect={setShippingMethodCode}
                            options={shippingMethods}
                        />

                        <ShippingDeliveryTime value={deliveryTime} onChange={setDeliveryTime} />
                    </div>

                    <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
                        <div className="sticky top-24">
                            <ShippingSummary
                                items={cartItems}
                                subtotal={subtotal}
                                shippingCost={shippingCost}
                                total={total}
                                selectedAddress={selectedAddress}
                                deliveryTime={deliveryTime}
                                shippingMethod={selectedShippingMethod}
                                onContinue={handleContinue}
                            />
                        </div>
                    </div>
                </div>

                <ShippingStickyFooter
                    total={total}
                    selectedAddress={selectedAddress}
                    deliveryTime={deliveryTime}
                    onContinue={handleContinue}
                />
            </div>
        </div>
    );
};

export default ShippingPage;
