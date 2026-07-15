import React, {useEffect} from "react";
import {getCookie} from "../utils/helpers/cookie.js";
import useStore from "../store/index.js";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ToastContainer} from "react-toastify";
import {SkeletonProvider} from "../components/skeleton/MainSkeleton/MainSkeleton.jsx";
import PersianDigitsProvider from "../utils/helpers/persianDigits.js";

const queryClient = new QueryClient();

const Authorize = ({children}) => {
    const {setState} = useStore();

    useEffect(() => {
        const readCookie = async () => {
            const result = await getCookie("origins");
            setState(result);
        };
        readCookie();
    }, [setState]);

    return <>{children}</>;
};

const Providers = ({children}) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SkeletonProvider>
                <PersianDigitsProvider>
                    <Authorize>
                        {children}
                        <ToastContainer
                            position="top-right"
                            rtl={true}
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                        />
                    </Authorize>
                </PersianDigitsProvider>
            </SkeletonProvider>
        </QueryClientProvider>
    );
};

export default Providers;
