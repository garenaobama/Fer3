import { Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import { PublicRoute } from './public-route';
import Layout from '../components/Layout';

export function authRoutes() {
    return {
        path: '/',
        element: (
            <Layout>
                <PublicRoute />
            </Layout>
        ),
        children: [
            { index: true, element: <Navigate to="login" /> },
            {
                path: 'login',
                element: <Login />,
            },
        ],
    };
}
