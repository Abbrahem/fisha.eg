import { NextResponse } from 'next/server';

// Sample product data (replace with actual database fetch later)
let products = [
  {
    id: '1',
    name: 'Classic White Sneakers',
    price: 89.99,
    image: 'https://placehold.co/400x400/ffffff/000000?text=White+Sneakers',
    category: 'others'
  },
  {
    id: '2',
    name: 'Black Leather Boots',
    price: 129.99,
    image: 'https://placehold.co/400x400/000000/ffffff?text=Black+Boots',
    category: 'others'
  },
  {
    id: '3',
    name: 'Casual T-Shirt',
    price: 29.99,
    image: 'https://placehold.co/400x400/ffffff/000000?text=T-Shirt',
    category: 'others'
  },
  {
    id: '4',
    name: 'Slim Fit Jeans',
    price: 59.99,
    image: 'https://placehold.co/400x400/000080/ffffff?text=Jeans',
    category: 'others'
  }
];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const newProduct = await request.json();
  products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}

export async function PUT(request: Request) {
  const updatedProduct = await request.json();
  const index = products.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = updatedProduct;
    return NextResponse.json(updatedProduct);
  }
  return NextResponse.json({ error: 'Product not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    return NextResponse.json({ message: `Product ${id} deleted successfully` });
  }
  return NextResponse.json({ error: 'Product not found' }, { status: 404 });
} 