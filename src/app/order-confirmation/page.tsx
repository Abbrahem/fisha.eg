'use client'

import Link from 'next/link';

const OrderConfirmation = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your order. We have received your order and will begin processing it shortly.
          You will receive a confirmation email with your order details.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 