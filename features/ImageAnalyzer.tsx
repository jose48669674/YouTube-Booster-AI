import React, { useState } from 'react';
import { analyzeImage, fileToBase64 } from '../services/geminiService';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import ImageUpload from '../components/ImageUpload';
import { Search } from 'lucide-react';

const DEFAULT_PROMPT = "Analyze this image as a potential YouTube thumbnail. What is good about it? What could be improved to increase click-through rate (CTR)? Provide specific, actionable feedback. Format your response in markdown.";

const ImageAnalyzer: React.FC = () => {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const result = await analyzeImage(prompt, base64, mimeType);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Thumbnail Analyzer</h2>
        <p className="text-gray-400 mt-1">Get AI feedback on your thumbnail to improve its performance.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
           <h3 className="text-lg font-semibold text-white">1. Upload Thumbnail</h3>
          <ImageUpload onFileSelect={setImageFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} />
        </div>
        <div className="space-y-4">
           <h3 className="text-lg font-semibold text-white">2. Analysis Goal (Optional)</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            rows={5}
          />
          <Button onClick={handleSubmit} isLoading={isLoading} disabled={!imageFile} icon={<Search className="w-5 h-5"/>}>
            Analyze Image
          </Button>
        </div>
      </div>

      {error && <p className="text-red-400 mt-4">{error}</p>}
      
      {isLoading && (
        <div className="flex flex-col justify-center items-center p-8 bg-gray-800 rounded-lg border border-gray-700 mt-8">
          <Spinner className="w-8 h-8"/>
          <span className="ml-2 mt-4 text-gray-300">Analyzing your image...</span>
        </div>
      )}

      {analysis && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold">Analysis Result:</h3>
          <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-white bg-gray-800 border border-gray-700 rounded-lg p-6">
            {analysis.split('\n').map((line, index) => {
              if (line.startsWith('* ')) {
                return <li key={index}>{line.substring(2)}</li>;
              }
              if (line.startsWith('### ')) {
                 return <h3 key={index} className="font-bold text-lg mt-4">{line.substring(4)}</h3>;
              }
               if (line.startsWith('## ')) {
                 return <h2 key={index} className="font-bold text-xl mt-4">{line.substring(3)}</h2>;
              }
              return <p key={index}>{line}</p>;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
