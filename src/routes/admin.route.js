import { Outlet } from "react-router-dom";
import DefaultAdminLayout from "../admin/layouts/DefaultAdminLayout";
import Customer from "../admin/pages/Customer";
import Home from "../pages/Home";
import Feedback from "../admin/pages/Feedback";
import Dashboard from "../admin/pages/DashBoard";
import Contact from "../admin/pages/Contact";
import Addblog from "../admin/pages/Addblog";
import Addbrand from "../admin/pages/Addbrand";
import AddProduct from "../admin/pages/Addproduct"
import Productlist from "../admin/pages/Productlist";
import Bloglist from "../admin/pages/Bloglist"
import Categorylist from "../admin/pages/Categorylist";
import Orders from "../admin/pages/Orders";
import ProductDetail from "../admin/pages/ProductDetail";
import EditProduct from "../admin/pages/EditProduct";

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
            // { path: '/admin/customer', element: <Customer /> },
            // { path: '/admin/feedback', element: <Feedback /> },
            // { path: '/admin/dashboard', element: <Dashboard /> },
            // { path: '/admin/contact', element: <Contact /> },
            // { path: '/admin/order', element: <Orders /> },

            // //product
            // { path: '/admin/product', element: <Productlist /> },
            // { path: '/admin/product/:id', element: <ProductDetail /> },
            // { path: '/admin/product/edit/:id', element: <EditProduct /> },
            // { path: '/admin/product/add-brand', element: <Addbrand /> },
            // { path: '/admin/product/add-product', element: <AddProduct /> },
            // { path: '/admin/product/category-list', element: <Categorylist /> },

            // //blog
            // { path: '/admin/blog', element: <Bloglist /> },
            // { path: '/admin/blog/add-blog', element: <Addblog /> },
        ]
    };
}
