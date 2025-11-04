export default function KYCVerification() {
  return (
    <section
      className="kyc-section"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 0",
      }}
    >
      <div
        className="kyc-card"
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          padding: "40px",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "#222",
            marginBottom: "20px",
            textAlign: "center",
            borderBottom: "3px solid #f9c909",
            paddingBottom: "10px",
          }}
        >
          KYC Verification
        </h1>
        <div
          className="kyc-info"
          style={{
            backgroundColor: "#fff8d6",
            padding: "16px 20px",
            borderRadius: "10px",
            color: "#333",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            marginBottom: "30px",
            borderLeft: "4px solid #f9c909",
          }}
        >
          Completing your KYC is a <b>Mandatory Step</b>. Please verify
          your details online to save time when you arrive.
          <br />
          <span style={{ color: "red" }}>
            FlashSpace reserves the right to not provide service or issue
            refunds until KYC completion.
          </span>
          <br />
          <br />
          <b>Please Note:</b> This is a one-time verification process. By
          clicking <b>Save</b>, you agree to FlashSpace’s Terms of
          Service.
        </div>
        {/* KYC FORM */}
        <form
          className="kyc-form"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <label>
            Full Name
            <input type="text" required placeholder="Enter your full name"
              style={{width:"100%",padding:"10px",border:"1px solid #ddd",borderRadius:"8px",marginTop:"5px"}} />
          </label>
          <label>
            Phone Number
            <input type="text" required placeholder="Enter your phone number"
              style={{width:"100%",padding:"10px",border:"1px solid #ddd",borderRadius:"8px",marginTop:"5px"}} />
          </label>
          <label style={{ gridColumn: "1 / 3" }}>
            Company Name
            <input type="text" required placeholder="Enter your company name"
              style={{width:"100%",padding:"10px",border:"1px solid #ddd",borderRadius:"8px",marginTop:"5px"}} />
          </label>
          <label>
            Industry
            <input type="text" placeholder="Enter your industry type"
              style={{width:"100%",padding:"10px",border:"1px solid #ddd",borderRadius:"8px",marginTop:"5px"}} />
          </label>
          <label>
            Designation
            <input type="text" placeholder="Enter your job title or position"
              style={{width:"100%",padding:"10px",border:"1px solid #ddd",borderRadius:"8px",marginTop:"5px"}} />
          </label>
          <label>
            No. of Employees
            <input type="number" min="1" placeholder="Enter total employees"
              style={{width:"100%",padding:"10px",border:"1px solid #ddd",borderRadius:"8px",marginTop:"5px"}} />
          </label>
          <label>
            GSTIN
            <input type="text" placeholder="Enter your GST number"
              style={{width:"100%",padding:"10px",border:"1px solid #ddd",borderRadius:"8px",marginTop:"5px"}} />
          </label>
          <label>
            Gender
            <select
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginTop: "5px",
                color: "#333",
              }}
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Date of Birth
            <input type="date" required 
              style={{width:"100%",padding:"10px",border:"1px solid #ddd",borderRadius:"8px",marginTop:"5px"}} />
          </label>
          <div
            style={{
              gridColumn: "1 / 3",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input type="checkbox" />
            <label>
              Can FlashSpace use WhatsApp as a mode of communication?
            </label>
          </div>
          <div
            style={{
              gridColumn: "1 / 3",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              style={{
                backgroundColor: "#f9c909",
                color: "#000",
                border: "none",
                padding: "12px 40px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
                transition: "0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.opacity = "0.9")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.opacity = "1")
              }
            >
              Save & Complete KYC
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
