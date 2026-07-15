import './index.css';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Providers from "./providers";
import router from "./routes/router.jsx";
import {RouterProvider} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
            <Providers>
                    <RouterProvider router={router} />
            </Providers>
    </StrictMode>,
)
