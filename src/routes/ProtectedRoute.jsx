import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useEffect, useState } from 'react';

import Drawer from '../components/Drawer';
import Header from '../components/Header';

export default function ProtectedRoute() {
    const [session, setSession] = useState(undefined);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    useEffect(() => {
        async function fetchSession() {
            const { data: { user } } = await supabase.auth.getUser();

            setSession(user);
        }

        fetchSession();

        //   supabase.auth.onAuthStateChange(
        //     (_event, session) => {
        //       setSession(session);
        //     },
        //   );

    }, []);

    if (session === undefined) {
        return <h1>Carregando...</h1>;
    }

    return session ?
        <>
            <Header session={session} toggleDrawer={toggleDrawer}/>
            <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
            <Outlet />
        </> :
        <Navigate to="/login" />;
}