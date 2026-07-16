import { create } from "zustand";
import { removeCookie } from "../utils/helpers/cookie";

const getStoredToken = () => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("authToken") || localStorage.getItem("token");
};

const useStore = create((set) => ({
    accessToken: getStoredToken(),
    user: null,
    cart: null,

    setState: (data) => {
        const accessToken = data?.accessToken || data?.token || getStoredToken();

        if (accessToken) {
            localStorage.setItem("authToken", accessToken);
            localStorage.setItem("token", accessToken);
        }

        set({
            accessToken,
            user: data?.user || null,
        });
    },

    setCart: (cart) => set({ cart }),
    clearCartState: () => set({ cart: null }),

    logout: async () => {
        await removeCookie("origins");

        set({ accessToken: null, user: null, cart: null });

        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
    },
}));

export default useStore;
