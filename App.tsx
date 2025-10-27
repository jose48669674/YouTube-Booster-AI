import React, { useState, useMemo } from 'react';
import { Tab } from './types';
import Header from './components/Header';
import TabButton from './components/TabButton';
import TitleOptimizer from './features/TitleOptimizer';
import ThumbnailGenerator from './features/ThumbnailGenerator';
import ImageEditor from './features/ImageEditor';
import ImageAnalyzer from './features/ImageAnalyzer';
import VideoGenerator from './features/VideoGenerator';
import { Sparkles, Image as ImageIcon, Paintbrush, Search, Video } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.TITLE_OPTIMIZER);

  const tabs = useMemo(() => [
    { id: Tab.TITLE_OPTIMIZER, label: 'Title Optimizer', icon: <Sparkles className="w-5 h-5" /> },
    { id: Tab.THUMBNAIL_GENERATOR, label: 'Thumbnail Generator', icon: <ImageIcon className="w-5 h-5" /> },
    { id: Tab.IMAGE_EDITOR, label: 'Image Editor', icon: <Paintbrush className="w-5 h-5" /> },
    { id: Tab.IMAGE_ANALYZER, label: 'Image Analyzer', icon: <Search className="w-5 h-5" /> },
    { id: Tab.VIDEO_GENERATOR, label: 'Video Generator', icon: <Video className="w-5 h-5" /> },
  ], []);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.TITLE_OPTIMIZER:
        return <TitleOptimizer />;
      case Tab.THUMBNAIL_GENERATOR:
        return <ThumbnailGenerator />;
      case Tab.IMAGE_EDITOR:
        return <ImageEditor />;
      case Tab.IMAGE_ANALYZER:
        return <ImageAnalyzer />;
      case Tab.VIDEO_GENERATOR:
        return <VideoGenerator />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
        </div>
        <div className="py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
