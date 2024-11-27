//IMPORTAÇÃO DOS ÍCONES DAS ROTAS
import ActiveHomeIcon from "../assets/icons/home-active.svg"
import InactiveHomeIcon from "../assets/icons/home-inactive.svg"

import ActiveReportsIcon from "../assets/icons/reports-active.svg"
import InactiveReportsIcon from "../assets/icons/reports-inactive.svg"

import ActiveWorksIcon from "../assets/icons/works-active.svg"
import InactiveWorksIcon from "../assets/icons/works-inactive.svg"

import ActiveProfileIcon from "../assets/icons/profile-active.svg"
import InactiveProfileIcon from "../assets/icons/profile-inactive.svg"

import ActiveLogoutIcon from "../assets/icons/logout-active.svg"
import InactiveLogoutIcon from "../assets/icons/logout-inactive.svg"

import ActiveControlCenterIcon from "../assets/icons/control-center-active.svg"
import InactiveControlCenterIcon from "../assets/icons/control-center-inactive.svg"

import ActiveTeamIcon from "../assets/icons/teams-active.svg"
import InactiveTeamIcon from "../assets/icons/teams-inactive.svg"

//IMPORTAÇÃO DAS PÁGIANS
import Home from "../pages/Home/index";
import ControlCenter from '../pages/ControlCenter';
import Construction from '../pages/Construction';
import Employee from '../pages/Employee';
import Teams from '../pages/Teams';
import Report from "../pages/Reports"
import Logout from '../pages/Logout/Logout'

const appRoutes = [
    {
        name: "inicio",
        path: "/",
        element: <Home />,
        activeIcon: ActiveHomeIcon,
        inactiveIcon: InactiveHomeIcon
    },

    {
        name: "relatórios",
        path: "/reports",
        element: <Report />,
        activeIcon: ActiveReportsIcon,
        inactiveIcon: InactiveReportsIcon
    },

    {
        name: "obras",
        path: "/works",
        element: <Construction />,
        activeIcon: ActiveWorksIcon,
        inactiveIcon: InactiveWorksIcon
    },

    {
        name: "Pessoas",
        path: "/edit-user",
        element: <Employee />,
        activeIcon: ActiveProfileIcon,
        inactiveIcon: InactiveProfileIcon
    },

    // {
    //     name: "Equipes",
    //     path: "/teams",
    //     element: <Teams />,
    //     activeIcon: ActiveTeamIcon,
    //     inactiveIcon: InactiveTeamIcon
    // },

    // {
    //     name: "central de controle",
    //     path: "/control-center",
    //     element: <ControlCenter />,
    //     activeIcon: ActiveControlCenterIcon,
    //     inactiveIcon: InactiveControlCenterIcon
    // },

    {
        name: "sair",
        path: "/logout",
        element: <Logout/>,
        activeIcon: ActiveLogoutIcon,
        inactiveIcon: InactiveLogoutIcon
    },

]

export default appRoutes