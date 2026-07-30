import { useMemo, useState } from "react";
import { generateTransactions } from "../data/generateTransactions";

// Pre-seeded transactions
const initialTransactions = generateTransactions(2000);

export const useTransactions = () => {
  const [transactions] = useState(initialTransactions);
  const [filter, setFilter] = useState("");

  // DELIBERATE PERFORMANCE PROBLEM:
  // Computing filteredTransactions every render without useMemo
  // const filteredTransactions = transactions.filter(t =>
  //   t.name.toLowerCase().includes(filter.toLowerCase()) ||
  //   t.category.toLowerCase().includes(filter.toLowerCase())
  // );

  const filteredTransactions = useMemo(() => {
    const query = filter.toLowerCase();

    return transactions.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
    );
  }, [transactions, filter]);

  return {
    transactions,
    filteredTransactions,
    filter,
    setFilter,
  };
};
