'use client';

import { Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-600 mb-4">
          لو عندك أي استفسار أو محتاج مساعدة من fisha تواصل معنا في أي وقت!
        </p>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p className="text-gray-600">fisha@gmail.com</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Phone</h2>
            <p className="text-gray-600">01122363615</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Address</h2>
            <p className="text-gray-600">القاهره -العنوان📍الالف مسكن شارع عبد المحسن الوسيمي</p>
          </div>
          
          {/* Social Media Icons */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a 
                href="https://wa.me/201122363615" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 