"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileWithPreview } from "../lib/types";
import { v4 as uuidv4 } from "uuid";
import { Upload } from "lucide-react";
import FilePreview from "./FilePreview";

interface DropzoneUploaderProps {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
}

export default function DropzoneUploader({
  files,
  setFiles,
}: DropzoneUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter to only accept WebP files
      const webpFiles = acceptedFiles.filter(
        (file) => file.type === "image/webp"
      );

      if (webpFiles.length < acceptedFiles.length) {
        alert(
          "Only WebP images are supported. Non-WebP files have been filtered out."
        );
      }

      const filesWithPreview = webpFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: uuidv4(),
        })
      );

      setFiles((prev) => [...prev, ...filesWithPreview]);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/webp": [".webp"],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((file) => file.id !== id);
      return newFiles;
    });
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-12 w-12 text-gray-400" />
          <p className="text-lg font-medium text-gray-700">
            Drop WebP images here
          </p>
          <p className="text-sm text-gray-500">or click to browse your files</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg text-gray-700 font-bold">Uploaded Files</h3>
            <button
              onClick={() => setFiles([])}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <FilePreview key={file.id} file={file} onRemove={removeFile} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
