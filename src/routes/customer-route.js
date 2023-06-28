import { Outlet } from 'react-router-dom';
import ErrorPage from '../pages/errorPage';
import { AuthorizationRoute } from './authorization-route';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Wishlist from '../pages/Wishlist';
import Layout from '../components/Layout';
import { ProtectedRoute } from './protected-route';

export function customerRoutes() {
    return {
        path: '/',
        errorElement: <ErrorPage />,
        element: (
            <ProtectedRoute>
                <AuthorizationRoute roles={['Customer']}>
                    <Layout>
                        <Outlet />
                    </Layout>
                </AuthorizationRoute>
            </ProtectedRoute>
        ),
        children: [
            { path: '/cart', element: <Cart /> },
            { path: '/checkout', element: <Checkout /> },
            { path: '/wishlist', element: <Wishlist /> },
        ],
    };
}
