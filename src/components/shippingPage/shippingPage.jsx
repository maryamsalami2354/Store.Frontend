import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'react-feather';
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
import { getMyAddresses } from '../../services/addressApi.js';
import useStore from '../../store/index.js';

const CHECKOUT_STORAGE_KEY = 'checkoutInfo';

const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString();
};

const persianDateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    month: 'long',
    day: 'numeric',
});

const toPersianDigits = (value) => String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit]);

const getDeliverySlotKey = (slot) => `${slot.date}|${slot.code}`;

const parseSlotDate = (value) => {
    const [year, month, day] = String(value || '').slice(0, 10).split('-').map(Number);

    if (!year || !month || !day) return new Date(value);

    return new Date(year, month - 1, day, 12);
};

const formatTimeSlot = (timeSlot) => {
    const [start, end] = String(timeSlot || '').split('-');
    const startHour = Number(start?.split(':')[0]);
    const endHour = Number(end?.split(':')[0]);

    if (Number.isFinite(startHour) && Number.isFinite(endHour)) {
        return `ساعت ${toPersianDigits(startHour)} تا ${toPersianDigits(endHour)}`;
    }

    return timeSlot || '';
};

const formatDeliverySlotLabel = (slot) => {
    if (!slot) return '';

    return `${persianDateFormatter.format(parseSlotDate(slot.date))}، ${formatTimeSlot(slot.timeSlot)}`;
};

const buildShippingAddress = (address) => {
    const parts = [
        address.province,
        address.city,
        address.address,
        address.plateNumber ? `پلاک ${address.plateNumber}` : '',
        address.unitNumber ? `واحد ${address.unitNumber}` : '',
    ];

    return parts.filter(Boolean).join('، ');
};

const ShippingPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [deliveryTime, setDeliveryTime] = useState('');
    const [deliveryTimes, setDeliveryTimes] = useState([]);
    const [shippingMethods, setShippingMethods] = useState([]);
    const [shippingMethodCode, setShippingMethodCode] = useState('');
    const [addresses, setAddresses] = useState([]);
    const accessToken = useStore((state) => state.accessToken);
    const cart = useStore((state) => state.cart);
    const setCart = useStore((state) => state.setCart);
    const cartItems = cart?.items || [];

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            if (!accessToken) {
                toast.error('برای انتخاب آدرس ابتدا وارد حساب کاربری شوید');
                navigate('/login?redirect=/shipping', { replace: true });
                return;
            }

            setIsLoading(true);
            try {
                const [cartData, shippingData, addressData] = await Promise.all([
                    getCart(),
                    getShippingOptions(),
                    getMyAddresses(),
                ]);

                if (!isMounted) return;

                setCart(cartData);
                setAddresses(addressData);
                setSelectedAddress(addressData.find((address) => address.isDefault) || addressData[0] || null);
                setShippingMethods(shippingData.methods);
                setDeliveryTimes(shippingData.slots);
                setShippingMethodCode((current) => {
                    if (current && shippingData.methods.some((method) => method.code === current)) return current;
                    return shippingData.methods.find((method) => method.code === 'standard')?.code || shippingData.methods[0]?.code || '';
                });
                setDeliveryTime((current) => {
                    if (current && shippingData.slots.some((slot) => getDeliverySlotKey(slot) === current)) return current;
                    return shippingData.slots[0] ? getDeliverySlotKey(shippingData.slots[0]) : '';
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
    }, [accessToken, navigate, setCart]);

    const subtotal = useMemo(() => {
        return Number(cart?.subtotal ?? cart?.grandTotal ?? cartItems.reduce((sum, item) => sum + Number(item.priceValue || 0) * item.quantity, 0));
    }, [cart, cartItems]);

    const selectedShippingMethod = useMemo(() => {
        return shippingMethods.find((method) => method.code === shippingMethodCode) || null;
    }, [shippingMethods, shippingMethodCode]);

    const selectedDeliveryTime = useMemo(() => {
        return deliveryTimes.find((slot) => getDeliverySlotKey(slot) === deliveryTime) || null;
    }, [deliveryTimes, deliveryTime]);

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
        if (!selectedDeliveryTime) {
            toast.error('لطفا زمان ارسال را انتخاب کنید');
            return;
        }

        const checkoutInfo = {
            shippingMethodCode: selectedShippingMethod.code,
            shippingMethodTitle: selectedShippingMethod.title,
            shippingMethodCost: selectedShippingMethod.cost,
            deliveryDate: selectedDeliveryTime.date || getDeliveryDate(),
            deliveryTimeSlot: selectedDeliveryTime.timeSlot,
            deliveryTime: getDeliverySlotKey(selectedDeliveryTime),
            deliveryTimeTitle: formatDeliverySlotLabel(selectedDeliveryTime),
            shippingAddress: buildShippingAddress(selectedAddress),
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

                        <ShippingDeliveryTime
                            value={deliveryTime}
                            onChange={setDeliveryTime}
                            options={deliveryTimes}
                            shippingCost={shippingCost}
                        />
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
                                deliveryTimeLabel={formatDeliverySlotLabel(selectedDeliveryTime)}
                                shippingMethod={selectedShippingMethod}
                                onContinue={handleContinue}
                            />
                        </div>
                    </div>
                </div>

                <ShippingStickyFooter
                    total={total}
                    selectedAddress={selectedAddress}
                    onContinue={handleContinue}
                />
            </div>
        </div>
    );
};

export default ShippingPage;
