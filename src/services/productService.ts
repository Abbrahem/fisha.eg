import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
  stock?: number;
  createdAt?: any;
  updatedAt?: any;
  status?: string;
  othersSubcategory?: string;
  shoesSubcategory?: string;
}

// Local storage key
const STORAGE_KEY = 'products';

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    description: 'A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear.',
    price: 299.99,
    images: [
      '/products/white-tshirt-1.jpg',
      '/products/white-tshirt-2.jpg',
      '/products/white-tshirt-3.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Navy'],
    category: 't-shirts'
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with a comfortable stretch. Features a classic five-pocket design.',
    price: 799.99,
    images: [
      '/products/jeans-1.jpg',
      '/products/jeans-2.jpg',
      '/products/jeans-3.jpg',
    ],
    sizes: ['30', '32', '34', '36'],
    colors: ['Blue', 'Black', 'Gray'],
    category: 'pants'
  },
  {
    id: '3',
    name: 'Leather Boots',
    description: 'Premium leather boots with a modern design. Features a comfortable sole and durable construction.',
    price: 1999.99,
    images: [
      '/products/boots-1.jpg',
      '/products/boots-2.jpg',
      '/products/boots-3.jpg',
    ],
    sizes: ['41', '42', '43', '44'],
    colors: ['Brown', 'Black'],
    category: 'others'
  },
];

// Initialize products in localStorage if not present
export const initializeProducts = () => {
  if (typeof window === 'undefined') return;

  const storedProducts = localStorage.getItem(STORAGE_KEY);
  if (!storedProducts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProducts));
  }
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
  } catch (error) {
    console.error('Error getting products:', error);
    throw new Error('Failed to fetch products');
  }
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const product = querySnapshot.docs.find(doc => doc.id === id);
    return product ? { id: product.id, ...product.data() } as Product : undefined;
  } catch (error) {
    console.error('Error getting product:', error);
    throw new Error('Failed to fetch product');
  }
};

// Add a new product
export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const docRef = await addDoc(collection(db, 'products'), product);
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
};

// Update a product
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | undefined> => {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, updates);
    const updatedProduct = await getProductById(id);
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'products', id));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

// Get products by category (يدعم array)
export const getProductsByCategory = async (categories: string[] | string): Promise<Product[]> => {
  try {
    let q;
    if (Array.isArray(categories)) {
      // استخدم where in لجلب كل المنتجات التي تنتمي لأي من القيم
      q = query(collection(db, 'products'), where('category', 'in', categories));
    } else {
      q = query(collection(db, 'products'), where('category', '==', categories));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw new Error('Failed to fetch products by category');
  }
};

// Subscribe to all products
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  getProducts().then(callback);
  return () => {}; // Cleanup function
};

// Subscribe to products by category (يدعم array)
export const subscribeToProductsByCategory = async (categories: string[] | string, callback: (products: Product[]) => void) => {
  try {
    const products = await getProductsByCategory(categories);
    callback(products);
  } catch (error) {
    console.error('Error subscribing to products by category:', error);
    throw new Error('Failed to subscribe to products by category');
  }
  return () => {}; // Cleanup function
};

// Upload product images to Cloudinary
export const uploadProductImages = async (files: File[]): Promise<string[]> => {
  const cloudName = 'dkznmxklj'; // Your Cloudinary cloud name
  const uploadPreset = 'my_unsigned_preset'; // Your Cloudinary unsigned upload preset

  const imageUrls: string[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      imageUrls.push(response.data.secure_url);
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error('Failed to upload image to Cloudinary.');
    }
  }
  return imageUrls;
}; 