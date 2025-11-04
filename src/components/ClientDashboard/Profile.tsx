import React, { useState } from "react";
import { Mail, Phone, ShieldCheck, User } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [contactInfo, setContactInfo] = useState({
    email: "support@gmail.in",
    phone: "+91 98765 43210",
    contactPerson: "Username",
  });

  const handleChange = (field: string, value: string) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("✅ Contact information updated successfully!");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div
      className="business-profile"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <h2
        className="section-title"
        style={{
          fontFamily: "var(--font-heading)",
        }}
      >
        Business <span style={{ color: "#FFD600" }}>Profile</span>
      </h2>

      <div className="profile-card">
        {/* Top Header */}
        <div className="profile-header">
          <div className="header-info">
            <h3 style={{ fontFamily: "var(--font-heading)" }}>
              Vibe Coders Pvt. Ltd.
            </h3>
            <p>Client ID: VC-10432</p>
            <span className="status-badge active">
              <ShieldCheck size={16} /> Verified Client
            </span>
          </div>
          <div className="avatar-circle">
            <label htmlFor="profile-upload" className="upload-label">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <span className="upload-text">Upload</span>
              )}
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Company Information */}
        <div className="profile-section">
          <h4 style={{ fontFamily: "var(--font-heading)" }}>
            Company Information
          </h4>
          <div className="info-grid">
            <div>
              <span>Company Name</span>
              <p>Vibe Coders Pvt. Ltd.</p>
            </div>
            <div>
              <span>Business Type</span>
              <p>Technology & AI Solutions</p>
            </div>
            <div>
              <span>Registered Address</span>
              <p>DLF Cyber City, Gurugram, India</p>
            </div>
            <div>
              <span>Registration Date</span>
              <p>January 2024</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="profile-section">
          <h4 style={{ fontFamily: "var(--font-heading)" }}>
            Contact Information
          </h4>
          {!isEditing ? (
            <div className="info-grid contact-info">
              <div className="contact-item">
                <Mail size={16} /> <span>{contactInfo.email}</span>
              </div>
              <div className="contact-item">
                <Phone size={16} /> <span>{contactInfo.phone}</span>
              </div>
              <div className="contact-item">
                <User size={16} />{" "}
                <span>Contact Person: {contactInfo.contactPerson}</span>
              </div>
            </div>
          ) : (
            <div className="info-grid contact-info edit-mode">
              <div className="contact-item">
                <Mail size={16} />
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <input
                  type="text"
                  value={contactInfo.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="contact-item">
                <User size={16} />
                <input
                  type="text"
                  value={contactInfo.contactPerson}
                  onChange={(e) =>
                    handleChange("contactPerson", e.target.value)
                  }
                  placeholder="Enter contact person"
                />
              </div>
            </div>
          )}
        </div>

        {/* Subscription / Plan Info */}
        <div className="profile-section">
          <h4 style={{ fontFamily: "var(--font-heading)" }}>
            Subscription Details
          </h4>
          <div className="info-grid">
            <div>
              <span>Plan Type</span>
              <p>Premium Business Plan</p>
            </div>
            <div>
              <span>Active Services</span>
              <p>Virtual Office, On-Demand Services</p>
            </div>
            <div>
              <span>Renewal Date</span>
              <p>March 2026</p>
            </div>
            <div>
              <span>Account Manager</span>
              <p>Rahul Singh (Business Consultant)</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        {!isEditing ? (
          <button
            className="update-btn"
            style={{ fontFamily: "var(--font-heading)" }}
            onClick={() => setIsEditing(true)}
          >
            Update Business Info
          </button>
        ) : (
          <div className="btn-group">
            <button
              className="save-btn"
              onClick={handleSave}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Save Changes
            </button>
            <button
              className="cancel-btn"
              onClick={() => setIsEditing(false)}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ✅ Font setup and component styles */}
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
      `}</style>

      <style jsx>{`
        .business-profile {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #111;
          text-align: center;
          margin-bottom: 28px;
        }

        .profile-card {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          padding-bottom: 16px;
        }

        .avatar-circle {
          background: #fff7cc;
          border-radius: 50%;
          width: 90px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffd600;
          flex-shrink: 0;
          cursor: pointer;
          overflow: hidden;
        }

        .upload-label {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .upload-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #333;
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .header-info h3 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 600;
        }

        .header-info p {
          color: #555;
          margin: 4px 0;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: 8px;
          padding: 4px 10px;
          color: #2c7a1f;
          background: #e8ffe3;
        }

        .profile-section h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #222;
          border-left: 4px solid #ffd600;
          padding-left: 8px;
          margin-bottom: 14px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px 24px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          color: #222;
        }

        .contact-item input {
          flex: 1;
          padding: 6px 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 0.9rem;
          font-family: var(--font-body);
        }

        .update-btn,
        .save-btn,
        .cancel-btn {
          border: none;
          border-radius: 10px;
          padding: 12px 28px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .update-btn {
          align-self: center;
          background: #ffd600;
        }

        .update-btn:hover {
          background: #f5c400;
        }

        .btn-group {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .save-btn {
          background: #2c7a1f;
          color: #fff;
        }

        .cancel-btn {
          background: #ddd;
          color: #333;
        }

        @media (max-width: 700px) {
          .business-profile {
            padding: 24px;
          }
          .profile-header {
            flex-direction: column-reverse;
            align-items: center;
            text-align: center;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
