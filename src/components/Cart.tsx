'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { X, Plus, Minus } from 'lucide-react'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { cart, removeFromCart, updateQuantity, total } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-4">Add some items to your cart to start shopping!</p>
            <Link
              href="/products"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              onClick={onClose}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="relative w-20 h-20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="text-sm text-gray-600">LE {item.price}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between font-semibold mb-2">
                <span>Subtotal</span>
                <span>LE {total}</span>
              </div>
              <div className="flex justify-between font-semibold mb-2">
                <span>Delivery Fee</span>
                <span>LE 120</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>LE {total + 120}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/checkout"
                className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onClose}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart 