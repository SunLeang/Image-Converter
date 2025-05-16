'use client';

import React, { useState } from 'react';
import { ConvertedImage } from '../lib/types';
import { Download, Maximize, X } from 'lucide-react';

interface ImagePreviewProps {
  image: ConvertedImage;
  onDownload: (image: ConvertedImage) => void;
}

export default function ImagePreview({ image, onDownload }: ImagePreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden shadow-sm bg-white h-full flex flex-col">
        <div className="relative p-2 h-48 flex items-center justify-center bg-gray-100 group">
          <img
            src={image.convertedUrl}
            alt={image.originalName}
            className="max-h-full max-w-full object-contain cursor-pointer"
            onClick={openModal}
          />
          <button
            onClick={openModal}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity opacity-0 group-hover:opacity-100"
          >
            <Maximize className="h-6 w-6 text-white" />
          </button>
        </div>
        
        <div className="p-3 border-t flex-grow">
          <h4 className="text-gray-700 font-medium text-sm truncate" title={image.originalName}>
            {image.originalName}
          </h4>
          
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              <p>Format: {image.format.toUpperCase()}</p>
              <p>Size: {(image.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        </div>
        
        <div className="px-3 py-2 bg-gray-50 border-t">
          <button
            onClick={() => onDownload(image)}
            className="w-full flex items-center justify-center text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>
      </div>

      {/* Full-size Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-screen">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            
            <div className="bg-white p-4 rounded-lg">
              <img
                src={image.convertedUrl}
                alt={image.originalName}
                className="max-h-[80vh] max-w-full mx-auto"
              />
              
              <div className="flex justify-between items-center mt-4">
                <div>
                  <h3 className="text-gray-700 font-medium">{image.originalName}</h3>
                  <p className="text-sm text-gray-500">
                    {image.format.toUpperCase()} · {(image.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    onDownload(image);
                    closeModal();
                  }}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}