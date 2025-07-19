import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/services/productService'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="w-[250px] bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-[250px]">
        <Image
          src={product.images?.[0] || '/placeholder-image.jpg'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
        <p className="text-xl font-bold text-gray-900">LE {product.price}</p>
      </div>
    </div>
  )
} 