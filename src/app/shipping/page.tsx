'use client';

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shipping Information</h1>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Methods</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Standard Shipping</h3>
              <p className="text-gray-600">2-3 business days</p>
              <p className="text-gray-600">LE 120</p>
            </div>
            <div>
              <h3 className="font-medium">Express Shipping</h3>
              <p className="text-gray-600">1 business day</p>
              <p className="text-gray-600">LE 200</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Areas</h2>
          <p className="text-gray-600">
            We currently ship to the following areas:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-600">
            <li>Greater Cairo</li>
            <li>Alexandria</li>
            <li>Giza</li>
            <li>All major cities in Egypt</li>
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Policy</h2>
          <p className="text-gray-600">
            Orders are typically processed within 24 hours. You will
            receive a shipping confirmation email with tracking information once
            your order has been shipped. Delivery times may vary based on your location.
          </p>
        </div>
      </div>
    </div>
  );
} 