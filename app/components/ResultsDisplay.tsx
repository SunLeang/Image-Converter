'use client';

import React from 'react';
import { ConvertedImage } from '../lib/types';
import { Archive } from 'lucide-react';
import JSZip from 'jszip';
import ImagePreview from './ImagePreview';

interface ResultsDisplayProps {
  convertedImages: ConvertedImage[];
  isLoading: boolean;
}

export default function ResultsDisplay({
  convertedImages,
  isLoading,
}: ResultsDisplayProps) {
  if (isLoading) {
    return null;
  }

  if (convertedImages.length === 0) {
    return null;
  }

  const handleDownloadSingle = (image: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = image.convertedUrl;
    link.download = `${image.originalName.replace('.webp', '')}.${image.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    
    // Add each image to the zip
    await Promise.all(
      convertedImages.map(async (image) => {
        const response = await fetch(image.convertedUrl);
        const blob = await response.blob();
        const fileName = `${image.originalName.replace('.webp', '')}.${image.format}`;
        zip.file(fileName, blob);
      })
    );
    
    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Download the zip file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'converted_images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-black font-medium">Converted Images</h3>
        {convertedImages.length > 1 && (
          <button
            onClick={handleDownloadAll}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Archive className="h-4 w-4 mr-2" />
            Download All (ZIP)
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {convertedImages.map((image) => (
          <ImagePreview 
            key={image.id} 
            image={image} 
            onDownload={handleDownloadSingle} 
          />
        ))}
      </div>
    </div>
  );
}