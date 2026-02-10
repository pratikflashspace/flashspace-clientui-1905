import FeedbackNPSLayout from "@/components/SpacePartner/FeedbackNPS/FeedbackNPSLayout";
import Sidebar from "@/components/SpacePartner/sidebar/Sidebar";
import Topbar from "@/components/SpacePartner/topbar/TopBar";

const FeedbackNPSPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <Topbar />
        <div className="mt-8">
          <FeedbackNPSLayout />
        </div>
      </div>
    </div>
  );
};

export default FeedbackNPSPage;