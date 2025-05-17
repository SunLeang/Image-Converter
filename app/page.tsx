"use client";

import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ArrowRight, RefreshCw } from "lucide-react";
import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";
import {
  FileWithPreview,
  ConvertedImage,
  ConversionFormat,
  ConversionOptions,
} from "./lib/types";
import DropzoneUploader from "./components/DropzoneUploader";
import ResultsDisplay from "./components/ResultsDisplay";
import ConversionOptionsComponent from "./components/ConversionOptions";

export default function Home() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [converting, setConverting] = useState(false);

  const [conversionOptions, setConversionOptions] = useState<ConversionOptions>(
    {
      format: "jpeg",
      quality: 90,
    }
  );

  const [conversionProgress, setConversionProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isError, setIsError] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      // Also clean up converted image URLs
      convertedImages.forEach((image) =>
        URL.revokeObjectURL(image.convertedUrl)
      );
    };
  }, [files, convertedImages]);

  // Simulate the conversion process with progress
  const handleConversion = () => {
    setConverting(true);
    setConversionProgress(0);
    setIsComplete(false);
    setIsError(false);
    setShowResults(false);

    // Simulate progress updates
    const interval = setInterval(() => {
      setConversionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    // Simulate conversion completion
    setTimeout(() => {
      clearInterval(interval);
      setConversionProgress(100);
      setConverting(false);
      setIsComplete(true);

      // Create mock converted images
      const mockConvertedImages = files.map((file) => ({
        id: uuidv4(),
        originalName: file.name.replace(
          ".webp",
          `.${conversionOptions.format}`
        ),
        convertedUrl: file.preview,
        format: conversionOptions.format,
        size: file.size * 0.8,
      }));

      setConvertedImages(mockConvertedImages);
      setShowResults(true);
    }, 3000);
  };

  const handleDownload = (image: ConvertedImage) => {
    alert(`Downloading ${image.originalName}`);
  };

  const resetConversion = () => {
    setShowResults(false);
    setIsComplete(false);
    setFiles([]);
    setConvertedImages([]);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <Header />

      {!showResults && (
        <div className="mt-10">
          <DropzoneUploader files={files} setFiles={setFiles} />

          {files.length > 0 && (
            <>
              <div className="mt-8">
                <ConversionOptionsComponent
                  options={conversionOptions}
                  setOptions={setConversionOptions}
                />
              </div>

              {converting && (
                <div className="my-8 max-w-md mx-auto">
                  <ProgressBar
                    progress={conversionProgress}
                    isComplete={isComplete}
                    isError={isError}
                  />
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleConversion}
                  disabled={converting}
                  className={`flex items-center px-6 py-3 rounded-lg text-white font-medium shadow-sm
                    ${
                      converting
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {converting ? (
                    <span>Converting...</span>
                  ) : (
                    <>
                      <span>
                        Convert to {conversionOptions.format.toUpperCase()}
                      </span>
                      {conversionOptions.format === "jpeg" && (
                        <span className="ml-1 text-xs opacity-80">
                          ({conversionOptions.quality}%)
                        </span>
                      )}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {showResults && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Results</h2>
            <button
              onClick={resetConversion}
              className="flex items-center px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Convert More Images
            </button>
          </div>

          <ResultsDisplay convertedImages={convertedImages} isLoading={false} />
        </div>
      )}
    </main>
  );
}
