'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Plus, X } from 'lucide-react'
import { addProduct, uploadProductImages } from '@/services/productService'

const AddProductPage = () => {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    sizes: [] as string[],
    colors: [] as string[],
    stock: '',
    othersSubcategory: '',
    uploadedImages: [] as string[],
    menSubcategory: ''
  })
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      category, 
      sizes: [],
      colors: [],
      menSubcategory: ''
    }));
  };

  const handleOthersSubcategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, othersSubcategory: e.target.value }))
  }

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      sizes: checked
        ? [...prev.sizes, value]
        : prev.sizes.filter(size => size !== value)
    }))
  }

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      colors: checked
        ? [...prev.colors, value]
        : prev.colors.filter(color => color !== value)
    }))
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setLoading(true)
      setError(null)

      try {
        // Upload images immediately
        const imageUrls = await uploadProductImages(newFiles)
        
        // Convert new files to Base64 for preview
        const base64Promises = newFiles.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
        })
        const newPreviewUrls = await Promise.all(base64Promises)
        
        // Update state with uploaded URLs and previews
        setImages(prev => [...prev, ...newFiles])
        setPreviewUrls(prev => [...prev, ...newPreviewUrls])
        
        // Store uploaded URLs for later use
        setFormData(prev => ({
          ...prev,
          uploadedImages: [...(prev.uploadedImages || []), ...imageUrls]
        }))
      } catch (err) {
        console.error('Error uploading images:', err)
        setError('Failed to upload images')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Use already uploaded images
      const product = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.uploadedImages || [],
      }

      await addProduct(product)
      router.push('/admin/products')
    } catch (err) {
      setError('Failed to add product')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getAvailableSizes = () => {
    switch (formData.category) {
      case 'others':
        return []
      case 'pants':
        return ['30', '32', '34', '36', '38']
      case 't-shirts':
        return ['S', 'M', 'L', 'XL', 'XXL']
      default:
        return []
    }
  }

  const menSubcategories = [
    'nike', 'jorden', 'adidas', 'Dior', 'Balansiaga', 'louis vituuen', 'D&G', 'AIR', 'Lanvain', 'off white', 'BaBe', 'Aalxander Mquenn', 'Naked wolfe'
  ];
  const productColors = ['white', 'black', 'blue', 'red', 'brown', 'gold', 'browns'];
  const menSizes = ['40', '41', '42', '43', '44', '45', '46', '47'];
  const womenSizes = ['36', '37', '38', '39', '40', '41'];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Please log in to access this page</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>

        {/* Men subcategory select */}
        {formData.category === 'men' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Men Type</label>
            <select
              name="menSubcategory"
              value={formData.menSubcategory}
              onChange={e => setFormData(prev => ({ ...prev, menSubcategory: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a type</option>
              {menSubcategories.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        )}

        {/* Sizes */}
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

        {/* Colors */}
        {formData.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Colors</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {productColors.map(color => (
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
          <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={loading}
            className="mt-1 block w-full"
          />
          {loading && (
            <div className="mt-2 text-sm text-blue-600">
              Uploading images...
            </div>
          )}
          {error && (
            <div className="mt-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="mt-2 grid grid-cols-3 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImages(prev => prev.filter((_, i) => i !== index))
                    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
                    setFormData(prev => ({
                      ...prev,
                      uploadedImages: prev.uploadedImages?.filter((_, i) => i !== index) || []
                    }))
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProductPage 