import React from "react";
import { GSTManagement } from "../../components/AdminDashboard/GSTManagement";

const SpacePortalGSTManagement: React.FC = () => {
  return (
    <div className="flex-1 animate-in fade-in duration-500">
      <div className="mb-7">
        <h1 className="text-3xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="text-gray-900 dark:text-white">GST</span> <span className="text-[#36503F] italic">Requests</span>
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Review GST documents for users registered at your spaces, verify their NOCs, and raise queries.
        </p>
      </div>
      
      <GSTManagement />
    </div>
  );
};

export default SpacePortalGSTManagement;
