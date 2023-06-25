import { useCallback } from 'react';

import { useAuthentication } from './use-authentication';

export function useAuthorization() {
    const { currentUser, isAdmin, isLogged } = useAuthentication();

    const checkAccess = useCallback(
        function ({ accessRoles }) {
            console.log(accessRoles)

            if (!isLogged) return false;

            if (isAdmin) return true;

            return accessRoles.includes(currentUser.role);
        },
        [currentUser.role, isAdmin, isLogged]
    );

    return {
        checkAccess,
    };
}
