import { useState, useEffect, useCallback } from 'react';
import { generateVideo, getVideosOperation } from '../services/geminiService';
import type { Operation, VideoGenerationResponse } from '../types';

const POLLING_INTERVAL = 5000; // 5 seconds

const PROGRESS_MESSAGES = [
    "Warming up the digital director...",
    "Storyboarding your idea...",
    "Rendering initial frames...",
    "Enhancing video quality...",
    "Adding final touches...",
    "Almost there...",
];

export const useVeo = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState('');
    const [isKeyRequired, setIsKeyRequired] = useState(false);
    
    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setIsKeyRequired(!hasKey);
            }
        };
        checkKey();
    }, []);

    const handleSelectKey = useCallback(async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            setIsKeyRequired(false); // Optimistically assume key is selected
        }
    }, []);

    const pollOperation = useCallback(async (operation: Operation, messageIndex: number) => {
        setProgressMessage(PROGRESS_MESSAGES[messageIndex % PROGRESS_MESSAGES.length]);

        try {
            const updatedOp = await getVideosOperation(operation);
            
            if (updatedOp.done) {
                if (updatedOp.error) {
                    throw new Error(updatedOp.error.message);
                }
                const downloadLink = updatedOp.response?.generatedVideos?.[0]?.video?.uri;
                if (downloadLink) {
                    setProgressMessage("Fetching your video...");
                    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    setVideoUrl(url);
                } else {
                    throw new Error("Video generation completed, but no video URL was found.");
                }
                setIsGenerating(false);
            } else {
                setTimeout(() => pollOperation(updatedOp, messageIndex + 1), POLLING_INTERVAL);
            }
        } catch (e: any) {
            console.error("Polling error:", e);
            setError(`An error occurred during polling: ${e.message}`);
            setIsGenerating(false);
             if (e.message.includes("Requested entity was not found")) {
                setError("Your API key is invalid or not found. Please select a valid API key.");
                setIsKeyRequired(true);
            }
        }
    }, []);

    const startVideoGeneration = useCallback(async (prompt: string, aspectRatio: '16:9' | '9:16', image?: { imageBytes: string, mimeType: string }) => {
        setIsGenerating(true);
        setVideoUrl(null);
        setError(null);
        setProgressMessage(PROGRESS_MESSAGES[0]);

        try {
            const initialOperation = await generateVideo(prompt, aspectRatio, image);
            pollOperation(initialOperation, 1);
        } catch (e: any) {
            console.error("Generation error:", e);
            setError(`Failed to start video generation: ${e.message}`);
            setIsGenerating(false);
             if (e.message.includes("Requested entity was not found")) {
                setError("Your API key is invalid or not found. Please select a valid API key.");
                setIsKeyRequired(true);
            }
        }
    }, [pollOperation]);
    
    return { isGenerating, videoUrl, error, progressMessage, isKeyRequired, startVideoGeneration, handleSelectKey };
};
