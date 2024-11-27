import { useState } from "react";
import MenuIcon from "../assets/icons/menu.svg"
import TouchableButton from "./TouchableButton";

import { getInitials } from '../utils/employee';

import { useLocation } from "react-router-dom";

function getRouteName(pathname) {
    switch (pathname) {
        case "/":
            return "Início"
            break;

        case "/reports":
            return "Relatórios"
            break;

        case "/works":
            return "Obras"
            break;

        case "/edit-user":
            return "Pessoas"
            break;

        case "/teams":
            return "Equipes"
            break;

        case "/control-center":
            return "Central de Controle"
            break;

        default:
            return "Erro"
            break;

    }
}

export default function Header({ session, centralText, toggleDrawer }) {
    const { pathname } = useLocation()

    return (
        <header className='flex items-center justify-between p-2'>
            <TouchableButton>
                <img src={MenuIcon} className='scale-75' onClick={toggleDrawer} />
            </TouchableButton>
            <h2 className='text-lg font-semibold'>{centralText || getRouteName(pathname)}</h2>
            <TouchableButton>
                <div className='flex items-center justify-center w-8 h-8 p-2 text-sm font-medium text-white bg-blue-500 rounded-full aspect-square'>
                    <h2>{getInitials(session.email)}</h2>
                </div>
            </TouchableButton>
        </header>
    )
}