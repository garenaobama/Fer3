import { Outlet } from "react-router-dom";
import DefaultAdminLayout from "../admin/layouts/DefaultAdminLayout";
import Customer from "../admin/pages/Customer";
import Home from "../pages/Home";
import Feedback from "../admin/pages/Feedback";
import Contact from "../admin/pages/Contact";

export default function adminRoutes() {
    return {
        path: '/',
        element: (
            <DefaultAdminLayout>
                <Outlet />
            </DefaultAdminLayout>
        ),
        children: [
            { index: true, element: <Home /> },
            { path: '/admin/customer', element: <Customer /> },
            { path: '/admin/feedback', element: <Feedback /> },
            { path: '/admin/contact', element: <Contact /> },
        ]
    };
}
