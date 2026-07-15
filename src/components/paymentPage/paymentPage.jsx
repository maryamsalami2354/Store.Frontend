import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'react-feather';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import { toast } from 'react-toastify';
import PaymentPageSkeleton from '../skeleton/PaymentPageSkeleton/PaymentPageSkeleton.jsx';
import PaymentProgress from './paymentProgress';
import PaymentMethods from './paymentMethods';
import PaymentWallet from './paymentWallet';
import PaymentOrderSummary from './paymentOrderSummary';
import PaymentStickyFooter from './paymentStickyFooter';
import { checkoutCart, getCart } from '../../services/cartApi.js';
import useStore from '../../store/index.js';

const CHECKOUT_STORAGE_KEY = 'checkoutInfo';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('gateway');
    const [walletPassword, setWalletPassword] = useState('');
    const [checkoutInfo, setCheckoutInfo] = useState(null);
    const accessToken = useStore((state) => state.accessToken);
    const cart = useStore((state) => state.cart);
    const setCart = useStore((state) => state.setCart);
    const cartItems = cart?.items || [];

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            setIsLoading(true);
            try {
                const savedInfo = JSON.parse(localStorage.getItem(CHECKOUT_STORAGE_KEY) || 'null');
                if (!savedInfo) {
                    toast.error('لطفا ابتدا آدرس و زمان ارسال را انتخاب کنید');
                    navigate('/shipping', { replace: true });
                    return;
                }

                const data = await getCart();
                if (!isMounted) return;
                setCheckoutInfo(savedInfo);
                setCart(data);
                if (!data.items?.length) {
                    toast.error('سبد خرید شما خالی است');
                    navigate('/cart', { replace: true });
                }
            } catch (error) {
                toast.error(error.message || 'خطا در آماده‌سازی پرداخت');
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

    const shippingCost = Number(checkoutInfo?.shippingMethodCost ?? 0);
    const total = Math.max(0, subtotal + shippingCost);

    const handlePay = async () => {
        if (!accessToken) {
            toast.error('برای ثبت سفارش ابتدا وارد حساب کاربری شوید');
            navigate('/login?redirect=/payment');
            return;
        }

        if (!checkoutInfo) {
            toast.error('اطلاعات ارسال تکمیل نشده است');
            navigate('/shipping');
            return;
        }

        if (paymentMethod === 'Wallet' && !walletPassword) {
            toast.error('لطفا رمز کیف پول را وارد کنید');
            return;
        }

        setIsPaying(true);
        try {
            const result = await checkoutCart({
                shippingMethodCode: checkoutInfo.shippingMethodCode || 'standard',
                deliveryDate: checkoutInfo.deliveryDate,
                deliveryTimeSlot: checkoutInfo.deliveryTimeSlot,
                shippingAddress: checkoutInfo.shippingAddress,
                recipientName: checkoutInfo.recipientName,
                recipientPhone: checkoutInfo.recipientPhone,
            });

            localStorage.removeItem(CHECKOUT_STORAGE_KEY);
            setCart({ items: [], subtotal: 0, grandTotal: 0, totalItems: 0, totalItemCount: 0 });
            toast.success('سفارش با موفقیت ثبت شد');
            navigate(`/payment/result?status=ok&orderId=${result.orderId}&trackingCode=${encodeURIComponent(result.trackingCode || '')}`);
        } catch (error) {
            toast.error(error.message || 'خطا در ثبت سفارش');
            navigate('/payment/result?status=nok');
        } finally {
            setIsPaying(false);
        }
    };

    if (isLoading) return <PaymentPageSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <Breadcrumb items={[{ title: 'پرداخت', link: '/payment', icon: CreditCard }]} />
                <PaymentProgress currentStep={3} />

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                    پرداخت
                </h1>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                        <PaymentMethods selected={paymentMethod} onSelect={setPaymentMethod} />

                        {paymentMethod === 'Wallet' && (
                            <PaymentWallet
                                password={walletPassword}
                                onPasswordChange={setWalletPassword}
                                balance={1250000}
                            />
                        )}
                    </div>

                    <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
                        <div className="sticky top-24">
                            <PaymentOrderSummary
                                items={cartItems}
                                subtotal={subtotal}
                                shippingCost={shippingCost}
                                total={total}
                                selectedAddress={checkoutInfo?.selectedAddress}
                                deliveryTime={checkoutInfo?.deliveryTime}
                                shippingMethodTitle={checkoutInfo?.shippingMethodTitle}
                                onPay={handlePay}
                                paymentMethod={paymentMethod}
                                isPaying={isPaying}
                            />
                        </div>
                    </div>
                </div>

                <PaymentStickyFooter total={total} onPay={handlePay} paymentMethod={paymentMethod} isPaying={isPaying} />
            </div>
        </div>
    );
};

export default PaymentPage;
