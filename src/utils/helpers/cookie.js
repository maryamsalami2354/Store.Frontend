import Cookies from "js-cookie";
import { encryptJWT, decryptJWT } from "./jwt.js";

export const setCookie = async (key, data) =>
    Cookies.set(key, await encryptJWT(data));

export const getCookie = async (key) => {
    const value = Cookies.get(key);

    if (!value) {
        return false;
    }

    try {
        const decrypted = await decryptJWT(value);

        if (!decrypted) {
            return false;
        }

        return decrypted;
    } catch (error) {
        return false;
    }
};

export const removeCookie = async (key) => Cookies.remove(key);