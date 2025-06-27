import { Transaction } from '../store/useTransactionStore';

export const getChartData = (transactions: Transaction[]) => {
  const dateMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  transactions.forEach(tx => {
    const date = new Date(tx.date).toLocaleDateString();
    dateMap.set(date, (dateMap.get(date) || 0) + tx.amount);

    if (tx.category) {
      categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + Math.abs(tx.amount));
    }
  });

  const lineData = Array.from(dateMap, ([date, amount]) => ({ date, amount }));
  const pieData = Array.from(categoryMap, ([name, value]) => ({ name, value }));

  return { lineData, pieData };
};
