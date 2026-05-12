import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    label: "Legal",
    title: "Legal Compliance & Digital Record",
    body: [
      "This document is an electronic record under the Information Technology Act, 2000 and its applicable rules. Being computer-generated, it does not require physical or digital signatures. It is published in compliance with Rule 3 (1) of the IT (Intermediaries Guidelines) Rules, 2011.",
      'The domain www.flashspace.ai ("Website") is owned by Stirring Minds Private Limited, incorporated under the Companies Act, 1956, with its head office at Kundan Mansion, 2-A/3, Asaf Ali Rd, Turkman Gate, Chandni Chowk, New Delhi, Delhi, 110002.',
    ],
  },
  {
    label: "Agreement",
    title: "Agreement & Acceptance",
    body: [
      "By using this Website, you enter into a binding contract with FlashSpace. Your usage is governed by these Terms of Use and all incorporated policies.",
      '"You" or "User": Any person or entity using the platform.',
      '"We", "Us", or "Our": FlashSpace Realtech Private Limited.',
      "We reserve the right to modify these terms at any time without prior notice. It is your responsibility to check for updates; continued use signifies your acceptance of any changes.",
    ],
  },
  {
    label: "Disclaimers",
    title: "Disclaimers & Warranties",
    body: [
      "Accuracy: While we strive for correctness, FlashSpace does not guarantee the absolute accuracy or completeness of the information provided on the site. Use of this information is at your own risk.",
      'As-Is Basis: The Website is provided on an "As-Is" and "Where-Is" basis. FlashSpace disclaims all warranties, express or implied, including merchantability or fitness for a particular purpose.',
      "Liability: FlashSpace, its officers, and agents are not liable for any damages (direct, indirect, or consequential) arising from your use or inability to use the site.",
    ],
  },
  {
    label: "Copyright",
    title: "Intellectual Property (Copyright)",
    body: [
      "All content, including text, graphics, and sound, is protected by copyright and intellectual property laws owned by or licensed to FlashSpace.",
      "You May: Display and print materials for personal, non-commercial use only.",
      "You May Not: Copy, distribute, modify, broadcast, or use any material for commercial gain without express written consent. You must not remove any trademark or copyright notices from printed materials.",
    ],
  },
  {
    label: "Usage",
    title: "General Usage Terms",
    body: [
      "Monitoring & Conduct: We reserve the right to monitor site activity and report any illegal conduct to law enforcement. You are solely responsible for actions taken under your username/password.",
      "Indemnity: You agree to indemnify FlashSpace against any losses or expenses resulting from your violation of these terms or third-party rights.",
      "Termination: We may terminate your access at any time without notice, especially if these terms are breached.",
      "Privacy: Personal details are handled strictly according to our Privacy Policy.",
    ],
  },
  {
    label: "Workspace",
    title: "Workspace Rights & Responsibilities",
    body: [
      "Usage Rights: Your rights are limited to the privileges expressly granted in your agreement; you hold no proprietary interest in the physical property.",
      "Non-Transferable: Usage rights are personal and cannot be assigned or transferred to third parties.",
      "Damage & Maintenance: You must keep the workspace clean and sanitary. You are liable to reimburse the Operator/Landlord for any damages beyond normal wear and tear.",
      "Personal Property: FlashSpace/the Operator is not responsible for loss of your personal property unless caused by our direct negligence.",
    ],
  },
  {
    label: "Payments",
    title: "Payments & Fees",
    body: [
      "Security Deposits: Some listings may require a security deposit. FlashSpace acts as a collection agent to pre-authorize or collect these amounts on behalf of the workspace partner.",
      "Service Fees: FlashSpace charges a non-refundable Service Fee for using the platform, calculated on the final bill amount.",
      "Processing: Payouts are remitted to partners via bank transfer or other selected methods. Foreign currency processing costs may apply.",
    ],
  },
  {
    label: "Refunds",
    title: "Cancellations & Refunds",
    body: [
      "User Cancellation: You may cancel up to 6 hours prior to the reservation for a full refund. Cancellations made less than 6 hours before the booking are non-refundable.",
      "Operator Cancellation: If a workspace partner cancels, FlashSpace will refund the total fee (typically within 10 business days) and assist in finding an alternative.",
      "Penalties: Operators who cancel confirmed bookings may face penalties, including automated negative reviews or cancellation fees.",
    ],
  },
  {
    label: "Law",
    title: "Governing Law",
    body: [
      "These terms are governed by the Laws of India. Any disputes arising from these terms or site usage shall be subject to the exclusive jurisdiction of the courts in Gurugram, Haryana, India.",
    ],
  },
];

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#17221b]">
      <Header loginBlack forceWhiteBackground />
      <main className="pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#EDB003]">
              FlashSpace Legal
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#35503F] sm:text-5xl">
              Terms and Conditions
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              Our Terms and Conditions provide transparency, protect your rights, ensure mutual trust, and promote a secure, professional experience.
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <section
                key={section.title}
                className="rounded-3xl border border-gray-100 bg-gray-50/70 p-6 shadow-sm sm:p-8"
              >
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-bold text-[#35503F]">
                    {section.title}
                  </h2>
                  <span className="w-fit rounded-full bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#35503F]/60">
                    {String(index + 1).padStart(2, "0")} {section.label}
                  </span>
                </div>
                <div className="space-y-4 text-[15px] leading-7 text-gray-600">
                  {section.body.map((item) => {
                    const [prefix, ...rest] = item.split(": ");
                    const hasPrefix = rest.length > 0 && prefix.length < 32;

                    return (
                      <p key={item} className="text-gray-600">
                        {hasPrefix ? (
                          <>
                            <strong className="text-gray-900">{prefix}:</strong>{" "}
                            {rest.join(": ")}
                          </>
                        ) : (
                          item
                        )}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-8 rounded-3xl bg-[#35503F] px-6 py-8 text-center text-white sm:px-10">
            <p className="text-sm font-medium text-white/70">Questions or Complaints?</p>
            <a
              href="mailto:support@flashspace.co"
              className="mt-2 inline-block text-lg font-bold text-[#EDB003] hover:underline"
            >
              support@flashspace.co
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;
