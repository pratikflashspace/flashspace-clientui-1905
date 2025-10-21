// Sample Location Data for Virtual Offices
// Copy this to LocationFinder.tsx and customize with your real data

export const virtualOfficeLocations = [
  {
    id: '1',
    name: 'FlashSpace Connaught Place',
    address: 'Block A, Connaught Place, New Delhi - 110001',
    city: 'Delhi',
    coordinates: { lat: 28.6329, lng: 77.2197 },
    price: '₹5,000/month',
    rating: 4.8,
    amenities: [
      'Professional Business Address',
      'Mail Handling & Forwarding',
      'Phone Answering Service',
      'Meeting Room Access',
      'Reception Services',
      'High-Speed Internet'
    ],
    phone: '+91 98765 43210',
    email: 'connaught@flashspace.com',
    description: 'Premium virtual office in the heart of Delhi\'s business district.',
    availability: 'Immediate',
    officeHours: '9 AM - 6 PM'
  },
  {
    id: '2',
    name: 'FlashSpace Sector 62 Noida',
    address: 'Tower B, Sector 62, Noida - 201301',
    city: 'Noida',
    coordinates: { lat: 28.6270, lng: 77.3742 },
    price: '₹4,500/month',
    rating: 4.6,
    amenities: [
      'Professional Business Address',
      'Mail Handling & Forwarding',
      'Phone Answering Service',
      'Reception Services',
      'Coworking Space Access',
      'Parking Available'
    ],
    phone: '+91 98765 43211',
    email: 'noida@flashspace.com',
    description: 'Modern virtual office facility in Noida\'s tech hub.',
    availability: 'Immediate',
    officeHours: '9 AM - 7 PM'
  },
  {
    id: '3',
    name: 'FlashSpace Cyber City Gurgaon',
    address: 'DLF Cyber City, Gurgaon - 122002',
    city: 'Gurgaon',
    coordinates: { lat: 28.4954, lng: 77.0889 },
    price: '₹6,000/month',
    rating: 4.9,
    amenities: [
      'Premium Business Address',
      'Mail Handling & Forwarding',
      'Dedicated Phone Number',
      'Meeting Room Access',
      'Coworking Space Access',
      'Conference Room',
      'Parking Available',
      'Cafeteria Access'
    ],
    phone: '+91 98765 43212',
    email: 'gurgaon@flashspace.com',
    description: 'Premium virtual office in Gurgaon\'s corporate hub.',
    availability: 'Immediate',
    officeHours: '8 AM - 8 PM'
  },
  // Add more locations as needed
];

// How to get coordinates for your locations:
// 1. Go to https://www.google.com/maps
// 2. Search for your address
// 3. Right-click on the location marker
// 4. Click on the coordinates to copy them
// 5. Format: { lat: LATITUDE, lng: LONGITUDE }

// Example coordinates for major Indian cities:
export const cityCenters = {
  delhi: { lat: 28.6139, lng: 77.2090 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
};
