'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  name: string;
  address: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: string;
  date: string;
}

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Subscribe to orders collection
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [isAuthenticated]);

  const updateOrderStatus = async (orderId: string, newStatus: string, items: OrderItem[]) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });

      if (newStatus === 'completed') {
        for (const item of items) {
          const productRef = doc(db, 'products', item.id);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            const productData = productSnap.data();
            const newAvailable = (productData.available || 0) - item.quantity;
            if (newAvailable > 0) {
              await updateDoc(productRef, { available: newAvailable });
            } else if (newAvailable === 0) {
              await deleteDoc(productRef);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Please log in to access this page</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(order.date), 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(order.date), 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.name}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{order.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 space-y-2">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="border-b border-gray-100 pb-2 last:border-b-0">
                            <div className="flex justify-between items-start gap-4 mb-1">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">
                                  {item.size && <span className="mr-2">Size: {item.size}</span>}
                                  {item.color && <span>Color: {item.color}</span>}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">LE {item.price.toFixed(2)}</div>
                                <div className="text-sm text-gray-500">x{item.quantity}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        LE {order.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value, order.items)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No orders found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders; 