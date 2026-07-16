import React from "react";
import { GSTManagement } from "../../components/AdminDashboard/GSTManagement";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";

const AdminGSTManagement: React.FC = () => {
  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          GST <span className="text-primary italic">Management</span>
        </h1>
        <p className="text-[#6B7280] mt-2">
          Review user applications, verify documents, and raise queries.
        </p>
      </div>
      
      <GSTManagement />
    </DashboardLayout>
  );
};

export default AdminGSTManagement;
