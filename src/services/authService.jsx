import { useEffect } from "react";
import axios from "axios";
import { getCookie, removeCookie } from "../utils/helpers/cookie.js";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer/Footer";

const MiddleWar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const noNavbarRoutes = ["/login"];
    const noFooterRoutes = ["/login"];
    const showNavbar = !noNavbarRoutes.includes(pathname);
    const showFooter = !noFooterRoutes.includes(pathname);

    // useEffect(() => {
    //     async function fetchData() {
    //         if (pathname === "/" || pathname === "/signup") {
    //             return;
    //         }
    //
    //         let token = null;
    //         let cookieData = null;
    //         try {
    //             const cookieRawValue = await getCookie("origins");
    //             if (cookieRawValue) {
    //                 try {
    //                     cookieData = cookieRawValue;
    //                 } catch (e) {
    //                     cookieData = { result: { token: cookieRawValue } };
    //                 }
    //             }
    //             if (cookieData && cookieData.result && cookieData.result.token) {
    //                 token = cookieData.result.token;
    //             }
    //         } catch (e) {
    //             console.error("Security Alert: Failed to retrieve or parse user token from cookie.");
    //         }
    //
    //         // اگر توکن وجود دارد، اعتبار آن را چک کن
    //         if (token) {
    //             try {
    //                 await axios.post(
    //                     "http://localhost:3000/token",
    //                     { result: token },
    //                     {
    //                         headers: {
    //                             "Content-Type": "application/json"
    //                         }
    //                     }
    //                 );
    //                 console.log("معتبر");
    //             } catch (error) {
    //                 console.log("خطا در احراز هویت. پاکسازی داده‌ها...");
    //                 localStorage.removeItem("authToken");
    //                 removeCookie("origins");
    //                 if (pathname === "/seller") {
    //                     navigate('/login');
    //                 }
    //             }
    //         } else {
    //             if (pathname === "/seller") {
    //                 console.log("Security Log: No valid token found. Cleaning up and redirecting.");
    //                 localStorage.removeItem("authToken");
    //                 removeCookie("origins");
    //                 navigate('/login');
    //             }
    //         }
    //     }
    //     fetchData();
    // }, [navigate, pathname]);

    return (
        <>
            {showNavbar && <Header />}
            <Outlet />
            {showFooter && <Footer/>}
        </>
    );
};

export default MiddleWar;