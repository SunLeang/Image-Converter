'use client';

import React from 'react';
import type { ConversionOptions } from '../lib/types';

interface ConversionOptionsProps {
  options: ConversionOptions;
  setOptions: React.Dispatch<React.SetStateAction<ConversionOptions>>;
}

export default function ConversionOptions({
  options,
  setOptions,
}: ConversionOptionsProps) {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <h3 className="text-lg text-black font-bold mb-4">Conversion Options</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Output Format
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                checked={options.format === 'jpeg'}
                onChange={() => setOptions({ ...options, format: 'jpeg' })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">JPEG</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="format"
                checked={options.format === 'png'}
                onChange={() => setOptions({ ...options, format: 'png' })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">PNG</span>
            </label>
          </div>
        </div>

        {options.format === 'jpeg' && (
          <div>
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                JPEG Quality: {options.quality}%
              </label>
              <span className="text-sm text-gray-500">
                {options.quality < 80 ? 'Lower Quality / Smaller Size' : 'Higher Quality / Larger Size'}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={options.quality}
              onChange={(e) =>
                setOptions({
                  ...options,
                  quality: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}