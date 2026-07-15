import { useCallback } from "react";
import { toast } from "react-toastify";
import { addCartItem } from "../services/cartApi.js";
import useStore from "../store/index.js";

const getProductId = (product) => Number(product?.productId || product?.id || 0);

const useCartActions = () => {
    const setCart = useStore((state) => state.setCart);

    const addProductToCart = useCallback(async (product, quantity = 1) => {
        const productId = getProductId(product);

        if (!productId) {
            toast.error("شناسه محصول برای افزودن به سبد معتبر نیست");
            return null;
        }

        try {
            const cart = await addCartItem({ productId, quantity });
            setCart(cart);
            toast.success(`${product?.name || product?.productName || "محصول"} به سبد خرید اضافه شد`);
            return cart;
        } catch (error) {
            toast.error(error.message || "خطا در افزودن محصول به سبد خرید");
            return null;
        }
    }, [setCart]);

    return { addProductToCart };
};

export default useCartActions;
