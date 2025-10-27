import React, { useState } from 'react';
import { generateTitleSuggestions } from '../services/geminiService';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { Sparkles } from 'lucide-react';

const TitleOptimizer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsLoading(true);
    setError(null);
    setTitles([]);
    try {
      const response = await generateTitleSuggestions(topic);
      setTitles(response.split('\n').filter(title => title.trim() !== ''));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">YouTube Title Optimizer</h2>
        <p className="text-gray-400 mt-1">Enter your video topic to generate viral, click-worthy titles.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., '10-minute home workout for beginners'"
          className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          rows={3}
        />
        <Button type="submit" isLoading={isLoading} disabled={!topic.trim()} icon={<Sparkles className="w-5 h-5" />}>
          Generate Titles
        </Button>
      </form>
      
      {error && <p className="text-red-400">{error}</p>}
      
      {isLoading && !titles.length && (
          <div className="flex justify-center items-center p-8">
              <Spinner className="w-8 h-8"/>
              <span className="ml-2 text-gray-300">Generating ideas...</span>
          </div>
      )}

      {titles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Suggested Titles:</h3>
          <ul className="space-y-3">
            {titles.map((title, index) => (
              <li key={index} className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-200">
                {title.replace(/^\d+\.\s*/, '')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TitleOptimizer;
