import React from 'react';
import GoogleMap from '@/components/Map/GoogleMap';

const MapExample: React.FC = () => {
  // Example locations for virtual offices
  const virtualOfficeLocations = [
    {
      position: { lat: 28.6139, lng: 77.2090 }, // Delhi
      title: 'Virtual Office - Connaught Place',
      info: `
        <div class="p-3">
          <h3 class="font-bold text-lg mb-2">FlashSpace Virtual Office</h3>
          <p class="text-sm text-gray-600 mb-2">Connaught Place, New Delhi</p>
          <p class="text-sm mb-2">Premium business address with mail handling</p>
          <p class="text-sm font-semibold text-blue-600">₹5,000/month</p>
        </div>
      `
    },
    {
      position: { lat: 28.5355, lng: 77.3910 }, // Noida
      title: 'Virtual Office - Noida Sector 62',
      info: `
        <div class="p-3">
          <h3 class="font-bold text-lg mb-2">FlashSpace Virtual Office</h3>
          <p class="text-sm text-gray-600 mb-2">Sector 62, Noida</p>
          <p class="text-sm mb-2">Modern business center with full amenities</p>
          <p class="text-sm font-semibold text-blue-600">₹4,500/month</p>
        </div>
      `
    },
    {
      position: { lat: 28.4595, lng: 77.0266 }, // Gurgaon
      title: 'Virtual Office - Cyber City Gurgaon',
      info: `
        <div class="p-3">
          <h3 class="font-bold text-lg mb-2">FlashSpace Virtual Office</h3>
          <p class="text-sm text-gray-600 mb-2">Cyber City, Gurgaon</p>
          <p class="text-sm mb-2">Premium location in IT hub</p>
          <p class="text-sm font-semibold text-blue-600">₹6,000/month</p>
        </div>
      `
    }
  ];

  const handleMapLoad = (map: google.maps.Map) => {
    // console.log('Map loaded successfully!', map);
    
    // You can add custom styling or additional functionality here
    // For example, you could add traffic layer
    // const trafficLayer = new google.maps.TrafficLayer();
    // trafficLayer.setMap(map);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Virtual Office Locations</h2>
        <p className="text-gray-600 mb-6">
          Find our virtual office locations across Delhi NCR. Click on the markers to see more details.
        </p>
      </div>

      {/* Basic Map */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Delhi NCR Virtual Offices</h3>
        <GoogleMap
          center={{ lat: 28.6139, lng: 77.2090 }}
          zoom={10}
          height="500px"
          className="border rounded-lg shadow-md"
          markers={virtualOfficeLocations}
          onMapLoad={handleMapLoad}
        />
      </div>

      {/* Compact Map for specific location */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Connaught Place Office</h3>
          <GoogleMap
            center={{ lat: 28.6139, lng: 77.2090 }}
            zoom={15}
            height="300px"
            className="border rounded-lg"
            markers={[virtualOfficeLocations[0]]}
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Gurgaon Office</h3>
          <GoogleMap
            center={{ lat: 28.4595, lng: 77.0266 }}
            zoom={15}
            height="300px"
            className="border rounded-lg"
            markers={[virtualOfficeLocations[2]]}
          />
        </div>
      </div>
    </div>
  );
};

export default MapExample;