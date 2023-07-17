import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { AuthorizationRoute } from './authorization-route';
import { publicRoutes } from './public.route';
import { authRoutes } from './auth.route';
import adminRoutes from './admin.route';
import Error403Page from '../pages/error403.page';
import Error404Page from '../pages/error404.page';
import ErrorPage from '../pages/errorPage';
import { customerRoutes } from './customer-route';
import Layout from '../components/Layout';
import DefaultAdminLayout from '../admin/layouts/DefaultAdminLayout';
import Customer from '../admin/pages/Customer';
import Feedback from '../admin/pages/Feedback';
import Dashboard from '../admin/pages/DashBoard';
import Contact from '../admin/pages/Contact';
import Orders from '../admin/pages/Orders';
import Productlist from '../admin/pages/Productlist';
import ProductDetail from '../admin/pages/ProductDetail';
import EditProduct from '../admin/pages/EditProduct';
import Addbrand from '../admin/pages/Addbrand';
import AddProduct from '../admin/pages/Addproduct';
import Categorylist from '../admin/pages/Categorylist';
import Bloglist from '../admin/pages/Bloglist';
import Addblog from '../admin/pages/Addblog';
import BlogDetails from '../admin/pages/BlogDetail';
const allRoutes = createBrowserRouter([
  {
    path: '/admin',
    errorElement: <ErrorPage />,
    element: (
      <ProtectedRoute >
        <AuthorizationRoute roles={["Admin"]}>
          <DefaultAdminLayout>
            <Outlet />
          </DefaultAdminLayout>
        </AuthorizationRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={'/admin'} /> },
      { path: '/admin/customer', element: <Customer /> },
      { path: '/admin/feedback', element: <Feedback /> },
      { path: '/admin/dashboard', element: <Dashboard /> },
      { path: '/admin/contact', element: <Contact /> },
      { path: '/admin/order', element: <Orders /> },

      //product
      { path: '/admin/product', element: <Productlist /> },
      { path: '/admin/product/:id', element: <ProductDetail /> },
      { path: '/admin/product/edit/:id', element: <EditProduct /> },
      { path: '/admin/product/add-brand', element: <Addbrand /> },
      { path: '/admin/product/add-product', element: <AddProduct /> },
      { path: '/admin/product/category-list', element: <Categorylist /> },
    
      //blog
      { path: '/admin/blog', element: <Bloglist /> },
      { path: '/admin/blogdetails/:id', element: <BlogDetails /> },
      { path: '/admin/blog/add-blog', element: <Addblog /> },
    ],
  },
  customerRoutes(),
  publicRoutes(),
  authRoutes(),
  // adminRoutes(),
  { path: '/unauthorize', element: <Error403Page /> },
  { path: '*', element: <Error404Page /> },
]);

export const AppRouter = ({ children }) => (
  <>
    <RouterProvider router={allRoutes} />
    {children}
  </>
);
