import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  LayoutDashboard,
  Calendar,
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
import Billing from "./Billing";
import KYCVerification from "./KYCVerification";
import ContractsDocuments from "./ContractsDocuments";
import Support from "./Support";
import Logout from "./Logout";
import Profile from "./Profile";

const menuItems = [
  { name: "Profile", icon: User },
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "My Bookings", icon: Calendar },
  { name: "Billing", icon: CreditCard },
  { name: "KYC Verification", icon: ShieldCheck },
  { name: "Contracts & Documents", icon: FileText },
  { name: "Support", icon: Headphones },
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
      case 0:
        return <Profile />;
      case 1:
        return <Dashboard />;
      case 2:
        return <MyBookings />;
      case 3:
        return <Billing />;
      case 4:
        return <KYCVerification />;
      case 5:
        return <ContractsDocuments />;
      case 6:
        return <Support />;
      case 7:
        return <Logout />;
      default:
        return <Dashboard />;
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
                  className={`sidebar-item${
                    activeIndex === idx ? " active" : ""
                  }`}
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

      {/* ✅ Font setup for local Geist & Poppins */}
      <style jsx global>{`
        @font-face {
          font-family: "Poppins";
          src: url("/fonts/Poppins-Regular.ttf") format("truetype");
          font-weight: 400;
        }
        @font-face {
          font-family: "Poppins";
          src: url("/fonts/Poppins-SemiBold.ttf") format("truetype");
          font-weight: 600;
        }
        @font-face {
          font-family: "Poppins";
          src: url("/fonts/Poppins-Bold.ttf") format("truetype");
          font-weight: 700;
        }

        @font-face {
          font-family: "Geist";
          src: url("/fonts/Geist-Regular.ttf") format("truetype");
          font-weight: 400;
        }
        @font-face {
          font-family: "Geist";
          src: url("/fonts/Geist-Medium.ttf") format("truetype");
          font-weight: 500;
        }
        @font-face {
          font-family: "Geist";
          src: url("/fonts/Geist-SemiBold.ttf") format("truetype");
          font-weight: 600;
        }

        :root {
          --font-heading: "Poppins", sans-serif;
          --font-body: "Geist", sans-serif;
        }

        body {
          font-family: var(--font-body);
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        .section-title,
        .sidebar-text {
          font-family: var(--font-heading);
        }

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
