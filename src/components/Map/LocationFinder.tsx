import React, { useState } from 'react';
import SimpleGoogleMap from '@/components/Map/SimpleGoogleMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Star, Navigation, Clock, CheckCircle } from 'lucide-react';

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  price: string;
  rating: number;
  amenities: string[];
  phone?: string;
  email?: string;
}

const LocationFinder: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<OfficeLocation | null>(null);

  // Sample virtual office locations
  const locations: OfficeLocation[] = [
    {
      id: '1',
      name: 'FlashSpace Connaught Place',
      address: 'Block A, Connaught Place, New Delhi - 110001',
      city: 'Delhi',
      coordinates: { lat: 28.6329, lng: 77.2197 },
      price: '₹5,000/month',
      rating: 4.8,
      amenities: ['Mail Handling', 'Phone Answering', 'Meeting Rooms', 'Business Address'],
      phone: '+91 98765 43210',
      email: 'connaught@flashspace.com'
    },
    {
      id: '2',
      name: 'FlashSpace Sector 62',
      address: 'Tower B, Sector 62, Noida - 201301',
      city: 'Noida',
      coordinates: { lat: 28.6270, lng: 77.3742 },
      price: '₹4,500/month',
      rating: 4.6,
      amenities: ['Mail Handling', 'Phone Answering', 'Reception Services', 'Business Address'],
      phone: '+91 98765 43211',
      email: 'noida@flashspace.com'
    },
    {
      id: '3',
      name: 'FlashSpace Cyber City',
      address: 'DLF Cyber City, Gurgaon - 122002',
      city: 'Gurgaon',
      coordinates: { lat: 28.4954, lng: 77.0889 },
      price: '₹6,000/month',
      rating: 4.9,
      amenities: ['Mail Handling', 'Phone Answering', 'Meeting Rooms', 'Business Address', 'Coworking Access'],
      phone: '+91 98765 43212',
      email: 'gurgaon@flashspace.com'
    }
  ];

  const markers = locations.map(location => ({
    position: location.coordinates,
    title: location.name,
    info: `
      <div class="p-4 max-w-sm">
        <h3 class="font-bold text-lg mb-2">${location.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${location.address}</p>
        <div class="flex items-center mb-2">
          <span class="text-yellow-500 mr-1">★</span>
          <span class="text-sm">${location.rating}</span>
        </div>
        <p class="text-sm font-semibold text-blue-600 mb-2">${location.price}</p>
        <button 
          onclick="window.selectLocation('${location.id}')" 
          class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          View Details
        </button>
      </div>
    `
  }));

  // Global function to handle marker clicks
  React.useEffect(() => {
    (window as any).selectLocation = (locationId: string) => {
      const location = locations.find(loc => loc.id === locationId);
      if (location) {
        setSelectedLocation(location);
      }
    };

    return () => {
      delete (window as any).selectLocation;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold mb-2">Find Virtual Office Locations</h2>
        <p className="text-gray-600">
          Explore our premium virtual office locations across Delhi NCR. Click on markers for detailed information.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 relative">
          {/* Map Controls Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{locations.length} Locations</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Navigation className="w-4 h-4" />
              <span>Delhi NCR</span>
            </div>
          </div>

          <SimpleGoogleMap
            center={{ lat: 28.6139, lng: 77.2090 }}
            zoom={11}
            height="600px"
            className="rounded-xl shadow-2xl border border-gray-200"
            markers={markers}
          />
        </div>

        {/* Location Details / List */}
        <div className="space-y-4">
          {selectedLocation ? (
            <Card className="sticky top-4 shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-lg">{selectedLocation.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedLocation(null)}
                    className="hover:bg-white/50"
                  >
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                    {selectedLocation.address}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-lg font-semibold">{selectedLocation.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">/5</span>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {selectedLocation.price}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Amenities Included
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedLocation.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm bg-green-50 px-3 py-2 rounded-md">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>

                {(selectedLocation.phone || selectedLocation.email) && (
                  <div className="border-t pt-4 space-y-2">
                    {selectedLocation.phone && (
                      <a 
                        href={`tel:${selectedLocation.phone}`}
                        className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span>{selectedLocation.phone}</span>
                      </a>
                    )}
                    {selectedLocation.email && (
                      <a 
                        href={`mailto:${selectedLocation.email}`}
                        className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>{selectedLocation.email}</span>
                      </a>
                    )}
                  </div>
                )}

                <div className="space-y-2 pt-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                    Book Virtual Office
                  </Button>
                  <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50">
                    Schedule Tour
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-1">Available Locations</h3>
                <p className="text-sm text-gray-600">Click on any location to view details</p>
              </div>
              
              <div className="max-h-[550px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {locations.map((location) => (
                  <Card 
                    key={location.id} 
                    className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-0 shadow-md"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-base mb-1">{location.name}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {location.city}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{location.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-gray-500">{location.amenities.length} amenities</span>
                        <span className="font-bold text-blue-600">{location.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationFinder;