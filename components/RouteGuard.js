import { useState, useEffect, useCallback } from 'react';
import { readToken } from '@/lib/authenticate';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { useRouter } from 'next/router';
import { getFavourites, getHistory } from '@/lib/userData';

const PUBLIC_PATHS = ['/login', '/', '/_error', '/register'];

export default function RouteGuard(props) {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const router = useRouter();
    const [favourites, setFavourites] = useAtom(favouritesAtom);
    const [authorized, setAuthorized] = useState(false);
    const updateAtoms = useCallback(async () => {
        try {
            const newFavourites = await getFavourites();
            const newSearchHistory = await getHistory();
            setFavourites(newFavourites);
            setSearchHistory(newSearchHistory);
            console.log("Atoms updated successfully");
        } catch (error) {
            console.error("Error updating atoms:", error);
        }
    }, [setFavourites, setSearchHistory]);
    const authCheck = useCallback((url) => {
        console.log(`Auth check for URL: ${url}`);
        const path = url.split('?')[0];
        const isPublicPath = PUBLIC_PATHS.includes(path);
        if (!isPublicPath && !isAuthenticated()) {
            console.log("User not authenticated, redirecting to login");
            setAuthorized(false);
            router.push('/login');
        } else {
            console.log("User authenticated or accessing public path");
            setAuthorized(true);
        }
    }, [router, setAuthorized]);

    useEffect(() => {
        console.log("RouteGuard mounted");
        updateAtoms();
        authCheck(router.pathname);
        router.events.on('routeChangeComplete', authCheck);
        return () => {
            console.log("RouteGuard unmounted");
            router.events.off('routeChangeComplete', authCheck);
        };
    }, [router.pathname, router.events, authCheck, updateAtoms]);


    function isAuthenticated() {
        const token = readToken();
        console.log(`isAuthenticated check: token ${token ? "exists" : "doesn't exist"}`);
        return token !== null;
    }
    return <>{authorized && props.children}</>;
}
