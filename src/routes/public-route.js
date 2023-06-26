import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthentication } from '../util/use-authentication';

export function PublicRoute() {
    const { isLogged } = useAuthentication();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    if (isLogged) {
        return <Navigate to={from} replace />;
    }

    return <Outlet />;
}
