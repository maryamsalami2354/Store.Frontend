import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'react-feather';
import { Breadcrumb } from '../../utils/helpers/breadcrumb';
import { toast } from 'react-toastify';
import CartPageSkeleton from '../skeleton/CartPageSkeleton/cartPageSkeleton.jsx';
import CartEmpty from './cartEmpty';
import CartItemsList from './cartItemsList';
import CartSummary from './cartSummary';
import CartGiftWrapper from './cartGiftWrapper';
import CartStickyFooter from './cartStickyFooter';
import { getCart, removeCartItem, updateCartItem } from '../../services/cartApi.js';
import useStore from '../../store/index.js';

const CartPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [giftWrap, setGiftWrap] = useState(false);
    const cart = useStore((state) => state.cart);
    const setCart = useStore((state) => state.setCart);
    const cartItems = cart?.items || [];

    useEffect(() => {
        let isMounted = true;

        const loadCart = async () => {
            setIsLoading(true);
            try {
                const data = await getCart();
                if (isMounted) setCart(data);
            } catch (error) {
                toast.error(error.message || 'خطا در دریافت سبد خرید');
                if (isMounted) setCart({ items: [], subtotal: 0, grandTotal: 0, totalItems: 0, totalItemCount: 0 });
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadCart();
        window.scrollTo(0, 0);

        return () => {
            isMounted = false;
        };
    }, [setCart]);

    const subtotal = useMemo(() => {
        return Number(cart?.subtotal ?? cart?.grandTotal ?? cartItems.reduce((sum, item) => sum + Number(item.priceValue || 0) * item.quantity, 0));
    }, [cart, cartItems]);

    const giftWrapCost = giftWrap ? 15000 : 0;
    const total = Math.max(0, subtotal + giftWrapCost);

    const handleUpdateQuantity = async (itemId, newQty) => {
        if (newQty < 1) return;

        try {
            const data = await updateCartItem({ itemId, quantity: newQty });
            setCart(data);
        } catch (error) {
            toast.error(error.message || 'خطا در تغییر تعداد محصول');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const data = await removeCartItem(itemId);
            setCart(data);
            toast.success('محصول از سبد خرید حذف شد');
        } catch (error) {
            toast.error(error.message || 'خطا در حذف محصول از سبد خرید');
        }
    };

    const handleCheckout = () => {
        if (!cartItems.length) {
            toast.error('سبد خرید شما خالی است');
            return;
        }

        navigate('/shipping');
    };

    if (isLoading) return <CartPageSkeleton />;
    if (!cartItems.length) return <CartEmpty />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
                <Breadcrumb items={[{ title: 'سبد خرید', link: '/cart', icon: ShoppingBag }]} />

                <h1 className="text-xl sm:text-2xl lg:text-3xl mt-3 font-extrabold text-gray-900 dark:text-white mb-4">
                    سبد خرید
                </h1>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                        <CartItemsList
                            items={cartItems}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemoveItem}
                        />

                        <CartGiftWrapper checked={giftWrap} onChange={setGiftWrap} />
                    </div>

                    <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
                        <div className="sticky top-24">
                            <CartSummary
                                subtotal={subtotal}
                                giftWrapCost={giftWrapCost}
                                total={total}
                                onCheckout={handleCheckout}
                            />
                        </div>
                    </div>
                </div>

                <CartStickyFooter total={total} onCheckout={handleCheckout} />
            </div>
        </div>
    );
};

export default CartPage;
