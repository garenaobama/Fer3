import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { AuthorizationRoute } from './authorization-route';
import { publicRoutes } from './public.route';
import { authRoutes } from './auth.route';
import Error403Page from '../pages/error403.page';
import Error404Page from '../pages/error404.page';
import ErrorPage from '../pages/errorPage';
import { customerRoutes } from './customer-route';
import Layout from '../components/Layout';

const allRoutes = createBrowserRouter([
  {
    path: '/admin',
    errorElement: <ErrorPage />,
    element: (
      <ProtectedRoute >
        <AuthorizationRoute roles={["Admin"]}>
          <Layout>
            <Outlet />
          </Layout>
        </AuthorizationRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={'/admin'} /> },
    ],
  },
  customerRoutes(),
  publicRoutes(),
  authRoutes(),
  { path: '/unauthorize', element: <Error403Page /> },
  { path: '*', element: <Error404Page /> },
]);

export const AppRouter = ({ children }) => (
  <>
    <RouterProvider router={allRoutes} />
    {children}
  </>
);
