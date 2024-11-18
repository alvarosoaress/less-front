import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useLocation, Link } from 'react-router-dom';
import appRoutes from '../routes/listRoutes';
import { capitalize } from '../utils/employee';

const Drawer = ({ isOpen, onClose }) => {
    const { pathname } = useLocation()

    return (
        <AnimatePresence>
            {
                isOpen &&
                <>
                    <motion.div
                        key="drawer-wrapper-animation"
                        className="fixed inset-0 z-40 bg-black bg-opacity-50"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 50 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div
                        key="drawer-animation"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="fixed top-0 left-0 w-[70%] h-full bg-white text-white shadow-lg z-50"
                    >
                        <ul className="flex flex-col gap-3 p-4">
                            {appRoutes.map(route => {
                                const isActive = route.path === pathname;
                                return (
                                    <Link to={route.path} key={route.path} onClick={onClose}>
                                        <motion.li className={`flex gap-3 rounded px-3 py-2 ${isActive ? 'bg-[#4284F7]' : ''}`}>
                                            <img src={isActive ? route.activeIcon : route.inactiveIcon} />
                                            <span className={`font-medium ${isActive ? 'text-white' : 'text-[#809FB8]'}`}>
                                                {capitalize(route.name)}
                                            </span>
                                        </motion.li>
                                    </Link>
                                );
                            })}
                        </ul>
                    </motion.div>
                </>
            }
        </AnimatePresence>
    );
};

export default Drawer;
