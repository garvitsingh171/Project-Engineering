import React from 'react';
import { useCustomers } from '../hooks/useCustomers';
import CustomerRow from '../components/CustomerRow';
import { SkeletonCard, ErrorMessage, EmptyState } from '../components/states'

const Customers = () => {
    const { data: customers, isLoading, error } = useCustomers();

    // DELIBERATE GAP: Nothing here for loading, error, or empty data records.
    if (isLoading) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h1>
      <SkeletonCard count={4} variant="table" />
    </div>
  )
}

if (error) {
  return (
    <div className="p-8">
      <ErrorMessage
        message="We couldn't load your orders. Check your connection and try again."
        onRetry={refetch}
      />
    </div>
  )
}

if (!orders || orders.length === 0) {
  return (
    <div className="p-8">
      <EmptyState
        title="No orders yet"
        message="New orders will appear here once customers start purchasing."
      />
    </div>
  )
}

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">Customer Management</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50 capitalize">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order History</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Value</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {customers && customers.map(customer => (
                            <CustomerRow key={customer.id} customer={customer} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;
