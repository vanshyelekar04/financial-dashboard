import { create } from 'zustand';
import API from '../services/api';
import axios from 'axios';


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
  lineData: { date: string; amount: number }[];
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
  stats: Stats | null;
  filters: Filter;
  page: number;
  limit: number;
  total: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilters: (filters: Filter) => void;
  fetchTransactions: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

export const useTransactionStore = create<Store>((set, get) => ({
  transactions: [],
  stats: null,
  filters: {},
  page: 1,
  limit: 10,
  total: 0,

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setFilters: (filters) => set({ filters, page: 1 }),

  fetchTransactions: async () => {
    const { filters, page, limit } = get();
    try {
      const res = await API.get('/transactions', { params: { ...filters, page, limit } });
      set({ transactions: res.data.data, total: res.data.total });
    } catch (err: any) {
      console.error('[FETCH_TRANSACTIONS ERROR]', err.message || err);
    }
  },

  fetchStats: async () => {
  const { filters } = get();
  const {
    search, category, status, user,
    minAmount, maxAmount, startDate, endDate,
    sortBy, sortOrder
  } = filters;

  const statFilters = {
    search, category, status, user, minAmount, maxAmount, startDate, endDate
  };

  try {
    const response = await API.get('/transactions/stats', { params: statFilters });
    set({ stats: response.data });
  } catch (error: any) {
    console.error('[FETCH_STATS ERROR]', error?.response?.data?.message || error.message || error);
    set({ stats: null });
  }
}



}));
