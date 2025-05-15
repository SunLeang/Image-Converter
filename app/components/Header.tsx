import React from 'react';
import { ImageDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full py-6">
      <div className="flex items-center justify-center">
        <ImageDown className="h-8 w-8 text-blue-600 mr-2" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Image QuickConvert
        </h1>
      </div>
      <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">
        Convert your WebP images to JPEG or PNG formats with no quality loss.
        Simple, fast, and free.
      </p>
    </header>
  );
}