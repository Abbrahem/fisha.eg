'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getProductById, updateProduct, uploadProductImages } from '@/services/productService'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock?: number
}

interface EditProductPageProps {
  params: {
    id: string
  }
}

const EditProductPage = ({ params }: EditProductPageProps) => {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    stock: '',
    sizes: [] as string[],
    colors: [] as string[],
    menSubcategory: ''
  })
  const [images, setImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const menSubcategories = [
    'nike', 'jorden', 'adidas', 'Dior', 'Balansiaga', 'louis vituuen', 'D&G', 'AIR', 'Lanvain', 'off white', 'BaBe', 'Aalxander Mquenn', 'Naked wolfe'
  ];
  const menColors = ['white', 'black', 'أحمر', 'أزرق', 'بني'];
  const menSizes = ['40', '41', '42', '43', '44', '45', '46', '47'];
  const womenSizes = ['36', '37', '38', '39', '40', '41'];

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        const product = await getProductById(params.id)
        if (product) {
          setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            image: '', // not used, we use images[]
            category: product.category,
            stock: product.stock?.toString() || '',
            sizes: product.sizes || [],
            colors: product.colors || [],
            menSubcategory: product.menSubcategory || ''
          })
          setImages(product.images || [])
          setPreviewUrls(product.images || [])
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Failed to load product')
      } finally {
        setIsLoading(false)
      }
    }
    loadProduct()
  }, [params.id])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setNewImages(prev => [...prev, ...newFiles])
      // Preview
      const base64Promises = newFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      })
      const newPreviewUrls = await Promise.all(base64Promises)
      setPreviewUrls(prev => [...prev, ...newPreviewUrls])
    }
  }

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(value)
        ? prev.sizes.filter(size => size !== value)
        : [...prev.sizes, value]
    }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(value)
        ? prev.colors.filter(color => color !== value)
        : [...prev.colors, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      if (!formData.name || !formData.price || !formData.description || (!images.length && !newImages.length)) {
        throw new Error('Please fill in all fields and upload at least one image')
      }
      let imageUrls = images
      if (newImages.length > 0) {
        const uploaded = await uploadProductImages(newImages)
        imageUrls = [...images, ...uploaded]
      }
      await updateProduct(params.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        images: imageUrls,
        category: formData.category,
        stock: parseInt(formData.stock),
        sizes: formData.sizes,
        colors: formData.colors,
        menSubcategory: formData.menSubcategory
      })
      router.push('/admin/products')
    } catch (err) {
      setError('Failed to update product')
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
              <div className="mt-2 grid grid-cols-3 gap-2">
                {previewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value, sizes: [], colors: [], menSubcategory: '' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>

            {formData.category === 'men' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Men Type</label>
                <select
                  name="menSubcategory"
                  value={formData.menSubcategory}
                  onChange={e => setFormData({ ...formData, menSubcategory: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a type</option>
                  {menSubcategories.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            )}

            {formData.category === 'women' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Sizes</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {womenSizes.map(size => (
                    <label key={size} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={size}
                        checked={formData.sizes.includes(size)}
                        onChange={handleSizeChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {formData.category === 'men' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Sizes</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {menSizes.map(size => (
                    <label key={size} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={size}
                        checked={formData.sizes.includes(size)}
                        onChange={handleSizeChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {formData.category === 'men' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Colors</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {menColors.map(color => (
                    <label key={color} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={color}
                        checked={formData.colors.includes(color)}
                        onChange={handleColorChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                min="0"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 border border-transparent rounded-md text-white ${
                  isLoading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProductPage 