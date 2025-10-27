import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { Image as ImageIcon } from 'lucide-react';

const ThumbnailGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const base64Image = await generateImage(prompt);
      setImageUrl(`data:image/png;base64,${base64Image}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Thumbnail Generator</h2>
        <p className="text-gray-400 mt-1">Describe the perfect thumbnail and let AI create it for you.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'A shocked gamer reacting to a video game explosion, bright colors, surprised face.'"
          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          rows={3}
        />
        <Button type="submit" isLoading={isLoading} disabled={!prompt.trim()} icon={<ImageIcon className="w-5 h-5"/>}>
          Generate Thumbnail
        </Button>
      </form>

      {error && <p className="text-red-400">{error}</p>}
      
      {isLoading && (
        <div className="flex flex-col justify-center items-center p-8 bg-gray-800 rounded-lg border border-gray-700">
          <Spinner className="w-8 h-8"/>
          <span className="ml-2 mt-4 text-gray-300">Generating your thumbnail... this may take a moment.</span>
        </div>
      )}

      {imageUrl && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Generated Thumbnail:</h3>
          <div className="w-full aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <img src={imageUrl} alt="Generated thumbnail" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailGenerator;
