import { apiUrl } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { 
  UtensilsCrossed, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface MenuItemInventory {
  dish_id: string;
  name: string;
  category: string;
  base_price: number;
  is_available: number;
  updated_at: string;
}

export const AdminMenuPage: React.FC = () => {
  const { token } = useAuth();
  const [items, setItems] = useState<MenuItemInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toggleNotice, setToggleNotice] = useState<string | null>(null);

  const fetchMenu = async () => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl('/api/admin/menu'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (err) {
      console.warn('Admin menu fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [token]);

  const toggleAvailability = async (dishId: string) => {
    try {
      const res = await fetch(apiUrl(`/api/admin/menu/${dishId}/toggle`), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setToggleNotice(data.message);
        setTimeout(() => setToggleNotice(null), 3000);
        // Optimistic update
        setItems(prev =>
          prev.map(i =>
            i.dish_id === dishId ? { ...i, is_available: data.isAvailable ? 1 : 0 } : i
          )
        );
      }
    } catch (err) {
      console.warn('Toggle dish error:', err);
    }
  };

  // Derive categories
  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const availableCount = items.filter(i => i.is_available === 1).length;
  const soldOutCount = items.length - availableCount;

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-cream-100 flex items-center gap-3">
              <UtensilsCrossed className="w-8 h-8 text-gold-400" />
              <span>Menu Inventory & Stock Control</span>
            </h1>
            <p className="text-xs text-cream-300 mt-1">
              Toggle live dish availability during kitchen rush hours ({availableCount} active · {soldOutCount} sold out)
            </p>
          </div>

          <button
            onClick={fetchMenu}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 hover:border-gold-500/40 text-cream-300 hover:text-gold-400 text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Roster</span>
          </button>
        </div>

        {/* Live Notification Toast */}
        {toggleNotice && (
          <div className="p-3.5 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs flex items-center gap-2 animate-fadeIn shadow-lg">
            <Check className="w-4 h-4 text-gold-400 shrink-0" />
            <span>{toggleNotice}</span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Select */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.slice(0, 7).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-gold-500 text-charcoal-950 font-bold shadow'
                    : 'bg-charcoal-800 text-cream-300 hover:bg-charcoal-750'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-charcoal-800 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-6 shadow-xl space-y-4">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-cream-300">Loading catalog items...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-charcoal-750 text-cream-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Dish Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Catalog Price</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Availability Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-800">
                  {filteredItems.map((item) => {
                    const isAvail = item.is_available === 1;
                    return (
                      <tr key={item.dish_id} className="hover:bg-charcoal-850/60 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-cream-100">
                          {item.name}
                        </td>
                        <td className="py-3.5 px-4 text-cream-300">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-cream-200">
                          ₹{item.base_price || 180}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isAvail
                              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-400'
                              : 'bg-rose-950/70 border border-rose-500/40 text-rose-400'
                          }`}>
                            {isAvail ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <span>{isAvail ? 'In Stock (Live)' : 'Sold Out'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => toggleAvailability(item.dish_id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                              isAvail
                                ? 'bg-charcoal-800 hover:bg-rose-900/40 text-rose-300 border border-rose-500/30'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-cream-100 shadow'
                            }`}
                          >
                            {isAvail ? 'Mark Sold Out' : 'Mark In Stock'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
