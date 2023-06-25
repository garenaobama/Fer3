import { Outlet } from 'react-router-dom';
import Layout from '../components/Layout';
import About from '../pages/About';
import Blog from '../pages/Blog';
import Contact from '../pages/Contact';
import Forgotpassword from '../pages/Forgotpassword';
import Home from '../pages/Home';
import OurStore from '../pages/OurStore';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import Resetpassword from '../pages/Resetpassword';
import ShippingPolicy from '../pages/ShippingPolicy';
import Signup from '../pages/Signup';
import SingleBlog from '../pages/SingleBlog';
import SingleProduct from '../pages/SingleProduct';
import TermAndContions from '../pages/TermAndContions';
import CompareProduct from '../pages/CompareProduct';

export function publicRoutes() {
    return {
        path: '/',
        element: (
          <Layout>
              <Outlet />
          </Layout>
        ),
        children: [
            { index: true, element: <Home /> },
            { path: '/about', element: <About /> },
            { path: '/contact', element: <Contact /> },
            { path: '/product', element: <OurStore /> },
            { path: '/product/:id', element: <SingleProduct /> },
            { path: '/blogs', element: <Blog /> },
            { path: '/blog/:id', element: <SingleBlog /> },
            { path: '/forgot-password', element: <Forgotpassword /> },
            { path: '/signup', element: <Signup /> },
            { path: '/compare-product', element: <CompareProduct /> },
            { path: '/reset-password', element: <Resetpassword /> },
            { path: '/privacy-policy', element: <PrivacyPolicy /> },
            { path: '/shipping-policy', element: <ShippingPolicy /> },
            { path: '/term-conditions', element: <TermAndContions /> },
        ],
    };
}
