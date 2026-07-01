import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { FiMenu, FiSearch, FiBell, FiHelpCircle, FiChevronRight } from 'react-icons/fi';
import Sidebar from './layouts/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import Customers from './pages/customers/Customers';
import Orders from './pages/orders/Orders';
import Addresses from './pages/addresses/Addresses';
import Businesses from './pages/businesses/Businesses';
import Integration from './pages/integration/Integration';

// Styled placeholder for pages not explicitly requested but inside sidebar links
const PlaceholderPage = ({ title }) => {
  const location = useLocation();
  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-8 max-w-4xl mx-auto shadow-xl">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <span>Workspace</span>
        <FiChevronRight size={10} />
        <span className="capitalize">{location.pathname.split('/').filter(Boolean).join(' / ')}</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
      <p className="text-slate-400 text-sm mb-6">
        This view is under active development. Address Engine's parsing and automation pipelines are fully operational.
      </p>
      <div className="inline-flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
        API Service Status: Online
      </div>
    </div>
  );
};

// Main Layout component containing Sidebar and Main Content areas
const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Helper to construct breadcrumbs
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <div key={routeTo} className="flex items-center gap-1.5">
              <FiChevronRight size={12} className="text-slate-600" />
              <Link
                to={routeTo}
                className={`capitalize transition-colors ${isLast ? 'text-indigo-400 font-semibold' : 'hover:text-white'}`}
              >
                {name.replace('-', ' ')}
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#070b13] text-slate-100 font-sans antialiased overflow-x-hidden">
      {/* Responsive Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Top Header Navbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-[#090d16] border-b border-slate-900 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            {/* Hamburger Button for mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg md:hidden shrink-0 transition-all duration-200"
              aria-label="Open navigation menu"
            >
              <FiMenu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:block min-w-0">
              {getBreadcrumbs()}
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Search Bar - hidden on very small screens */}
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                <FiSearch size={14} />
              </span>
              <input
                type="text"
                placeholder="Search addresses, customers..."
                className="w-60 bg-slate-900 border border-slate-800 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200"
              />
            </div>

            {/* Quick action buttons */}
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg relative transition-all duration-200" title="Notifications">
              <FiBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>

            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all duration-200" title="Help & Docs">
              <FiHelpCircle size={18} />
            </button>

            <span className="h-6 w-px bg-slate-850 mx-1 hidden sm:block" />

            {/* Micro Workspace Status */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20 text-[10px] font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Mode
            </div>
          </div>
        </header>

        {/* Dynamic Route Pages Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-[#070b13] overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/businesses" element={<Businesses />} />
            <Route path="/integration" element={<Integration />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
