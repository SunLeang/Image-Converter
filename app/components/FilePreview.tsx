'use client';

import React from 'react';
import { FileWithPreview } from '../lib/types';
import { X, FileImage } from 'lucide-react';

interface FilePreviewProps {
  file: FileWithPreview;
  onRemove: (id: string) => void;
}

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  return (
    <div className="relative group border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="h-40 flex items-center justify-center bg-gray-100 p-2">
        {file.type === 'image/webp' ? (
          <img 
            src={file.preview} 
            alt={file.name} 
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FileImage className="h-12 w-12" />
            <p className="text-sm mt-2">Not a WebP image</p>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t">
        <h4 className="text-gray-700 font-medium text-sm truncate" title={file.name}>
          {file.name}
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          {(file.size / 1024).toFixed(1)} KB
        </p>
        
        <button
          onClick={() => onRemove(file.id)}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}