import { MeetingRoomItem } from "@/types/services";

const MOCK_MEETING_ROOMS: MeetingRoomItem[] = [
  {
    _id: "mr-001",
    name: "CP Alt F",
    address: "Connaught Place, New Delhi",
    city: "Delhi",
    area: "Connaught Place",
    price: "₹1,000/hour",
    rating: 4.8,
    reviews: 120,
    type: "Meeting Room",
    features: ["High-Speed WiFi", "Projector", "Whiteboard", "Coffee/Tea"],
    availability: "Available Now",
    popular: true,
    image:
      "https://images.unsplash.com/photo-1517502884422-41e157d2ed22?w=800&q=80",
    coordinates: { lat: 28.6304, lng: 77.2177 },
  },
  {
    _id: "mr-002",
    name: "Okhla Alt F",
    address: "Okhla Phase III, New Delhi",
    city: "Delhi",
    area: "Okhla",
    price: "₹100/seat/hour",
    rating: 4.5,
    reviews: 85,
    type: "Meeting Room",
    features: ["Ergonomic Chairs", "WiFi", "Power Backup"],
    availability: "Available Now",
    popular: false,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    coordinates: { lat: 28.5504, lng: 77.269 },
  },
  {
    _id: "mr-003",
    name: "Namdhari Spaces",
    address: "Ranchi, Jharkhand",
    city: "Ranchi", // Note: Map might default if not handled
    area: "Main Road",
    price: "₹500/hour",
    rating: 4.2,
    reviews: 45,
    type: "Meeting Room",
    features: ["AC", "WiFi", "Parking"],
    availability: "Available Now",
    popular: false,
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    coordinates: { lat: 23.3441, lng: 85.3096 },
  },
  {
    _id: "mr-004",
    name: "Infrapro",
    address: "Sector 44, Gurgaon",
    city: "Gurgaon",
    area: "Sector 44",
    price: "₹1,000+GST/hour", // Cabin price as base
    // Note: User mentioned "Meeting cabin: 10 seater, ₹80,000+GST" which is likely monthly.
    // I'll stick to the hourly/daily standard for listing or use the lower one.
    // User said "Cabin: ₹1,000+GST".
    originalPrice: "₹1,200",
    rating: 4.7,
    reviews: 92,
    type: "Meeting Cabin",
    features: ["10 Seater", "Premium Interiors", "Concierge"],
    availability: "Available Now",
    popular: true,
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
    coordinates: { lat: 28.4595, lng: 77.0266 },
  },
  {
    _id: "mr-005",
    name: "EcoSpace",
    address: "Hebbal, HMT Layout, Bangalore",
    city: "Bangalore",
    area: "Hebbal",
    price: "₹500/hour",
    rating: 4.6,
    reviews: 150,
    type: "Meeting Room",
    features: ["Garden View", "Video Conf", "Catering"],
    availability: "Available Now",
    popular: true,
    image:
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&q=80",
    coordinates: { lat: 13.0359, lng: 77.597 },
  },
  {
    _id: "mr-006",
    name: "Aspire Coworks",
    address: "Koramangala, Bangalore",
    city: "Bangalore",
    area: "Koramangala",
    price: "₹450/hour",
    rating: 4.4,
    reviews: 78,
    type: "Conference Room",
    features: ["Projector", "Whiteboard", "High-Speed Internet"],
    availability: "Available Now",
    popular: false,
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    coordinates: { lat: 12.9352, lng: 77.6245 },
  },
  {
    _id: "mr-007",
    name: "Namdhari Spaces",
    address: "Zirakpur, Punjab",
    city: "Chandigarh", // Closest major city
    area: "Zirakpur",
    price: "₹500/hour",
    rating: 4.3,
    reviews: 30,
    type: "Meeting Room",
    features: ["Easy Access", "WiFi", "Tea/Coffee"],
    availability: "Available Now",
    popular: false,
    image:
      "https://images.unsplash.com/photo-1504384308090-c54be3855033?w=800&q=80",
    coordinates: { lat: 30.6425, lng: 76.8173 },
  },
  {
    _id: "mr-008",
    name: "We Grow Coworks",
    address: "Delhi NCR",
    city: "Delhi",
    area: "Central Delhi",
    price: "Credits Included",
    rating: 4.5,
    reviews: 55,
    type: "Meeting Room",
    features: ["Community Access", "Networking", "2 Hours/Month Free"],
    availability: "Membership Only",
    popular: false,
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    coordinates: { lat: 28.6139, lng: 77.209 },
  },
  {
    _id: "mr-009",
    name: "Senate Space",
    address: "Delhi NCR",
    city: "Delhi",
    area: "South Delhi",
    price: "₹250/hour",
    rating: 4.1,
    reviews: 40,
    type: "Meeting Room",
    features: ["6 Hours Complimentary", "WiFi", "Power Backup"],
    availability: "Available Now",
    popular: false,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    coordinates: { lat: 28.5355, lng: 77.199 },
  },
  {
    _id: "mr-010",
    name: "Workzone",
    address: "Ahmedabad, Gujarat",
    city: "Ahmedabad",
    area: "SG Highway",
    price: "₹700/hour",
    rating: 4.6,
    reviews: 110,
    type: "Meeting Room",
    features: ["Premium Interiors", "Valet Parking", "Lounge"],
    availability: "Available Now",
    popular: true,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    coordinates: { lat: 23.0225, lng: 72.5714 },
  },
  {
    _id: "mr-011",
    name: "WorkYard CWS",
    address: "Delhi NCR",
    city: "Delhi",
    area: "West Delhi",
    price: "₹200/hour",
    rating: 4.3,
    reviews: 65,
    type: "Meeting Pods",
    features: ["4-5 Seater", "Soundproof", "Privacy"],
    availability: "Available Now",
    popular: true,
    image:
      "https://images.unsplash.com/photo-1517502884422-41e157d2ed22?w=800&q=80",
    coordinates: { lat: 28.6415, lng: 77.1209 },
  },
];

import axiosInstance from "./api.service";
import { getAllVirtualOffices } from "./virtualOffice.service";
import { getAllCoworkingSpaces } from "./coworkingSpace.service";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getMeetingRoomsByCity = async (
  city: string,
): Promise<MeetingRoomItem[]> => {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 500));

  try {
    // Fetch real images from existing spaces to keep them consistent
    const [virtualOffices, coworkingSpaces] = await Promise.all([
      getAllVirtualOffices(),
      getAllCoworkingSpaces(),
    ]);

    const imageMap: Record<string, string> = {};

    // Helper to normalize names for better matching
    const normalize = (name: string) =>
      name.toLowerCase().replace(/[^a-z0-9]/g, "");

    [...virtualOffices, ...coworkingSpaces].forEach((space) => {
      if (space.image) {
        imageMap[normalize(space.name)] = space.image;
      }
    });

    // Update mock data with real images if found
    const updatedRooms = MOCK_MEETING_ROOMS.map((room) => {
      const normalizedName = normalize(room.name);
      // Try exact match or partial match
      const matchedImage =
        imageMap[normalizedName] ||
        Object.entries(imageMap).find(
          ([key]) =>
            normalizedName.includes(key) || key.includes(normalizedName),
        )?.[1];

      return matchedImage ? { ...room, image: matchedImage } : room;
    });

    if (!city) return updatedRooms;

    return updatedRooms.filter(
      (room) =>
        room.city.toLowerCase() === city.toLowerCase() ||
        room.address.toLowerCase().includes(city.toLowerCase()),
    );
  } catch (error) {
    console.error("Error fetching helper data for meeting rooms:", error);
    // Fallback to original mock data if fetch fails
    if (!city) return MOCK_MEETING_ROOMS;
    return MOCK_MEETING_ROOMS.filter(
      (room) =>
        room.city.toLowerCase() === city.toLowerCase() ||
        room.address.toLowerCase().includes(city.toLowerCase()),
    );
  }
};

// ... existing code ...
export const getAllMeetingRooms = async (): Promise<MeetingRoomItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_MEETING_ROOMS;
};

export const getMeetingRoomById = async (
  id: string,
): Promise<MeetingRoomItem | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_MEETING_ROOMS.find((r) => r._id === id);
};

export const createMeetingRoom = async (
  data: Partial<MeetingRoomItem>,
): Promise<MeetingRoomItem> => {
  try {
    const response = await axiosInstance.post("/meetingRoom/create", data);
    const responseData = response.data as ApiResponse<MeetingRoomItem>;

    if ([200, 201].includes(response.status) && responseData.success) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to create meeting room");
  } catch (error: any) {
    console.error("Error creating meeting room:", error);
    throw error;
  }
};

export const updateMeetingRoom = async (
  id: string,
  data: Partial<MeetingRoomItem>,
): Promise<MeetingRoomItem> => {
  try {
    const response = await axiosInstance.put(`/meetingRoom/update/${id}`, data);
    const responseData = response.data as ApiResponse<MeetingRoomItem>;

    if ([200, 201].includes(response.status) && responseData.success) {
      return responseData.data;
    }

    throw new Error(responseData.message || "Failed to update meeting room");
  } catch (error: any) {
    console.error("Error updating meeting room:", error);
    throw error;
  }
};
