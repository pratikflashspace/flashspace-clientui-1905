import React, { useState } from "react";
import {
  CheckCircle2,
  FileText,
  ArrowLeft,
  Upload,
  Download,
  Building2,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit3,
  ChevronRight,
  AlertCircle,
  Shield,
  Briefcase,
} from "lucide-react";

interface Partner {
  id: number;
  name: string;
  designation: string;
  citizen: string;
  signatory: boolean;
  documents: { name: string; status: "verified" | "pending" | "rejected" }[];
}

const ViewDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState("subscription");
  const [showHistory, setShowHistory] = useState(false);
  const [showReviewPanel, setShowReviewPanel] = useState(false);

  const partners: Partner[] = [
    {
      id: 1,
      name: "Anshu Prasad",
      designation: "Director",
      citizen: "Yes",
      signatory: true,
      documents: [
        { name: "PAN Card", status: "verified" },
        { name: "Aadhaar Card", status: "verified" },
      ],
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      designation: "Director",
      citizen: "Yes",
      signatory: false,
      documents: [
        { name: "PAN Card", status: "verified" },
        { name: "Aadhaar Card", status: "pending" },
      ],
    },
  ];

  // Mock booking data
  const bookingData = {
    id: "VO-2025-00142",
    type: "Virtual Office",
    status: "active",
    userName: "Anshu Prasad",
    companyName: "Talenode Analytics Consultancy Private Limited",
    phone: "+91 98992 23359",
    email: "anshuabrol@live.com",
    gstin: "07AADCT1234F1Z5",
    cin: "U78300DL2024PTC432593",
    address: "47B Pocket A11, Surya Apartments, Kalkaji Extension, New Delhi - 110019",
    workspace: {
      name: "Stirring Minds",
      address: "1st Floor, B-26, Sector 3, Noida, UP - 201301",
      city: "Delhi NCR",
    },
    plan: {
      name: "Virtual Office Premium",
      tenure: "Yearly",
      price: 18000,
      gstIncluded: true,
    },
    dates: {
      payment: "20 May, 2025",
      activation: "19 Jun, 2025",
      expiry: "19 Jun, 2026",
      daysLeft: 221,
    },
    features: ["GST Registration Address", "Mail Handling", "Business Address Proof", "NOC for Registration"],
  };

  const steps = [
    { title: "KYC Submitted", status: "completed", date: "20 May, 2025", by: "Client" },
    { title: "KYC Verified", status: "completed", date: "23 May, 2025", by: "Workspace" },
    { title: "Agreement Signed", status: "completed", date: "23 May, 2025", by: "Both Parties" },
    { title: "Subscription Active", status: "current", date: "19 Jun, 2025", by: "" },
    { title: "Renewal Due", status: "upcoming", date: "19 Jun, 2026", by: "" },
  ];

  const documents = [
    {
      id: 1,
      name: "Virtual Office NOC",
      type: "user_specific",
      status: "ready",
      lastUpdated: "23 May, 2025",
      description: "No Objection Certificate for GST/Company Registration",
    },
    {
      id: 2,
      name: "Client Agreement",
      type: "user_specific",
      status: "ready",
      lastUpdated: "23 May, 2025",
      description: "Signed agreement between client and workspace",
    },
    {
      id: 3,
      name: "Utility Bill",
      type: "user_specific",
      status: "ready",
      lastUpdated: "01 Jan, 2025",
      description: "Electricity bill for address proof",
    },
    {
      id: 4,
      name: "Rent Agreement",
      type: "user_specific",
      status: "ready",
      lastUpdated: "19 Jun, 2025",
      description: "Registered rent agreement for premises",
    },
  ];

  const subscriptionHistory = [
    { id: 1, plan: "Virtual Office Premium", start: "19 Jun, 2024", end: "19 Jun, 2025", status: "completed", amount: 18000 },
    { id: 2, plan: "Virtual Office Basic", start: "20 Jun, 2023", end: "20 Jun, 2024", status: "completed", amount: 12000 },
  ];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  const getStepIcon = (status: string, idx: number) => {
    if (status === "completed") return <CheckCircle2 className="w-5 h-5" />;
    if (status === "current") return <Clock className="w-5 h-5" />;
    return <span className="text-sm font-bold">{idx + 1}</span>;
  };

  return (
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50 "> 
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-yellow-600" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-xl md:text-2xl font-bold  text-gray-900">
                    {bookingData.workspace.name}
                  </h1>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase">
                    Active
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{bookingData.type}  {bookingData.id}</p>
                <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {bookingData.workspace.address}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Expires in</p>
                <p className="text-2xl font-bold text-yellow-500">{bookingData.dates.daysLeft} days</p>
              </div>
              <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors">
                Renew Now
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-semibold text-gray-900 mb-6">Subscription Timeline</h2>
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded"></div>
            <div className="relative flex justify-between">
              {steps.map((step, idx) => {
                const isCompleted = step.status === "completed";
                const isCurrent = step.status === "current";
                return (
                  <div key={idx} className="flex flex-col items-center relative z-10" style={{ flex: 1 }}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isCurrent
                          ? "bg-yellow-400 border-yellow-400 text-black"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {getStepIcon(step.status, idx)}
                    </div>
                    <p className="text-xs font-medium text-center mt-3 text-gray-900">{step.title}</p>
                    <p className={`text-xs text-center ${isCompleted ? "text-green-600" : isCurrent ? "text-yellow-600" : "text-gray-400"}`}>
                      {step.date}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
          <div className="flex gap-1">
            {[
              { id: "subscription", label: "Subscription", icon: Calendar },
              { id: "kyc", label: "KYC & Agreement", icon: Shield },
              { id: "documents", label: "Documents", icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowReviewPanel(false); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-yellow-400 text-black" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            {/* Client Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-yellow-500" /> Client Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{bookingData.userName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Company</p>
                      <p className="font-medium text-gray-900">{bookingData.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">CIN</p>
                      <p className="font-medium text-gray-900">{bookingData.cin}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{bookingData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{bookingData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">GSTIN</p>
                      <p className="font-medium text-gray-900">{bookingData.gstin}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-500" /> Plan Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Plan</p>
                  <p className="font-semibold text-gray-900">{bookingData.plan.name}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Tenure</p>
                  <p className="font-semibold text-gray-900">{bookingData.plan.tenure}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Amount Paid</p>
                  <p className="font-semibold text-green-600">{formatCurrency(bookingData.plan.price)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Active Since</p>
                  <p className="font-semibold text-gray-900">{bookingData.dates.activation}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-3">Plan Features:</p>
                <div className="flex flex-wrap gap-2">
                  {bookingData.features.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Subscription History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-semibold text-gray-900">Subscription History</h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-yellow-600 text-sm font-medium hover:text-yellow-700 flex items-center gap-1"
                >
                  {showHistory ? "Hide History" : "View History"} <ChevronRight className={`w-4 h-4 transition-transform ${showHistory ? "rotate-90" : ""}`} />
                </button>
              </div>
              {showHistory && (
                <div className="space-y-3">
                  {subscriptionHistory.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{sub.plan}</p>
                        <p className="text-sm text-gray-500">{sub.start} - {sub.end}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(sub.amount)}</p>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* KYC Tab */}
        {activeTab === "kyc" && (
          <div className="space-y-6">
            {!showReviewPanel ? (
              <>
                {/* KYC Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-yellow-500" /> KYC Verification
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Verified</span>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">KYC verification completed successfully</p>
                      <p className="text-sm text-green-700">Verified on 23 May, 2025 by Workspace Admin</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReviewPanel(true)}
                    className="mt-4 text-yellow-600 font-medium hover:text-yellow-700 flex items-center gap-1"
                  >
                    View KYC Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Agreement */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-yellow-500" /> Client Agreement
                  </h3>
                  <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Virtual Office Agreement</p>
                        <p className="text-sm text-gray-500">Signed on 23 May, 2025  PDF, 245 KB</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* KYC Review Panel */
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <button
                  onClick={() => setShowReviewPanel(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                  <ArrowLeft className="w-5 h-5" /> Back to KYC Overview
                </button>

                <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-xl font-bold text-gray-900 mb-6">KYC Details Review</h2>

                {/* Company Details */}
                <div className="mb-6">
                  <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { label: "Legal Name", value: bookingData.companyName },
                      { label: "CIN", value: bookingData.cin },
                      { label: "GSTIN", value: bookingData.gstin },
                      { label: "Company Type", value: "Private Limited" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="font-medium text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Directors */}
                <div>
                  <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Directors / Partners</h3>
                  <div className="space-y-3">
                    {partners.map((partner) => (
                      <div key={partner.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{partner.name}</p>
                              <p className="text-sm text-gray-500">{partner.designation}</p>
                            </div>
                          </div>
                          {partner.signatory && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Authorized Signatory</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {partner.documents.map((doc, idx) => (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                                doc.status === "verified"
                                  ? "bg-green-100 text-green-700"
                                  : doc.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              {doc.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-500" /> Available Documents
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Download the documents required for GST registration, bank account opening, and other official purposes.
              </p>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 border border-gray-200 rounded-lg hover:border-yellow-300 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.description}</p>
                          <p className="text-xs text-gray-400 mt-1">Last updated: {doc.lastUpdated}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-sm">
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 flex items-center gap-2 text-sm font-medium">
                          <Download className="w-4 h-4" /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Note */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important Note</p>
                <p>These documents are valid for GST registration, company incorporation address proof, and bank account opening. For any custom requirements, please contact support.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;
