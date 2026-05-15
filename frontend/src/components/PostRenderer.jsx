import React from 'react';
import { useSearchParams } from 'react-router-dom';
import FacebookPostGenerator from './FacebookPostGenerator';

/**
 * PostRenderer Component
 * Specifically designed for automated Puppeteer screenshots.
 * Accepts title, script, and imageUrl via URL Search Params.
 */
const PostRenderer = () => {
  const [searchParams] = useSearchParams();
  
  const title = searchParams.get('title') || "Neural Times Exclusive";
  const script = searchParams.get('script') || "No content provided for this archive asset.";
  const imageUrl = searchParams.get('imageUrl') || "";

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F0F0F0] flex items-center justify-center">
      {/* 
        We use FacebookPostGenerator in puppeteerMode.
        This removes all sidebar controls, back buttons, and navigation,
        leaving only the 1080x1080 newspaper canvas centered on a gray background.
      */}
      <FacebookPostGenerator 
        isOpen={true} 
        onClose={() => {}} 
        title={title} 
        script={script} 
        imageUrl={imageUrl} 
        viewOnly={true}
        puppeteerMode={true}
      />
      
      {/* 
         Force the scale for Puppeteer to ensure we capture the full 1080px.
         We override the responsive CSS variables.
      */}
      <style>{`
        :root { 
          --asset-scale: 1 !important; 
        }
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PostRenderer;
