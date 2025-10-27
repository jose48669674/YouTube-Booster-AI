import React, { useState } from 'react';
import { useVeo } from '../hooks/useVeo';
import { fileToBase64 } from '../services/geminiService';
import Button from '../components/Button';
import ImageUpload from '../components/ImageUpload';
import Spinner from '../components/Spinner';
import ApiKeyModal from '../components/ApiKeyModal';
import { Video } from 'lucide-react';

type AspectRatio = '16:9' | '9:16';

const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const { isGenerating, videoUrl, error, progressMessage, isKeyRequired, startVideoGeneration, handleSelectKey } = useVeo();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        
        let imagePayload;
        if (imageFile) {
            const { base64, mimeType } = await fileToBase64(imageFile);
            imagePayload = { imageBytes: base64, mimeType };
        }
        
        startVideoGeneration(prompt, aspectRatio, imagePayload);
    };

    return (
        <div className="space-y-8">
            {isKeyRequired && <ApiKeyModal onSelectKey={handleSelectKey} />}
            <div>
                <h2 className="text-2xl font-bold text-white">AI Video Generator (Veo)</h2>
                <p className="text-gray-400 mt-1">Create short, engaging videos from a text prompt and an optional starting image.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="prompt" className="text-lg font-semibold text-white">1. Video Prompt</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'A neon hologram of a cat driving a sports car at top speed'"
                        className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-lg font-semibold text-white">2. Starting Image (Optional)</label>
                    <ImageUpload onFileSelect={setImageFile} previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} />
                </div>

                <div className="space-y-2">
                    <label className="text-lg font-semibold text-white">3. Aspect Ratio</label>
                    <div className="flex space-x-4">
                        {(['16:9', '9:16'] as AspectRatio[]).map(ratio => (
                            <button
                                key={ratio}
                                type="button"
                                onClick={() => setAspectRatio(ratio)}
                                className={`px-4 py-2 rounded-lg border-2 transition-colors ${aspectRatio === ratio ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-600 hover:border-blue-500'}`}
                            >
                                {ratio} {ratio === '16:9' ? '(Landscape)' : '(Portrait)'}
                            </button>
                        ))}
                    </div>
                </div>

                <Button type="submit" isLoading={isGenerating} disabled={!prompt.trim()} icon={<Video className="w-5 h-5"/>}>
                    Generate Video
                </Button>
            </form>

            {error && <p className="text-red-400">{error}</p>}
            
            {isGenerating && (
                <div className="flex flex-col justify-center items-center p-8 bg-gray-800 rounded-lg border border-gray-700">
                    <Spinner className="w-8 h-8"/>
                    <p className="mt-4 text-gray-300">{progressMessage}</p>
                    <p className="mt-2 text-sm text-gray-500">Video generation can take a few minutes. Please be patient.</p>
                </div>
            )}

            {videoUrl && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Your video is ready!</h3>
                    <div className="w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                        <video src={videoUrl} controls autoPlay loop className="w-full h-full" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoGenerator;
