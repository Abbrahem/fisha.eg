'use client'

import Link from 'next/link'
import { ShoppingCart, ChevronDown } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import Cart from './Cart'

const Navbar = () => {
  const { itemCount } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img src="/logo.jpg" alt="logo" className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold" style={{ color: '#111827' }}>fisha</span>
            </Link>
            
            {/* Desktop Categories */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/category/men" className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                Men
              </Link>
              <Link href="/category/women" className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                Women
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile Categories Dropdown */}
            <div className="relative sm:hidden">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center px-4 py-2 text-gray-900 hover:text-gray-500 rounded-md text-sm font-medium"
              >
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link 
                    href="/category/men" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Men
                  </Link>
                  <Link 
                    href="/category/women" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Women
                  </Link>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-900 hover:text-gray-500"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  )
}

export default Navbar 