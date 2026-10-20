import { apiUrl } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, RefreshCw, Mail, Phone, Calendar, IndianRupee } from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  order_count: number;
  total_spend: number;
}

export const AdminCustomersPage: React.FC = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl('/api/admin/customers'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers);
      }
    } catch (err) {
      console.warn('Fetch customers error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone && c.phone.includes(q));
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-cream-100 flex items-center gap-3">
              <Users className="w-8 h-8 text-gold-400" />
              <span>Customer Relationship Directory</span>
            </h1>
            <p className="text-xs text-cream-300 mt-1">
              Registered patron profiles, lifetime dining spend, and contact records
            </p>
          </div>

          <button
            onClick={fetchCustomers}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-charcoal-900 border border-charcoal-700 hover:border-gold-500/40 text-cream-300 hover:text-gold-400 text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Roster</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-charcoal-800 border border-charcoal-700 text-cream-100 text-xs focus:outline-none focus:border-gold-400"
            />
          </div>

          <span className="text-xs text-cream-400 hidden sm:block">
            {filteredCustomers.length} registered patron{filteredCustomers.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-6 shadow-xl space-y-4">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-cream-300">Loading customer database...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="py-16 text-center text-cream-400 text-sm">
              No registered customers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-charcoal-750 text-cream-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Patron Name</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Total Orders</th>
                    <th className="py-3 px-4">Lifetime Spend</th>
                    <th className="py-3 px-4 text-right">Member Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-800">
                  {filteredCustomers.map((cust) => {
                    const joinedDate = new Date(cust.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });

                    return (
                      <tr key={cust.id} className="hover:bg-charcoal-850/60 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-cream-100 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-charcoal-800 border border-gold-500/30 text-gold-400 flex items-center justify-center font-serif text-xs font-bold">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{cust.name}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-cream-200 block">{cust.email}</span>
                          <span className="text-cream-400 text-[11px] block">{cust.phone || 'No phone'}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-cream-100">
                          {cust.order_count} order{cust.order_count !== 1 ? 's' : ''}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-gold-400 text-sm">
                          ₹{Math.round(cust.total_spend)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-cream-400 font-mono text-[11px]">
                          {joinedDate}
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
