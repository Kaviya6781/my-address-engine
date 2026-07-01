import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiHome,
    FiUsers,
    FiShoppingCart,
    FiMapPin,
    FiBriefcase,
    FiActivity,
    FiDatabase,
    FiCompass,
    FiZap,
    FiBarChart2,
    FiFileText,
    FiSettings,
    FiChevronDown,
    FiChevronUp,
    FiChevronsLeft,
    FiChevronsRight,
    FiX
} from 'react-icons/fi';

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
    // Local state for dropdown sections
    const [intelOpen, setIntelOpen] = useState(false);
    const [activationOpen, setActivationOpen] = useState(false);
    const [tenantOpen, setTenantOpen] = useState(false);

    // Navigation items definition
    const mainNavItems = [
        { name: 'Dashboard', path: '/dashboard', icon: FiHome },
        { name: 'Customers', path: '/customers', icon: FiUsers },
        { name: 'Orders', path: '/orders', icon: FiShoppingCart },
        { name: 'Addresses', path: '/addresses', icon: FiMapPin },
        { name: 'Businesses', path: '/businesses', icon: FiBriefcase },
        { name: 'Integration', path: '/integration', icon: FiZap },
    ];


    const bottomNavItems = [
        { name: 'Settings', path: '/settings', icon: FiSettings },
    ];

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const activeStyle = "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#5850ec] text-white transition-all duration-200 font-medium shadow-md shadow-[#5850ec]/20";
    const inactiveStyle = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200";

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-[#090d16] border-r border-slate-900 text-slate-200
          transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:sticky
          ${collapsed ? 'w-20' : 'w-72'}
          h-screen overflow-hidden
        `}
            >
                {/* Header - Brand Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-slate-900 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {/* Elegant Gradient Logo Icon */}
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shrink-0 shadow-lg shadow-indigo-500/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2m-4-3.5a2.5 2.5 0 014-2.5m-5.5 12h1.5a2 2 0 012 2v.5m-5 1.5a2 2 0 003 0m0 0a2 2 0 003 0" />
                            </svg>
                        </div>
                        {!collapsed && (
                            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent truncate select-none">
                                Address Engine
                            </span>
                        )}
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-1 text-slate-400 hover:text-white md:hidden hover:bg-slate-800 rounded-lg"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Navigation Items (Scrollable Body) */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">

                    {/* Main Navigation Stack */}
                    <div className="space-y-1">
                        {mainNavItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
                                title={collapsed ? item.name : undefined}
                            >
                                <item.icon className="shrink-0" size={20} />
                                {!collapsed && <span className="text-sm truncate">{item.name}</span>}
                            </NavLink>
                        ))}


                    </div>

                    <hr className="border-slate-900 mx-1" />

                    {/* Bottom Navigation Stack */}
                    <div className="space-y-1">
                        {bottomNavItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
                                title={collapsed ? item.name : undefined}
                            >
                                <item.icon className="shrink-0" size={20} />
                                {!collapsed && <span className="text-sm truncate">{item.name}</span>}
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Footer Accounts Section */}
                <div className="p-3 border-t border-slate-900 bg-[#070b12] space-y-2 shrink-0">


                    {/* Expand/Collapse Trigger (Only on Desktop) */}
                    <button
                        onClick={toggleCollapsed}
                        className="hidden md:flex w-full items-center justify-center py-1.5 rounded-lg border border-slate-900/60 hover:bg-slate-800/40 text-slate-400 hover:text-white transition-all duration-200"
                        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {collapsed ? <FiChevronsRight size={16} /> : <FiChevronsLeft size={16} />}
                    </button>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;
