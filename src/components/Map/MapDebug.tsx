import React, { useEffect, useState } from 'react';

const MapDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const logs: string[] = [];
    
    // Check environment variable
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    logs.push(`API Key: ${apiKey ? 'Present (length: ' + apiKey.length + ')' : 'Missing'}`);
    
    // Check if google is available
    logs.push(`Google object: ${typeof google !== 'undefined' ? 'Available' : 'Not available'}`);
    
    // Check if google.maps is available
    if (typeof google !== 'undefined' && google.maps) {
      logs.push('Google Maps API: Loaded');
    } else {
      logs.push('Google Maps API: Not loaded');
    }
    
    // Check environment mode
    logs.push(`Environment Mode: ${import.meta.env.MODE}`);
    logs.push(`DEV Mode: ${import.meta.env.DEV}`);
    
    setDebugInfo(logs);
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg border">
      <h3 className="font-bold text-lg mb-3">Google Maps Debug Info</h3>
      <div className="space-y-2">
        {debugInfo.map((info, index) => (
          <div key={index} className="text-sm">
            <span className="font-mono bg-white px-2 py-1 rounded">{info}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            console.log('All environment variables:', import.meta.env);
            console.log('Google Maps API Key:', import.meta.env.VITE_GOOGLE_API_KEY);
          }}
        >
          Log Environment Variables
        </button>
      </div>
    </div>
  );
};

export default MapDebug;