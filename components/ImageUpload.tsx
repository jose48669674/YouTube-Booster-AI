import React, { useState, useCallback } from 'react';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect, previewUrl, setPreviewUrl }) => {
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(file);
    }
  }, [onFileSelect, setPreviewUrl]);
  
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const removeImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setPreviewUrl(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="relative group w-full h-64 rounded-lg overflow-hidden border-2 border-dashed border-gray-600">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={removeImage} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex justify-center w-full h-64 px-4 transition bg-gray-800 border-2 border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-500 focus:outline-none">
            <span className="flex items-center space-x-2">
                <UploadCloud className="w-8 h-8 text-gray-400" />
                <span className="font-medium text-gray-400">
                    Drop an image, or <span className="text-blue-400 underline">browse</span>
                </span>
            </span>
            <input type="file" name="file_upload" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
