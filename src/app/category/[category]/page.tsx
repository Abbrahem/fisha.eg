'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/services/productService';
import { subscribeToProductsByCategory } from '@/services/productService';
import { getProducts } from '@/services/productService';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');

  const menSubcategories = [
    'nike', 'jorden', 'adidas', 'Dior', 'Balansiaga', 'louis vituuen', 'D&G', 'AIR', 'Lanvain', 'off white', 'BaBe', 'Aalxander Mquenn', 'Naked wolfe'
  ];
  const menColors = ['white', 'black', 'أحمر', 'أزرق', 'بني'];
  const menSizes = ['40', '41', '42', '43', '44', '45', '46', '47'];
  const womenSizes = ['36', '37', '38', '39', '40', '41'];
  const womenColors = ['red', 'blue', 'black', 'white', 'green'];
  const productColors = ['white', 'black', 'blue', 'red', 'brown', 'gold', 'browns'];

  // Filter products
  const filteredProducts = products.filter(product => {
    if (params.category === 'men') {
      const matchesType = !brand || (product.menSubcategory === brand);
      const matchesColor = !color || (product.colors && product.colors.includes(color));
      const matchesSize = !size || (product.sizes && product.sizes.includes(size));
      const matchesSearch = !searchTerm || (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      return matchesType && matchesColor && matchesSize && matchesSearch;
    }
    if (params.category === 'women') {
      const matchesColor = !color || (product.colors && product.colors.includes(color));
      const matchesSize = !size || (product.sizes && product.sizes.includes(size));
      const matchesSearch = !searchTerm || (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      return matchesColor && matchesSize && matchesSearch;
    }
    return true;
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        let category = params.category;
        let categoryValues: string[] = [];
        if (category === 'men') categoryValues = ['men', 'others'];
        else if (category === 'women') categoryValues = ['women', 't-shirts', 'tshirts', 't-shirt'];
        else categoryValues = [category];
        const allProducts = await getProducts();
        const filtered = allProducts.filter(p => categoryValues.includes((p.category || '').toLowerCase()));
        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
        console.error(err);
      }
    };

    loadProducts();
  }, [params.category]);

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

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Products Found</h1>
            <p className="text-gray-600 mb-8">No products available in this category.</p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
          {params.category}
        </h1>

        {/* Men Filters */}
        {params.category === 'men' && (
          <div className="mb-8 flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search Men..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
            <select value={brand} onChange={e => setBrand(e.target.value)} className="px-4 py-2 border rounded-md">
              <option value="">All Types</option>
              {menSubcategories.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={color} onChange={e => setColor(e.target.value)} className="px-4 py-2 border rounded-md">
              <option value="">All Colors</option>
              {productColors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={size} onChange={e => setSize(e.target.value)} className="px-4 py-2 border rounded-md">
              <option value="">All Sizes</option>
              {menSizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        {/* Women Filters */}
        {params.category === 'women' && (
          <div className="mb-8 flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search Women..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
            <select value={color} onChange={e => setColor(e.target.value)} className="px-4 py-2 border rounded-md">
              <option value="">All Colors</option>
              {womenColors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={size} onChange={e => setSize(e.target.value)} className="px-4 py-2 border rounded-md">
              <option value="">All Sizes</option>
              {womenSizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h2>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                <p className="text-lg font-bold text-gray-900">LE {product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 