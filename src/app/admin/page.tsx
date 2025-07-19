'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

const AdminDashboard = () => {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Product Card */}
          <Link href="/admin/add-product" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Add New Product</h2>
              <p className="text-gray-600">Add a new product to the store inventory</p>
            </div>
          </Link>

          {/* Manage Products Card */}
          <Link href="/admin/products" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Manage Products</h2>
              <p className="text-gray-600">View, edit, or delete existing products</p>
            </div>
          </Link>

          {/* Orders Card */}
          <Link href="/admin/orders" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Orders</h2>
              <p className="text-gray-600">View and manage customer orders</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 