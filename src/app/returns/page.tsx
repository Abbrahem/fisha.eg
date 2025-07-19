'use client';

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Returns & Exchanges</h1>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
          <p className="text-gray-600 mb-4">
            We accept returns within 30 days of delivery. Items must be unworn,
            unwashed, and in their original packaging with all tags attached.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Return Process</h3>
              <ol className="list-decimal list-inside mt-2 text-gray-600">
                <li>Contact our customer service team</li>
                <li>Receive a return authorization number</li>
                <li>Package your item with the return label</li>
                <li>Ship the item back to us</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Exchanges</h2>
          <p className="text-gray-600">
            We offer exchanges for different sizes or colors of the same item.
            Please contact our customer service team to initiate an exchange.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Refunds</h2>
          <p className="text-gray-600">
            Once we receive your return, we will process your refund within 5-7
            business days. The refund will be issued to your original payment
            method.
          </p>
        </div>
      </div>
    </div>
  );
} 