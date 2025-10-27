import React, { useState } from 'react';
import { editImage, fileToBase64 } from '../services/geminiService';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ImageUpload from '../components/ImageUpload';
import { Paintbrush } from 'lucide-react';

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileSelect = (file: File | null) => {
    setOriginalFile(file);
    setEditedImageUrl(null); // Clear previous edit on new image
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !originalFile) return;
    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);
    try {
      const { base64, mimeType } = await fileToBase64(originalFile);
      const editedBase64 = await editImage(prompt, base64, mimeType);
      setEditedImageUrl(`data:${mimeType};base64,${editedBase64}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Image Editor</h2>
        <p className="text-gray-400 mt-1">Upload an image and describe the changes you want to make.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">1. Upload Image</h3>
          <ImageUpload onFileSelect={handleFileSelect} previewUrl={originalImageUrl} setPreviewUrl={setOriginalImageUrl} />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold text-white">2. Describe Your Edits</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Add a retro filter' or 'Remove the person in the background'"
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            rows={3}
            disabled={!originalFile}
          />
          <Button type="submit" isLoading={isLoading} disabled={!prompt.trim() || !originalFile} icon={<Paintbrush className="w-5 h-5"/>}>
            Apply Edits
          </Button>
        </form>
      </div>

      {error && <p className="text-red-400 mt-4">{error}</p>}
      
      {isLoading && (
        <div className="flex flex-col justify-center items-center p-8 bg-gray-800 rounded-lg border border-gray-700 mt-8">
          <Spinner className="w-8 h-8"/>
          <span className="ml-2 mt-4 text-gray-300">Applying AI magic...</span>
        </div>
      )}

      {editedImageUrl && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Result:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-center text-gray-300 mb-2">Original</h4>
                <img src={originalImageUrl!} alt="Original" className="w-full rounded-lg border border-gray-700" />
              </div>
              <div>
                <h4 className="text-center text-gray-300 mb-2">Edited</h4>
                <img src={editedImageUrl} alt="Edited" className="w-full rounded-lg border border-blue-500" />
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
