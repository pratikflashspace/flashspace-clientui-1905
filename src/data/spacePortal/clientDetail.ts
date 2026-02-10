import type { ClientDetails } from "@/types/spacePortal/clientDetails";

export const CLIENT_DETAILS: ClientDetails[] = [
  {
    id: "CL-1001",
    companyName: "Tech Innovations Pvt Ltd",
    contactName: "Rahul Sharma",
    plan: "Virtual Office Premium",
    space: "Mumbai - BKC",
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    status: "ACTIVE",
    kycStatus: "VERIFIED",

    email: "rahul@techinnovations.com",
    phone: "+91 9876543210",

    kyc: {
      status: "VERIFIED",
      documents: [
        {
          id: "DOC-1",
          type: "PAN",
          fileUrl: "#",
          uploadedAt: "2024-01-10",
        },
        {
          id: "DOC-2",
          type: "GST",
          fileUrl: "#",
          uploadedAt: "2024-01-10",
        },
      ],
    },

    agreement: {
      status: "SIGNED",
      agreementUrl: "#",
      signedAt: "2024-01-14",
      validTill: "2025-01-15",
    },

    bookings: [
      {
        id: "BK-101",
        date: "2026-02-01",
        slot: "10:00 AM - 12:00 PM",
        status: "CONFIRMED",
        amount: 2500,
      },
      {
        id: "BK-102",
        date: "2026-02-05",
        slot: "02:00 PM - 04:00 PM",
        status: "CONFIRMED",
        amount: 1800,
      },
    ],

    invoices: [
      {
        id: "INV-1",
        invoiceNumber: "INV-2026-001",
        amount: 12000,
        status: "PAID",
        pdfUrl: "#",
        createdAt: "2026-01-10",
      },
      {
        id: "INV-2",
        invoiceNumber: "INV-2026-002",
        amount: 8000,
        status: "PENDING",
        pdfUrl: "#",
        createdAt: "2026-02-01",
      },
    ],
  },
  // ✅ ADD CL-1002
  {
    id: "CL-1002",
    companyName: "StartupXYZ Solutions",
    contactName: "Priya Patel",
    plan: "Team Space",
    space: "Delhi - CP",
    startDate: "2023-12-01",
    endDate: "2024-11-30",
    status: "ACTIVE",
    kycStatus: "VERIFIED",

    email: "priya@startupxyz.com",
    phone: "+91 9876543211",

    kyc: {
      status: "VERIFIED",
      documents: [
        {
          id: "DOC-3",
          type: "PAN",
          fileUrl: "#",
          uploadedAt: "2023-11-25",
        },
      ],
    },

    agreement: {
      status: "SIGNED",
      agreementUrl: "#",
      signedAt: "2023-11-30",
      validTill: "2024-11-30",
    },

    bookings: [
      {
        id: "BK-201",
        date: "2026-01-15",
        slot: "09:00 AM - 11:00 AM",
        status: "CONFIRMED",
        amount: 3000,
      },
    ],

    invoices: [
      {
        id: "INV-3",
        invoiceNumber: "INV-2026-003",
        amount: 15000,
        status: "PAID",
        pdfUrl: "#",
        createdAt: "2026-01-05",
      },
    ],
  },
  // ✅ ADD CL-1003
  {
    id: "CL-1003",
    companyName: "Global Consulting LLC",
    contactName: "Amit Kumar",
    plan: "Virtual Office Standard",
    space: "Bangalore - HSR",
    startDate: "2024-02-01",
    endDate: "2025-01-31",
    status: "ACTIVE",
    kycStatus: "PENDING",

    email: "amit@globalconsulting.com",
    phone: "+91 9876543212",

    kyc: {
      status: "PENDING",
      documents: [],
    },

    agreement: {
      status: "PENDING",
      agreementUrl: "#",
    },

    bookings: [],
    invoices: [],
  },
  // ✅ ADD CL-1004
  {
    id: "CL-1004",
    companyName: "Design Studio Co",
    contactName: "Neha Singh",
    plan: "Hot Desk Monthly",
    space: "Chennai - Anna Nagar",
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    status: "EXPIRING_SOON",
    kycStatus: "VERIFIED",

    email: "neha@designstudio.com",
    phone: "+91 9876543213",

    kyc: {
      status: "VERIFIED",
      documents: [
        {
          id: "DOC-4",
          type: "PAN",
          fileUrl: "#",
          uploadedAt: "2024-01-05",
        },
      ],
    },

    agreement: {
      status: "SIGNED",
      agreementUrl: "#",
      signedAt: "2024-01-09",
      validTill: "2024-02-10",
    },

    bookings: [
      {
        id: "BK-301",
        date: "2026-01-20",
        slot: "01:00 PM - 03:00 PM",
        status: "CONFIRMED",
        amount: 1500,
      },
    ],

    invoices: [
      {
        id: "INV-4",
        invoiceNumber: "INV-2026-004",
        amount: 5000,
        status: "PAID",
        pdfUrl: "#",
        createdAt: "2026-01-15",
      },
    ],
  },
];