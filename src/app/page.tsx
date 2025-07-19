'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Product, getProducts } from "@/services/productService";
import Head from "next/head";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getProducts();
        setProducts(allProducts);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <Head>
        <title>fisha</title>
      </Head>
      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center min-h-[600px] py-20 mb-12"
        style={{
          backgroundImage: "url('/street.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-bold mb-6 text-white">Welcome to fisha</h1>
          <p className="text-xl text-gray-200 mb-8">Your destination for modern fashion and style.</p>
          <Link 
            href="/products" 
            className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/category/men" className="group">
            <div className="relative h-80 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Men</h3>
              </div>
            </div>
          </Link>
          <Link href="/category/women" className="group">
            <div className="relative h-80 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Women</h3>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* About/Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">About Shop</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: عن fisha */}
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition">
            <svg className="w-12 h-12 mb-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7V6a3 3 0 013-3h12a3 3 0 013 3v1M3 7h18M3 7v11a3 3 0 003 3h12a3 3 0 003-3V7M9 16h6" /></svg>
            <h3 className="text-xl font-bold mb-2">عن fisha</h3>
            <p className="text-gray-600">fisha هو وجهتك للموضة العصرية والجودة العالية. بنقدملك أحدث التصميمات وأفضل تجربة تسوق أونلاين.</p>
          </div>
          {/* Card 2: التوصيل */}
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition">
            <svg className="w-12 h-12 mb-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16V8a2 2 0 012-2h3m10 10V8a2 2 0 00-2-2h-3m-6 10v1a2 2 0 002 2h6a2 2 0 002-2v-1m-10 0h10" /></svg>
            <h3 className="text-xl font-bold mb-2">توصيل سريع وآمن</h3>
            <p className="text-gray-600">نوصل طلبك لأي مكان في مصر بسرعة وأمان مع متابعة لحظية لحالة الأوردر.</p>
          </div>
          {/* Card 3: الخامات والاستيراد */}
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition">
            <svg className="w-12 h-12 mb-4 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
            <h3 className="text-xl font-bold mb-2">خامات مستوردة وجودة مميزة</h3>
            <p className="text-gray-600">كل منتجاتنا مصنوعة من خامات عالية الجودة، ونسبة كبيرة منها مستوردة لتضمن لك أفضل إحساس وراحة.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.images?.[0] || '/placeholder-image.jpg'}
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
      </section>
    </div>
  );
}
