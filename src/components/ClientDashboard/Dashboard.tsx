import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const lineData = [
  { month: "Jun", bookings: 3 },
  { month: "Jul", bookings: 5 },
  { month: "Aug", bookings: 4 },
  { month: "Sep", bookings: 6 },
  { month: "Oct", bookings: 7 },
  { month: "Nov", bookings: 4 },
];

const pieData = [
  { name: "Virtual Office", value: 65 },
  { name: "Coworking Space", value: 35 },
];

const COLORS = ["#f9c909", "#ffea80"];

export default function Dashboard() {
  return (
    <>
      {/* Welcome Section */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: "30px 40px",
          marginBottom: "30px",
          maxWidth: "1200px",
          margin: "0 auto 40px",
        }}
      >
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome, Customer Name 👋
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Here’s a quick summary of your account
        </p>
      </div>

      {/* Account Summary Cards */}
      <div className="summary-cards">
        {[
          { title: "Active Services", value: "2" },
          { title: "Pending Invoices", value: "₹3,200" },
          { title: "Next Booking", value: "05 Nov 2025" },
          { title: "KYC Status", value: "✅ Verified" },
        ].map((card) => (
          <div key={card.title} className="summary-card">
            <h4>{card.title}</h4>
            <p>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#f9c909"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Usage Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="updates-section">
        <h3>Recent Updates</h3>
        <ul>
          <li>🧾 Invoice #1023 generated on 31 Oct 2025</li>
          <li>📅 Booking approved for 05 Nov 2025</li>
          <li>✅ KYC Verified successfully</li>
          <li>🎁 New offer available on your plan</li>
        </ul>
      </div>

      {/* ✅ Fonts & Styling */}
      <style jsx global>{`
        /* === LOCAL FONT IMPORTS === */
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

        /* === APPLYING FONTS === */
        body {
          font-family: var(--font-body);
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: var(--font-heading);
        }

        /* === DASHBOARD STYLES === */
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
          max-width: 1200px;
          margin-inline: auto;
        }
        .summary-card {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          text-align: center;
          font-family: var(--font-body);
        }
        .summary-card h4 {
          color: #666;
          font-size: 1rem;
          margin-bottom: 8px;
          font-family: var(--font-heading);
        }
        .summary-card p {
          font-size: 1.3rem;
          font-weight: 600;
          color: #111;
        }
        .charts-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 50px;
          max-width: 1200px;
          margin-inline: auto;
        }
        .chart-card {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          font-family: var(--font-body);
        }
        .chart-card h3 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          margin-bottom: 15px;
          color: #111;
        }
        .updates-section {
          background: #fff;
          padding: 20px 30px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          max-width: 1200px;
          margin-inline: auto;
          margin-bottom: 50px;
          font-family: var(--font-body);
        }
        .updates-section h3 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          margin-bottom: 10px;
        }
        .updates-section ul {
          margin-top: 10px;
          list-style: none;
          padding: 0;
        }
        .updates-section li {
          margin-bottom: 8px;
          font-size: 1rem;
        }
        @media (max-width: 900px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
