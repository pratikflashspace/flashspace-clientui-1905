import React, { useState } from "react";
import { CheckCircle, FileText, ArrowLeft, Upload } from "lucide-react";

const ViewDetails: React.FC = () => {
  const [activeTab, setActiveTab] = useState("subscription");
  const [showHistory, setShowHistory] = useState(false);
  const [showReviewPanel, setShowReviewPanel] = useState(false);

  const [partners, setPartners] = useState([
    { id: 1, name: "ANSHU PRASAD", citizen: "Yes", signatory: "Yes", idProof: "Aadhaar + PAN" },
    { id: 2, name: "JACK", citizen: "Yes", signatory: "No", idProof: "Aadhaar" },
  ]);

  const handlePartnerChange = (id: number, field: keyof typeof partners[0], value: string) => {
    setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleUpload = (id: number) => {
    // dummy upload handler — replace with real upload logic
    alert(`Upload document for Partner ID: ${id}`);
  };

  // Mock data (replace with real booking details)
  const userData = {
    userName: "ANSHU PRASAD",
    companyName: "TALENODE-ANALYTICS CONSULTANCY PRIVATE LIMITED",
    phone: "9899223359",
    email: "anshuabrol@live.com",
    address: "47B Pocket A11 Surya Apartments Kalkaji Extension, New Delhi 110019",
    workspaceName: "Stirring Minds",
    city: "Delhi",
    plan: "New Company Registration Plan",
    tenure: "Yearly",
    paymentDate: "20 May, 2025",
    activationDate: "19 Jun, 2025",
    expiryDate: "19 Jun, 2026",
    daysLeft: "221 DAYS",
  };

  const steps = [
    { title: "KYC Verification", status: "Approved", date: "23 May, 2025", by: "Ramit (WORKSPACE)" },
    { title: "Agreement Signature", status: "Approved", date: "23 May, 2025", by: "Ramit (WORKSPACE)" },
    { title: "Documents Processing", status: "Shared", date: "23 May, 2025", by: "(WORKSPACE)" },
    { title: "Active", status: "Active", date: "23 May, 2025", by: "(WORKSPACE)" },
    { title: "Expired", status: "Pending", date: "-", by: "" },
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 md:px-8 font-[Poppins] text-gray-900">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto border-b pb-5 mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{userData.userName}</h1>
            <p className="text-sm text-gray-600 mt-1">{userData.userName} Virtual Office details</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">ACTIVE</span>
            <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm font-semibold">RENEWAL</span>
          </div>
        </div>
      </div>

      {/* SUBSCRIPTION STATUS */}
      <div className="max-w-6xl mx-auto mb-12 relative">
        <h2 className="text-lg font-semibold mb-6">Subscription Status</h2>

        <div className="relative flex justify-between items-center">
          {/* black connecting line (placed behind steps, not overlapping) */}
          <div className="absolute top-[18px] left-0 w-full h-[2px] bg-black z-0 rounded" />

          {steps.map((step, idx) => {
            const isActive = ["Approved", "Active", "Shared"].includes(step.status);
            return (
              <div key={idx} className="relative z-10 flex-1 flex flex-col items-center min-w-[70px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-black ${
                    isActive ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <CheckCircle size={16} />
                </div>
                <p className="text-xs sm:text-sm font-medium mt-2 text-center">{step.title}</p>
                <p className={`text-xs ${isActive ? "text-green-600" : "text-gray-500"}`}>
                  {step.status.toUpperCase()} {step.date !== "-" && `on ${step.date}`}
                </p>
                <p className="text-xs text-gray-500">{step.by}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-6xl mx-auto border-b mb-6">
        <div className="flex gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("subscription")}
            className={`pb-3 ${activeTab === "subscription" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-700"}`}>
            Subscription Details
          </button>
          <button
            onClick={() => setActiveTab("kyc")}
            className={`pb-3 ${activeTab === "kyc" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-700"}`}>
            KYC & Agreement Details
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-3 ${activeTab === "documents" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-700"}`}>
            Documents
          </button>
        </div>
      </div>

      {/* CONTENTS */}
      <div className="max-w-6xl mx-auto">
        {/* ---------- Subscription Details (keep everything) ---------- */}
        {activeTab === "subscription" && (
          <div>
            <div className="text-sm text-gray-600 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p>The current subscription is a renewal. Please refer to the subscription history for all previous documents.</p>
              <button
                className="text-blue-600 font-semibold hover:underline"
                onClick={() => setShowHistory((s) => !s)}
              >
                View Subscription History →
              </button>
            </div>

            {/* Client Details */}
            <div className="bg-white rounded-lg border p-6 mb-8 shadow-sm overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Client Details</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="border p-2 font-semibold w-1/3">User Name</td>
                    <td className="border p-2">{userData.userName}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Company Name</td>
                    <td className="border p-2">{userData.companyName}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2 font-semibold">Phone No.</td>
                    <td className="border p-2">{userData.phone}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Email</td>
                    <td className="border p-2">{userData.email}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2 font-semibold">Shipping Address</td>
                    <td className="border p-2">{userData.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Subscription Details */}
            <div className="bg-white rounded-lg border p-6 shadow-sm overflow-x-auto mb-8">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Subscription Details</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="border p-2 font-semibold w-1/3">Workspace Name</td>
                    <td className="border p-2">{userData.workspaceName}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">City</td>
                    <td className="border p-2">{userData.city}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2 font-semibold">Plan</td>
                    <td className="border p-2">{userData.plan}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Tenure</td>
                    <td className="border p-2">{userData.tenure}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2 font-semibold">Payment Date</td>
                    <td className="border p-2">{userData.paymentDate}</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Activation Date</td>
                    <td className="border p-2">{userData.activationDate}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border p-2 font-semibold">Expiry Date</td>
                    <td className="border p-2">
                      {userData.expiryDate}{" "}
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">{userData.daysLeft}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Dummy Subscription History */}
            {showHistory && (
              <div className="bg-white rounded-lg border p-6 shadow-sm mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Subscription History (Dummy Data)</h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">S.No.</th>
                      <th className="p-2 border">Plan</th>
                      <th className="p-2 border">Start Date</th>
                      <th className="p-2 border">End Date</th>
                      <th className="p-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 text-center">1</td>
                      <td className="border p-2">Virtual Office Renewal</td>
                      <td className="border p-2">19 Jun, 2024</td>
                      <td className="border p-2">19 Jun, 2025</td>
                      <td className="border p-2 text-green-600 font-semibold">Completed</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">2</td>
                      <td className="border p-2">Company Registration Plan</td>
                      <td className="border p-2">20 Jun, 2023</td>
                      <td className="border p-2">20 Jun, 2024</td>
                      <td className="border p-2 text-green-600 font-semibold">Completed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ---------- KYC & AGREEMENT DETAILS (with Review) ---------- */}
        {activeTab === "kyc" && (
          <>
            {!showReviewPanel ? (
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">KYC Details</h3>
                <p className="text-sm text-gray-600 mb-4">Verification and approval status for your company’s KYC documents.</p>

                <table className="w-full text-sm border mb-6">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">S.No.</th>
                      <th className="p-2 border">Verification Details</th>
                      <th className="p-2 border">Received On</th>
                      <th className="p-2 border">Approval Status</th>
                      <th className="p-2 border">Approved/Rejected On</th>
                      <th className="p-2 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 text-center">1</td>
                      <td className="border p-2">Company & Director Details</td>
                      <td className="border p-2">23 May, 2025</td>
                      <td className="border p-2 text-green-600 font-semibold">Approved</td>
                      <td className="border p-2">23 May, 2025</td>
                      <td className="border p-2 text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => setShowReviewPanel(true)}>Review</td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-lg font-semibold mt-8 mb-3">Renewal Client Agreement</h3>
                <table className="w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">S.No.</th>
                      <th className="p-2 border">Document</th>
                      <th className="p-2 border">Received On</th>
                      <th className="p-2 border">Approval Status</th>
                      <th className="p-2 border">Approved/Rejected On</th>
                      <th className="p-2 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 text-center">1</td>
                      <td className="border p-2">Client Agreement</td>
                      <td className="border p-2">20 May, 2025</td>
                      <td className="border p-2 text-green-600 font-semibold">Approved</td>
                      <td className="border p-2">23 May, 2025</td>
                      <td className="border p-2 text-blue-600 font-semibold cursor-pointer hover:underline">View Agreement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              /* REVIEW PANEL */
              <div className="bg-white rounded-lg border p-6 shadow-sm">
                <button onClick={() => setShowReviewPanel(false)} className="flex items-center gap-2 text-blue-600 mb-6 hover:underline">
                  <ArrowLeft size={18} /> Back
                </button>

                <h2 className="text-xl font-semibold mb-4">Review KYC details for {userData.companyName}</h2>

                {/* Company Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Company Details</h3>
                  <table className="w-full text-sm border">
                    <tbody>
                      <tr>
                        <td className="border p-2 font-semibold w-1/3">Legal Company Name</td>
                        <td className="border p-2">{userData.companyName}</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-semibold">Company CIN</td>
                        <td className="border p-2">U78300DL2024PTC432593</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-semibold">Firm Type</td>
                        <td className="border p-2">INDIAN COMPANY</td>
                      </tr>
                      <tr>
                        <td className="border p-2 font-semibold">Company Incorporated</td>
                        <td className="border p-2">Yes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Company Documents */}
                <div className="mb-8 overflow-x-auto">
                  <h3 className="text-lg font-semibold mb-3">Company Documents</h3>
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">S.No.</th>
                        <th className="p-2 border">Document Name</th>
                        <th className="p-2 border">Document</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-gray-400">📂 No data available</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Directors / Partners — viewable with text buttons for View & Upload */}
<div className="overflow-x-auto">
  <h3 className="text-lg font-semibold mb-3">Directors / Partners</h3>
  <table className="w-full text-sm border">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-2 border">S.No.</th>
        <th className="p-2 border">Partner</th>
        <th className="p-2 border">Indian Citizen</th>
        <th className="p-2 border">Signatory</th>
        <th className="p-2 border">Identity Proof</th>
        <th className="p-2 border">View Doc</th>
        <th className="p-2 border">Upload Doc</th>
      </tr>
    </thead>
    <tbody>
      {partners.map((p, i) => (
        <tr key={p.id}>
          <td className="border p-2 text-center">{i + 1}.</td>
          <td className="border p-2">{p.name}</td>
          <td className="border p-2 text-center">{p.citizen}</td>
          <td className="border p-2 text-center">{p.signatory}</td>
          <td className="border p-2">{p.idProof}</td>
          <td className="border p-2 text-center">
            <button
              onClick={() => alert(`Viewing document for ${p.name}`)}
              className="text-blue-600 hover:underline font-medium"
            >
              View Doc
            </button>
          </td>
          <td className="border p-2 text-center">
            <button
              onClick={() => alert(`Upload document for ${p.name}`)}
              className="text-blue-600 hover:underline font-medium"
            >
              Upload Doc
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Edit Details link (plain text) */}
  <div className="flex justify-end mt-3">
    <button
      onClick={() => alert("Edit Partner Details (coming soon)")}
      className="text-blue-600 hover:underline font-medium"
    >
      Edit Details
    </button>
  </div>
</div>

              </div>
            )}
          </>
        )}

       {/* DOCUMENTS SECTION */}
{activeTab === "documents" && (
  <div className="bg-white rounded-lg border p-6 shadow-sm text-sm">
    <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
      Documents to be shared with the client
      <span className="text-gray-500 text-base cursor-pointer">ℹ️</span>
    </h3>

    <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-left w-[60px]">S.No.</th>
            <th className="p-2 border text-left">Document Name</th>
            <th className="p-2 border text-left">Document Type</th>
            <th className="p-2 border text-left">Document Status</th>
            <th className="p-2 border text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Row 1 */}
          <tr>
            <td className="border p-2 text-center">1.</td>
            <td className="border p-2">Coworking Client NOC</td>
            <td className="border p-2">User specific</td>
            <td className="border p-2">
              <button className="text-blue-600 font-semibold hover:underline">
                View
              </button>
            </td>
            <td className="border p-2">
              <div>
                <button className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                  <span>✏️</span> Update Document
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated using client details. Re-upload in case of any error.
                </p>
              </div>
            </td>
          </tr>

          {/* Row 2 */}
          <tr>
            <td className="border p-2 text-center">2.</td>
            <td className="border p-2">Coworking Client Agreement</td>
            <td className="border p-2">User specific</td>
            <td className="border p-2">
              <div>
                <button className="text-blue-600 font-semibold hover:underline">
                  View
                </button>
                <p className="text-xs text-gray-500 mt-1">Last Updated: 23 May 2025</p>
              </div>
            </td>
            <td className="border p-2">
              <div>
                <button className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                  <span>✏️</span> Update Document
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Agreement signed by you & the client.
                </p>
              </div>
            </td>
          </tr>

          {/* Row 3 */}
          <tr>
            <td className="border p-2 text-center">3.</td>
            <td className="border p-2">Company Registration Guide</td>
            <td className="border p-2">Common for all</td>
            <td className="border p-2">
              <button className="text-blue-600 font-semibold hover:underline">
                View
              </button>
            </td>
            <td className="border p-2">
              <div>
                <p className="text-gray-600 font-medium">No action required</p>
                <p className="text-xs text-gray-500 mt-1">
                  Monthly updated through workspaces settings.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* FOOTER NOTES */}
    <div className="mt-6 space-y-2 text-sm">
      <div className="flex items-start gap-2">
        <span className="text-gray-600">ℹ️</span>
        <p className="text-gray-700">
          Documents have been shared with the client. The virtual office subscription is active.
        </p>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-gray-600">ℹ️</span>
        <p className="text-gray-700">
          The current subscription is a renewal. Please refer to the subscription history for all previous documents.
        </p>
      </div>
    </div>

    {/* SUBSCRIPTION HISTORY LINK */}
    <div className="flex justify-end mt-4">
      <button
        onClick={() => alert("Opening Subscription History (dummy)")}
        className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
      >
        View Subscription History →
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default ViewDetails;
