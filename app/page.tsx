'use client';

import { useState } from 'react';
import Header from './components/Header';
import DropzoneUploader from './components/DropzoneUploader';
import ConversionOptions from './components/ConversionOptions';
import ProgressBar from './components/ProgressBar';
import ResultsDisplay from './components/ResultsDisplay';
import { FileWithPreview, ConversionOptions as ConversionOptionsType, ConvertedImage } from './lib/types';

export default function Home() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [conversionOptions, setConversionOptions] = useState<ConversionOptionsType>({
    format: 'jpeg',
    quality: 90,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isError, setIsError] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);

  const handleConversion = async () => {
    if (files.length === 0) {
      alert('Please upload at least one WebP image first.');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setIsError(false);
    setConvertedImages([]);

    try {
      // Prepare form data with files and conversion options
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('format', conversionOptions.format);
      formData.append('quality', conversionOptions.quality.toString());

      // Create a mock progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Send the request to the API
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Failed to convert images');
      }

      const data = await response.json();
      setConvertedImages(data.convertedImages);
      setProgress(100);

    } catch (error) {
      console.error('Error during conversion:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Header />
        
        <div className="mt-8 space-y-8">
          <DropzoneUploader files={files} setFiles={setFiles} />
          
          {files.length > 0 && (
            <>
              <ConversionOptions 
                options={conversionOptions} 
                setOptions={setConversionOptions} 
              />
              
              <div className="flex justify-center">
                <button
                  onClick={handleConversion}
                  disabled={isLoading}
                  className={`px-6 py-3 text-white font-medium rounded-md shadow-sm ${
                    isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Converting...' : 'Convert Images'}
                </button>
              </div>
            </>
          )}

          {isLoading && (
            <div className="mt-4">
              <ProgressBar 
                progress={progress} 
                isComplete={progress === 100} 
                isError={isError} 
              />
            </div>
          )}

          <ResultsDisplay 
            convertedImages={convertedImages} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </main>
  );
}