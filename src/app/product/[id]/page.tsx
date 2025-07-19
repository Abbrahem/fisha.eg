'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { getProducts, Product } from '@/services/productService'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Swal from 'sweetalert2'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        const products = await getProducts()
        const foundProduct = products.find(p => p.id === params.id)
        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Failed to load product')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    if (!selectedSize || !selectedColor) {
      Swal.fire({
        icon: 'warning',
        title: 'Selection Required',
        text: 'Please select both size and color',
        confirmButtonColor: '#8f5be8'
      })
      return
    }
    if (quantity < 1 || quantity > (product.stock || 1)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Quantity',
        text: 'Please select a valid quantity',
        confirmButtonColor: '#8f5be8'
      })
      return
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[currentImageIndex],
      size: selectedSize,
      color: selectedColor,
      quantity,
    })
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: 'Product has been added to your cart successfully',
      confirmButtonColor: '#8f5be8'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error || !product) {
    return <div className="p-4 text-red-500">{error || 'Product not found'}</div>
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="relative">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              
              {/* Image Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-black' : 'border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="w-full md:w-3/5">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-2xl font-bold text-gray-900 mb-6">LE {product.price}</p>

              {/* Sizes */}
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-900 mb-2">Size</h2>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 text-gray-700 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-900 mb-2">Color</h2>
                <div className="flex flex-wrap gap-2">
                  {product.colors?.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedColor === color
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 text-gray-700 hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-900 mb-2">Quantity</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock || 10} available
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  selectedSize && selectedColor
                    ? 'bg-black hover:bg-gray-800'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!selectedSize || !selectedColor}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 