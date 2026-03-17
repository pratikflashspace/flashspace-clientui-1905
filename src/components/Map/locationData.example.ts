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

// Correct Google Maps coordinates for major Indian cities:
// To verify: Go to Google Maps, search for the city, right-click on the center point
export const cityCenters = {
  ahmedabad: { lat: 23.0225, lng: 72.5714 },    // Ahmedabad, Gujarat
  bangalore: { lat: 12.9716, lng: 77.5946 },    // Bengaluru, Karnataka
  bengaluru: { lat: 12.9716, lng: 77.5946 },    // Alias for Bangalore
  chennai: { lat: 13.0827, lng: 80.2707 },      // Chennai, Tamil Nadu
  delhi: { lat: 28.6139, lng: 77.2090 },        // New Delhi
  dharamshala: { lat: 32.2190, lng: 76.3234 },  // Dharamshala, Himachal Pradesh
  gurgaon: { lat: 28.4595, lng: 77.0266 },      // Gurugram, Haryana
  gurugram: { lat: 28.4595, lng: 77.0266 },     // Alias for Gurgaon
  gururgram: { lat: 28.4595, lng: 77.0266 },    // Typo Alias
  gurugarm: { lat: 28.4595, lng: 77.0266 },     // Typo Alias
  gurgao: { lat: 28.4595, lng: 77.0266 },       // Typo Alias
  hyderabad: { lat: 17.3850, lng: 78.4867 },    // Hyderabad, Telangana
  jaipur: { lat: 26.9124, lng: 75.7873 },       // Jaipur, Rajasthan
  jammu: { lat: 32.7266, lng: 74.8570 },        // Jammu, J&K
  mumbai: { lat: 19.0760, lng: 72.8777 },       // Mumbai, Maharashtra
  pune: { lat: 18.5204, lng: 73.8567 },         // Pune, Maharashtra
  kolkata: { lat: 22.5726, lng: 88.3639 },      // Kolkata, West Bengal
  lucknow: { lat: 26.8467, lng: 80.9462 },      // Lucknow, Uttar Pradesh
  surat: { lat: 21.1702, lng: 72.8311 },        // Surat, Gujarat
  noida: { lat: 28.5355, lng: 77.3910 },        // Noida, Uttar Pradesh
  chandigarh: { lat: 30.7333, lng: 76.7794 },   // Chandigarh
  indore: { lat: 22.7196, lng: 75.8577 },       // Indore, Madhya Pradesh
  kochi: { lat: 9.9312, lng: 76.2673 },         // Kochi, Kerala
  coimbatore: { lat: 11.0168, lng: 76.9558 },    // Coimbatore, Tamil Nadu
};
