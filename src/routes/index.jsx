import React from 'react';
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Login from "../pages/Login/index";
import ProtectedRoute from "./ProtectedRoute";

import appRoutes from "./listRoutes"

// Definindo as rotas e exportando para usar em outras partes do código sem que haja conflito
// o array "appRoutes" também está sendo usado em "Drawer"

function AppRoutes() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        fetchUser();
    }, []);

    return (
        <>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    {appRoutes.map(route => 
                        <Route 
                            key={route.name} 
                            path={route.path} 
                            element={
                                route.name === "sair" 
                                ? React.cloneElement(route.element, { setUser })
                                : route.element
                            }/>)}
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </>
    );
}

export default AppRoutes;
