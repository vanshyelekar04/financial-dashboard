// src/store/useTransactionStore.ts
import { create } from 'zustand';
import API from '../services/api';

export interface Transaction {
  _id: string;
  amount: number;
  category: string;
  status: string;
  user: string;
  user_profile?: string;
  date: string;
}

export interface Stats {
  totalBalance: number;
  revenue: number;
  expenses: number;
  savings: number;
  categoryBreakdown: Record<string, number>;
}

export interface Filter {
  search?: string;
  category?: string;
  status?: string;
  user?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface Store {
  transactions: Transaction[];
  total: number;
  filters: Filter;
  stats: Stats | null;
  page: number;
  limit: number;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  setFilters: (f: Filter) => void;
  fetchTransactions: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

export const useTransactionStore = create<Store>((set, get) => ({
  transactions: [],
  total: 0,
  filters: {},
  stats: null,
  page: 1,
  limit: 10,
  setPage: (page) => set({ page }),
  setFilters: (filters) => set({ filters }),
  setLimit: (limit) => set({ limit }),
  fetchTransactions: async () => {
    const { filters, page, limit } = get();
    try {
      const res = await API.get('/transactions', {
        params: { ...filters, page, limit },
      });
      set({ transactions: res.data.data, total: res.data.total });
    } catch (err) {
      console.error('Fetch transactions error:', err);
    }
  },
  fetchStats: async () => {
    const { filters } = get();
    try {
      const res = await API.get('/transactions/stats', { params: filters });
      set({ stats: res.data });
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  },
}));
