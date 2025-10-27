import React from 'react';
import { AlertTriangle, Key } from 'lucide-react';

interface ApiKeyModalProps {
  onSelectKey: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSelectKey }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full shadow-xl border border-blue-500/50">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">API Key Required</h2>
          <p className="text-gray-300 mb-4">
            Video generation with Veo requires you to select your own Google AI API key. This action may incur charges on your Google Cloud account.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            For more information on billing, please visit {' '}
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 hover:underline">
              ai.google.dev/gemini-api/docs/billing
            </a>.
          </p>
          <button
            onClick={onSelectKey}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
          >
            <Key className="w-5 h-5 mr-2" />
            Select API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
