import { useState, useEffect } from 'react'
import { Product, getProducts, addProduct } from './services/productService'

function App() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // Load products on component mount
    getProducts().then(setProducts)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
              <p className="mt-2 text-gray-600">{product.description}</p>
              <p className="mt-2 text-lg font-medium text-gray-900">LE {product.price}</p>
              <div className="mt-4">
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-600">
                  {product.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App 