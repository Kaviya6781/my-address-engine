import { useState } from 'react';
import { FiSearch, FiSliders, FiAlertOctagon, FiCheckCircle, FiShuffle, FiXCircle, FiTrendingUp } from 'react-icons/fi';

const initialOrders = [
  { id: '#ORD-89421', recipient: 'West Chennai Logistics Node', rawAddress: 'Plot 28, Industrial Estate, Guindy, Chennai, 600032', status: 'verified', value: '₹145,200', date: 'Today, 02:30 PM' },
  { id: '#ORD-89420', recipient: 'Moga Warehouse Depot B', rawAddress: 'Nestle Moga Factory Gate 2, GT Road, Moga, PB', status: 'corrected', value: '₹62,800', date: 'Today, 11:15 AM', notes: 'Appended PIN: 142001' },
  { id: '#ORD-89419', recipient: 'Unitech Distributor HQ', rawAddress: 'Building 14, Phase 2, DLF Cybercity, Gurugram', status: 'flagged', value: '₹412,000', date: 'Yesterday, 04:45 PM', notes: 'Missing Tower Number' },
  { id: '#ORD-89418', recipient: 'Southern Sales Retail Terminal', rawAddress: '154/B, Avinashi Road, Opposite KMCH, Coimbatore', status: 'verified', value: '₹98,500', date: 'Yesterday, 01:20 PM' },
  { id: '#ORD-89417', recipient: 'Noida Extension Hub', rawAddress: 'Sector 62, block C-56, near fortis hospital, Noida', status: 'verified', value: '₹18,900', date: 'Jun 28, 2026' },
  { id: '#ORD-89416', recipient: 'East Kolkata Warehouse', rawAddress: 'Salt Lake Sector 5, Block GP, Kolkata, West Bengal', status: 'failed', value: '₹280,000', date: 'Jun 27, 2026', notes: 'Invalid Postcode & City Match' },
];

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.recipient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.rawAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = filterTab === 'all' || o.status === filterTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Orders Routing
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Audit logistics pathways, verify address delivery blocks, and approve flagged orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 px-4 py-2.5 rounded-lg font-medium transition-all duration-200">
            Export Logs
          </button>
          <button className="bg-[#5850ec] hover:bg-[#4c44de] active:scale-95 text-xs text-white px-4 py-2.5 rounded-lg font-semibold shadow-md shadow-[#5850ec]/20 transition-all duration-200">
            Re-run Batch Audit
          </button>
        </div>
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Active Shipments</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-white">418</span>
            <span className="text-emerald-400 text-xs font-semibold flex items-center"><FiTrendingUp className="mr-0.5" /> +8.4%</span>
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Verification Corrected</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-sky-400">12%</span>
            <span className="text-slate-500 text-xs">auto-standardized</span>
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Manual Review Flagged</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-amber-500">3</span>
            <span className="text-amber-500/80 text-xs font-medium animate-pulse">Needs Review</span>
          </div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Delivery Success Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-emerald-400">99.88%</span>
            <span className="text-slate-500 text-xs">carrier SLA met</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-slate-900/40 border border-slate-850/60 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <FiSearch size={15} />
          </span>
          <input 
            type="text" 
            placeholder="Search Order ID, recipient, or street..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/80 p-1 rounded-lg shrink-0">
          <button 
            onClick={() => setFilterTab('all')} 
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${filterTab === 'all' ? 'bg-[#5850ec] text-white' : 'text-slate-400 hover:text-white'}`}
          >
            All Logs
          </button>
          <button 
            onClick={() => setFilterTab('verified')} 
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${filterTab === 'verified' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Verified
          </button>
          <button 
            onClick={() => setFilterTab('corrected')} 
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${filterTab === 'corrected' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Corrected
          </button>
          <button 
            onClick={() => setFilterTab('flagged')} 
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${filterTab === 'flagged' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Flagged
          </button>
          <button 
            onClick={() => setFilterTab('failed')} 
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${filterTab === 'failed' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Failed
          </button>
        </div>

      </div>

      {/* Orders Grid/Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Delivery Block Address</th>
                <th className="py-3 px-4">Shipment Value</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Audit Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                    No orders matching this category.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/10 transition-all duration-150">
                    <td className="py-4 px-4 font-bold text-white font-mono tracking-wide">{o.id}</td>
                    <td className="py-4 px-4 font-semibold text-slate-300">{o.recipient}</td>
                    <td className="py-4 px-4 max-w-sm">
                      <div className="flex flex-col">
                        <span className="text-slate-400 truncate" title={o.rawAddress}>{o.rawAddress}</span>
                        {o.notes && (
                          <span className={`text-[10px] mt-1 font-semibold ${
                            o.status === 'corrected' 
                              ? 'text-sky-400 bg-sky-500/5 border border-sky-500/10 px-1.5 py-0.5 rounded w-fit' 
                              : o.status === 'flagged' 
                              ? 'text-amber-400 bg-amber-500/5 border border-amber-500/10 px-1.5 py-0.5 rounded w-fit' 
                              : 'text-rose-400 bg-rose-500/5 border border-rose-500/10 px-1.5 py-0.5 rounded w-fit'
                          }`}>
                            {o.notes}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-300">{o.value}</td>
                    <td className="py-4 px-4">
                      {o.status === 'verified' && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <FiCheckCircle size={10} /> Verified Routing
                        </span>
                      )}
                      {o.status === 'corrected' && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
                          <FiShuffle size={10} /> Auto Patched
                        </span>
                      )}
                      {o.status === 'flagged' && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          <FiAlertOctagon size={10} /> Review Required
                        </span>
                      )}
                      {o.status === 'failed' && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                          <FiXCircle size={10} /> Blocked Route
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-right">{o.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
