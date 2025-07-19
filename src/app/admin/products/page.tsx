'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getProducts, deleteProduct, Product } from '@/services/productService'
import Swal from 'sweetalert2'

const ProductsPage = () => {
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    color: ''
  })
  const router = useRouter()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const productsData = await getProducts()
      setProducts(productsData)
      setFilteredProducts(productsData)
      setError(null)
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Apply filters
    let filtered = [...products]

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice))
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice))
    }

    if (filters.size) {
      filtered = filtered.filter(product => product.sizes?.includes(filters.size))
    }

    if (filters.color) {
      filtered = filtered.filter(product => product.colors?.includes(filters.color))
    }

    setFilteredProducts(filtered)
  }, [filters, products])

  const handleDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8f5be8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await deleteProduct(productId)
        setProducts(products.filter(p => p.id !== productId))
        setFilteredProducts(products.filter(p => p.id !== productId))
        
        Swal.fire(
          'Deleted!',
          'Product has been deleted.',
          'success'
        )
      } catch (err) {
        setError('Failed to delete product')
        console.error(err)
        
        Swal.fire(
          'Error!',
          'Failed to delete product.',
          'error'
        )
      }
    }
  }

  const handleEdit = (productId: string) => {
    router.push(`/admin/edit-product/${productId}`)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Please log in to access this page</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <Link
            href="/admin/add-product"
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Add New Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              >
                <option value="">All Categories</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>

            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                Min Price
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <select
                id="size"
                name="size"
                value={filters.size}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              >
                <option value="">All Sizes</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
              </select>
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <select
                id="color"
                name="color"
                value={filters.color}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              >
                <option value="">All Colors</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={product.images?.[0] || '/placeholder-image.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 mt-1">LE {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.category}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes?.map(size => (
                    <span key={size} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {size}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors?.map(color => (
                    <span key={color} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {color}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No products found</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage 