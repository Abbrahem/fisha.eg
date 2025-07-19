'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Checkout = () => {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const order = {
        ...formData,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        total: total + 120, // Adding delivery fee
        status: 'pending',
        date: new Date().toISOString(),
      };

      // Add order to Firestore
      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, order);
      
      setSuccessMessage('Order placed successfully! You will be redirected shortly...');
      setTimeout(() => {
        clearCart();
        router.push('/order-confirmation');
      }, 2000);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between py-2">
            <span>{item.name} x {item.quantity}</span>
            <span>LE {item.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>LE {total}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Delivery Fee</span>
            <span>LE 120</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span>LE {total + 120}</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              +02
            </span>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Delivery Policy</h3>
          <p className="text-sm text-gray-600">
            All orders are processed within 24 hours. Delivery typically takes 2-3 business days.
            A delivery fee of LE 120 is added to all orders. For any delivery-related queries,
            please contact our customer service.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout; 
