import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  Building2,
  CreditCard,
  ShieldCheck,
  FileText,
  Headphones,
  LogOut,
  User, 
} from "lucide-react";
import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import MyBookings from "./MyBookings";
import OnDemandServices from "./OnDemandServices";
import VirtualOffices from "./VirtualOffices";
import Billing from "./Billing";
import KYCVerification from "./KYCVerification";
import ContractsDocuments from "./ContractsDocuments";
import Support from "./Support";
import Logout from "./Logout";
import Profile from "./Profile";


const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "My Bookings", icon: Calendar },
  { name: "On-Demand Services", icon: Wrench },
  { name: "Virtual Offices", icon: Building2 },
  { name: "Billing", icon: CreditCard },
  { name: "KYC Verification", icon: ShieldCheck },
  { name: "Contracts & Documents", icon: FileText },
  { name: "Support", icon: Headphones },
  { name: "Profile", icon: User },
  { name: "Logout", icon: LogOut },
];

export default function ClientDashboard() {
  const [showFooter, setShowFooter] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setShowFooter(window.scrollY > 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  function MainContent() {
    switch (activeIndex) {
      case 0: return <Dashboard />;
      case 1: return <MyBookings />;
      case 2: return <OnDemandServices />;
      case 3: return <VirtualOffices />;
      case 4: return <Billing />;
      case 5: return <KYCVerification />;
      case 6: return <ContractsDocuments />;
      case 7: return <Support />;
      case 8: return <Profile />; 
      case 9: return <Logout />;
      default: return <Dashboard />;
    }
  }

  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav>
            <ul>
              {menuItems.map((item, idx) => (
                <li
                  key={item.name}
                  className={`sidebar-item${activeIndex === idx ? " active" : ""}`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <item.icon className="sidebar-icon" />
                  <span className="sidebar-text">{item.name}</span>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="vertical-divider"></div>
        <main className="main-content">
          <MainContent />
        </main>
      </div>
      {showFooter && <Footer />}

      {/* ✅ Existing styles (no change) */}
      <style jsx>{`
        .dashboard-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f9f9f9;
        }
        .dashboard-layout {
          display: flex;
          flex: 1;
          margin-top: 64px;
        }
        .sidebar {
          width: 280px;
          color: #333;
          padding-top: 40px;
          margin-left: 50px;
        }
        .sidebar nav ul {
          list-style: none;
          padding: 0;
        }
        .sidebar-item {
          font-size: 1.12rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          border-radius: 6px;
          padding: 12px 15px;
        }
        .sidebar-icon {
          margin-right: 10px;
          color: #111;
        }
        .sidebar-text {
          color: #111;
        }
        .sidebar-item.active,
        .sidebar-item:hover {
          background: #efefef;
        }
        .sidebar-item.active .sidebar-icon,
        .sidebar-item.active .sidebar-text,
        .sidebar-item:hover .sidebar-icon,
        .sidebar-item:hover .sidebar-text {
          color: #ffd600;
        }
        .vertical-divider {
          width: 1px;
          background: #e0e0e0;
        }
        .main-content {
          flex: 1;
          padding: 48px 40px;
        }
        @media (max-width: 900px) {
          .sidebar {
            width: 100%;
            margin-left: 0;
          }
          .dashboard-layout {
            flex-direction: column;
          }
          .main-content {
            padding: 28px 10px;
          }
          .vertical-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
