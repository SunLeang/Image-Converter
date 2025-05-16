"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { Upload, ArrowRight, RefreshCw } from "lucide-react";
import Header from "./components/Header";
import FilePreview from "./components/FilePreview";
import ProgressBar from "./components/ProgressBar";
import ImagePreview from "./components/ImagePreview";
import { FileWithPreview, ConvertedImage, ConversionFormat } from "./lib/types";

export default function Home() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [converting, setConverting] = useState(false);
  const [outputFormat, setOutputFormat] = useState<ConversionFormat>("jpeg");

  // New states for UI testing
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      return Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: uuidv4(),
      });
    }) as FileWithPreview[];

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/webp": [],
    },
  });

  const removeFile = (id: string) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((file) => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prevFiles.filter((file) => file.id !== id);
    });
  };

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
        originalName: file.name.replace(".webp", `.${outputFormat}`),
        convertedUrl: file.preview,
        format: outputFormat,
        size: file.size * 0.8, // Simulate smaller file size after conversion
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
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">
              {isDragActive
                ? "Drop the WebP images here..."
                : "Drag & drop your WebP images here, or click to select files"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Only .webp files are supported
            </p>
          </div>

          {files.length > 0 && (
            <>
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    Selected Files ({files.length})
                  </h3>
                  <div>
                    <label className="text-sm text-gray-600 mr-2">
                      Convert to:
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) =>
                        setOutputFormat(e.target.value as ConversionFormat)
                      }
                      className="px-3 py-1 border rounded-md text-sm"
                    >
                      <option value="jpeg">JPEG</option>
                      <option value="png">PNG</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <FilePreview
                      key={file.id}
                      file={file}
                      onRemove={removeFile}
                    />
                  ))}
                </div>
              </div>

              {/* Progress bar appears during conversion */}
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
                      <span>Convert to {outputFormat.toUpperCase()}</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Show conversion results */}
      {showResults && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Converted Images</h2>
            <button
              onClick={resetConversion}
              className="flex items-center px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Convert More Images
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {convertedImages.map((image) => (
              <ImagePreview
                key={image.id}
                image={image}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
