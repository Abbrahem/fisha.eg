'use client';

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600 text-center">
            You haven't placed any orders yet.
          </p>
          <div className="mt-6 text-center">
            <a
              href="/products"
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 