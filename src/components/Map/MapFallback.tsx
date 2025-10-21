import React from 'react';
import { MapPin } from 'lucide-react';

interface MapFallbackProps {
  height?: string;
  className?: string;
  locations?: Array<{
    name: string;
    address: string;
    price: string;
  }>;
}

const MapFallback: React.FC<MapFallbackProps> = ({ 
  height = '400px', 
  className = '',
  locations = [] 
}) => {
  return (
    <div 
      className={`bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center ${className}`}
      style={{ height }}
    >
      <div className="text-center p-8">
        <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map Loading...</h3>
        <p className="text-gray-600 mb-6">
          Google Maps is being initialized. If this continues, check your API key configuration.
        </p>
        
        {locations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Available Locations:</h4>
            {locations.map((location, index) => (
              <div key={index} className="bg-white rounded-lg p-3 text-left shadow-sm">
                <h5 className="font-semibold text-gray-800">{location.name}</h5>
                <p className="text-sm text-gray-600">{location.address}</p>
                <p className="text-sm font-medium text-blue-600">{location.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapFallback;