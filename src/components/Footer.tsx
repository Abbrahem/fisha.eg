'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <img src="/logo.jpg" alt="logo" className="h-7 w-7 mr-2" />
              fisha
            </h3>
            <p className="text-gray-400">Your destination for modern fashion and style.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/category/men" className="text-gray-400 hover:text-white">Men</Link></li>
              <li><Link href="/category/women" className="text-gray-400 hover:text-white">Women</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-400 hover:text-white">All Products</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-white">Returns</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="space-y-2">
              <a href="https://www.instagram.com/fisha.masr/?hl=ar" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white flex items-center gap-2">
                <Instagram className="inline-block w-5 h-5" />
                fisha.masr
              </a>
              <p className="text-gray-400">01014162504</p>
            </div>
            
            {/* Map iframe */}
            <div className="mt-4">
              <h5 className="text-sm font-semibold mb-2">Our Location</h5>
              <div className="w-full h-32 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3451.042023246475!2d31.34116068488303!3d30.121610981854236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDA3JzE3LjgiTiAzMcKwMjAnMjAuMyJF!5e0!3m2!1sar!2seg!4v1752934295434!5m2!1sar!2seg"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Craft Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} fisha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 
