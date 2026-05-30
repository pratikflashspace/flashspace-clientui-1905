import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#35503F] tracking-tight">
              Refund & <span className="italic">Cancellation Policy</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
              At FlashSpace, we prioritize building a partnership based on transparency and trust.
              Our refund policy is designed to be fair and clear, ensuring you feel confident at every stage of your virtual office journey.
            </p>
          </div>

          {/* Core Commitments */}
          <section className="bg-gray-50 rounded-[32px] p-8 sm:p-12 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#35503F] mb-8">
              Core Commitments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900">Success-Linked Refunds</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  If your application is rejected 3 or more times due to documentation or premises provided by us,
                  you are eligible for a 100% refund.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900">Efficient Processing</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  All requests are handled within 7-10 business days with consistent status updates.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900">Expert Oversight</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We provide proactive cross-verification and compliance support (including bank and biometric coordination)
                  to maximize your chances of approval.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900">No Hidden Costs</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We only apply reasonable administrative fees when clearly justified. No surprise deductions.
                </p>
              </div>
            </div>
          </section>

          {/* Refund Categories */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-[#35503F]">
              Refund Categories & Eligibility
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6 space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Full Refund Scenarios</h3>
                <p className="text-gray-600 leading-relaxed">
                  <strong>Documentation Failure:</strong> 100% refund if GST or Business Registration is rejected 3+ times
                  specifically due to virtual office documents provided by FlashSpace.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-6 space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Partial Refund Scenarios (Administrative Deductions)</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                  <li><strong>Internal KYC Disapproval:</strong> If FlashSpace rejects your KYC during our evaluation: Full refund minus Rs. 5,000 + GST.</li>
                  <li><strong>Space Partner Rejection:</strong> If our space partner rejects your KYC after FlashSpace has approved it: Full refund minus Rs. 2,000 + GST.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Modifications */}
          <section className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#35503F] mb-6">
              Modifications & Re-issuances
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm font-bold text-gray-900 mb-1">Business Name Changes</p>
                <p className="text-xs text-gray-500">(e.g., MCA rejection) New NOC/Agreement issuance: Rs. 1,500 + GST.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm font-bold text-gray-900 mb-1">Post-Approval Edits</p>
                <p className="text-xs text-gray-500">Changes to client name, address, or typos: Rs. 1,500 + GST (after evaluation).</p>
              </div>
            </div>
          </section>

          {/* Policy Exclusions */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-red-600">
              Policy Exclusions
            </h2>
            <p className="text-gray-600">Refunds will not be issued for:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { title: "Applicant Failures", desc: "Deficiencies in your KYC, non-compliance with GST laws, or APOB documentation issues on your end." },
                { title: "Regulatory Factors", desc: "Independent government decisions, system backlogs, or sudden changes in law." },
                { title: "Restricted Entities", desc: "Online gaming/betting, companies with restricted origins (Pakistan, China, etc.), or shell companies." },
                { title: "Time Lapses", desc: "Failure to submit KYC within 90 days of payment, or requests made after service commencement." },
                { title: "Verification Issues", desc: "Rejections caused by non-compliance with mandatory Aadhaar-linked mobile OTP verification." }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How to Request */}
          <section className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-[#35503F]">
              How to Request a Refund
            </h2>
            <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-3xl p-8 sm:px-12">
              <p className="text-gray-700 mb-4">Email <strong>support@flashspace.ai</strong> with the subject:</p>
              <p className="text-xl font-bold text-[#35503F] mb-6">"Refund Request - [Your Business Name]"</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Include Booking ID, Payment Date, and Reason with Evidence.</p>
                <p>Acknowledgment within 24 hours. Evaluation in 7-10 business days.</p>
              </div>
            </div>
          </section>

          {/* Final Section */}
          <section className="border-t border-gray-100 pt-12 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Service Philosophy</p>
            <p className="text-sm text-gray-500 max-w-3xl mx-auto leading-relaxed">
              We act as an aggregator, providing expert documentation and postbox services.
              Final approval is at the sole discretion of government authorities.
              FlashSpace reserves the right to update this policy. All changes are effective immediately.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
