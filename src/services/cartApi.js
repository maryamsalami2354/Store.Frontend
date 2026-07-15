import authApiClient from "./authApi.js";

const GUEST_CART_TOKEN_KEY = "guestCartToken";

export const getGuestCartToken = () => {
    if (typeof window === "undefined") return "";

    let token = localStorage.getItem(GUEST_CART_TOKEN_KEY);
    if (!token) {
        token = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        localStorage.setItem(GUEST_CART_TOKEN_KEY, token);
    }

    return token;
};

const cartConfig = () => ({
    headers: {
        "X-Guest-Token": getGuestCartToken(),
    },
});

const emptyCart = {
    id: null,
    items: [],
    subtotal: 0,
    grandTotal: 0,
    totalItems: 0,
    totalItemCount: 0,
};

const normalizeCart = (cart) => {
    if (!cart) return emptyCart;

    const items = (cart.items || []).map((item) => ({
        ...item,
        id: item.id,
        productId: item.productId,
        name: item.name || item.productName,
        productName: item.productName || item.name,
        priceValue: Number(item.priceValue ?? item.unitPriceSnapshot ?? 0),
        totalPriceValue: Number(item.totalPriceValue ?? item.totalPrice ?? 0),
        quantity: Number(item.quantity || 0),
    }));

    const subtotal = Number(cart.subtotal ?? cart.grandTotal ?? items.reduce((sum, item) => sum + item.totalPriceValue, 0));
    const totalItems = Number(cart.totalItems ?? cart.totalItemCount ?? items.reduce((sum, item) => sum + item.quantity, 0));

    return {
        ...cart,
        items,
        subtotal,
        grandTotal: Number(cart.grandTotal ?? subtotal),
        totalItems,
        totalItemCount: Number(cart.totalItemCount ?? totalItems),
    };
};

export const getCart = async () => {
    try {
        const { data } = await authApiClient.get("/Cart", cartConfig());
        return normalizeCart(data);
    } catch (error) {
        if (error.message?.includes("404") || error.message?.includes("وجود ندارد")) {
            return emptyCart;
        }

        throw error;
    }
};

export const addCartItem = async ({ productId, quantity = 1 }) => {
    const { data } = await authApiClient.post("/Cart/items", { productId, quantity }, cartConfig());
    return normalizeCart(data);
};

export const updateCartItem = async ({ itemId, quantity }) => {
    const { data } = await authApiClient.put(`/Cart/items/${itemId}`, { quantity }, cartConfig());
    return normalizeCart(data);
};

export const removeCartItem = async (itemId) => {
    const { data } = await authApiClient.delete(`/Cart/items/${itemId}`, cartConfig());
    return normalizeCart(data);
};

export const clearCart = async () => {
    await authApiClient.delete("/Cart/clear", cartConfig());
    return emptyCart;
};

export const checkoutCart = async (payload) => {
    const { data } = await authApiClient.post("/Cart/checkout", payload, cartConfig());
    return data;
};

export default {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
    checkoutCart,
};
