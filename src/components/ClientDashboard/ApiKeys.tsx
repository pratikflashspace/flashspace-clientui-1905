import React from "react";
import UserAIIntegrations from "@/components/profile/UserAIIntegrations";

export default function ApiKeys() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <UserAIIntegrations />
        </div>
      </div>
    </div>
  );
}
