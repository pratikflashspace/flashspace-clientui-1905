import FeedbackNPSLayout from "@/components/SpacePartner/FeedbackNPS/FeedbackNPSLayout";
import Sidebar from "@/components/SpacePartner/sidebar/Sidebar";
import TopBar from "@/components/SpacePartner/topbar/Topbar";

const FeedbackNPSPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <TopBar title="Feedback" subtitle="Monitor client satisfaction" />
        <div className="mt-8">
          <FeedbackNPSLayout />
        </div>
      </div>
    </div>
  );
};

export default FeedbackNPSPage;