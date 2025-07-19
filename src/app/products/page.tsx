'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/services/productService';
import { getProducts } from '@/services/productService';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const productColors = ['white', 'black', 'blue', 'red', 'brown', 'gold', 'browns'];
  const [color, setColor] = useState('');

  const menSubcategories = [
    'nike', 'jorden', 'adidas', 'Dior', 'Balansiaga', 'louis vituuen', 'D&G', 'AIR', 'Lanvain', 'off white', 'BaBe', 'Aalxander Mquenn', 'Naked wolfe'
  ];
  const [brand, setBrand] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts();
        setProducts(allProducts);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    ((product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
    (color === '' || (product.colors && product.colors.includes(color))) &&
    (brand === '' || (product.menSubcategory === brand))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <select
              value={brand}
              onChange={e => setBrand(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Types</option>
              {menSubcategories.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select
              value={color}
              onChange={e => setColor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Colors</option>
              {productColors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h2>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-lg font-bold text-gray-900">LE {typeof product.price === 'number' ? product.price.toFixed(2) : (product.price || 'N/A')}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 