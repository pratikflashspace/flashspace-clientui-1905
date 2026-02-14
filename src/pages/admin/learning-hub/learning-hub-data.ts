import {
    BookOpen,
    HelpCircle,
    Users,
    ShieldAlert,
    MonitorPlay,
    Sparkles,
    CheckCircle,
    XCircle,
    Lightbulb,
    FileText,
    Shield,
    DollarSign,
    Zap,
    Building2,
    Phone
} from 'lucide-react';
import React from 'react';

// --- SALES HUB DATA ---

export const SALES_ARTICLES = [
    {
        id: '1',
        title: 'Virtual Office Explained',
        category: 'Virtual Office',
        color: 'bg-blue-500',
        content: null // Content will be handled in the component for now as it contains JSX
    },
    {
        id: '2',
        title: 'Coworking Space Tiers',
        category: 'Coworking',
        color: 'bg-cyan-500',
        content: null
    },
    {
        id: '3',
        title: 'Meeting Room Booking Process',
        category: 'Meeting Rooms',
        color: 'bg-emerald-500',
        content: null
    },
    {
        id: '4',
        title: 'Business Registration Support',
        category: 'Services',
        color: 'bg-purple-500',
        content: null
    },
    {
        id: '5',
        title: 'GST Registration Support',
        category: 'Compliance',
        color: 'bg-orange-500',
        content: null
    },
];

export const SALES_OBJECTIONS = [
    {
        id: 'o1',
        title: 'The price is too high',
        insight: 'They are unsure about the value, not the number.',
        response: 'I understand. If we break it down, it’s less than a cup of coffee per day — and it includes a registered address, compliance documents, and ongoing support.',
        tactics: ['Break cost into daily value', 'Compare with traditional office rent', 'Highlight zero setup and lock-in'],
        followup: 'Is this mainly for GST registration or just address proof?'
    },
    {
        id: 'o2',
        title: 'I’ll check competitors first',
        insight: 'They are comparing risk, not just price.',
        response: 'That’s completely fair. While comparing, do check whether they provide proper documents, verification support, and lock-in terms.',
        tactics: ['Never badmouth competitors', 'Focus on flexibility', 'Emphasize documentation quality'],
        followup: 'What are the top two things you’re comparing?'
    },
    {
        id: 'o3',
        title: 'I don’t need this right now',
        insight: 'They are postponing compliance.',
        response: 'Most clients reach out when deadlines are close. Starting early avoids last-minute stress and rejections.',
        tactics: ['Mention upcoming GST or MCA deadlines', 'Share common delay consequences', 'Encourage early setup']
    },
    {
        id: 'o4',
        title: 'Is this even legal?',
        insight: 'They fear compliance risk.',
        response: 'Yes, all our locations are commercially approved and used by hundreds of registered businesses.',
        tactics: ['Reassure legal validity', 'Mention GST & bank acceptance', 'Offer to share sample documents']
    },
    {
        id: 'o5',
        title: 'Banks won’t accept this address',
        insight: 'They’ve heard mixed feedback.',
        response: 'Most major banks accept it. Final approval depends on the bank’s internal verification, but we provide all required documents.',
        tactics: ['Avoid guarantees', 'Highlight documentation support', 'Mention successful client cases']
    },
    {
        id: 'o6',
        title: 'I’m a small business / freelancer',
        insight: 'They feel this is too formal or expensive.',
        response: 'That’s exactly who this is designed for — so you don’t spend on unnecessary office rent.',
        tactics: ['Position as cost-saving', 'Highlight flexibility', 'Emphasize professional image']
    },
    {
        id: 'o7',
        title: 'I just want the cheapest option',
        insight: 'They want low risk.',
        response: 'Cheapest options often lack compliance support and charge later. This ensures everything is correct from day one.',
        tactics: ['Explain hidden cost risks', 'Emphasize peace of mind', 'Compare long-term impact']
    },
    {
        id: 'o8',
        title: 'I heard virtual offices get rejected for GST',
        insight: 'They fear rejection.',
        response: 'Rejections usually happen due to incomplete documents. We provide verified locations and full documentation support.',
        tactics: ['Shift focus to documentation', 'Explain verification readiness', 'Avoid guaranteeing approval']
    },
    {
        id: 'o9',
        title: 'What if GST officers visit?',
        insight: 'They’re worried about physical verification.',
        response: 'Our locations are prepared for verification visits and backed with proper documents.',
        tactics: ['Reassure process readiness', 'Mention prior verifications', 'Stay factual']
    },
    {
        id: 'o10',
        title: 'I’ll think about it',
        insight: 'They need a reason to act.',
        response: 'That’s completely fine. Would it help if I share plan details or document samples so you can decide confidently?',
        tactics: ['Don’t push aggressively', 'Offer helpful material', 'Set a follow-up timeline']
    },
    {
        id: 'o11',
        title: 'Do you guarantee approval?',
        insight: 'They want certainty.',
        response: 'Approval is handled by government authorities. We ensure all documentation and address compliance is in place.',
        tactics: ['Be honest', 'Build trust', 'Focus on preparation']
    },
    {
        id: 'o12',
        title: 'I want everything in writing',
        insight: 'They want security.',
        response: 'Absolutely. All terms, documents, and invoices are shared formally via email.',
        tactics: ['Highlight transparency', 'Reinforce professionalism', 'Reduce anxiety']
    }
];

export const SALES_ISSUES = [
    {
        id: 'ISSUE-1',
        title: 'Booking Payment Failed',
        what: 'Client attemped payment but received an error.',
        reasons: ['Bank declined transaction', 'UPI timeout', 'International transactions disabled', 'Gateway outage'],
        fix: 'Ask client to try a different card or UPI. Confirm international transactions are enabled. Retry after 5–10 mins.',
        escalate: 'Tech Support',
        bad: '“It’s a system problem” or “Try later” without guidance',
        highFreq: true
    },
    {
        id: 'ISSUE-2',
        title: 'Client Not Receiving Emails',
        what: 'Client did not receive welcome email or documents.',
        reasons: ['Landed in spam/junk', 'Incorrect email entered', 'Provider blocking system emails'],
        fix: 'Ask client to check spam/junk. Verify email spelling in dashboard. Resend from admin panel.',
        escalate: 'Admin / Tech Team',
        highFreq: true
    },
    {
        id: 'ISSUE-3',
        title: 'KYC Status Showing Pending',
        what: 'Client completed KYC, but status hasn’t changed.',
        reasons: ['Documents under review', 'Missing or unclear documents', 'Admin verification pending'],
        fix: 'Inform client review takes 24–48 hours. Verify documents are uploaded and clear.',
        escalate: 'Admin (KYC Team)',
        condition: 'if delayed beyond SLA'
    },
    {
        id: 'ISSUE-4',
        title: 'KYC Rejected',
        what: 'Client’s KYC documents were rejected.',
        reasons: ['Blurred/unclear documents', 'Mismatch in details', 'Expired or invalid documents'],
        fix: 'Explain rejection reason clearly. Request re-upload of correct documents in proper format.',
        escalate: 'Admin',
        condition: 'only if rejection reason is unclear'
    },
    {
        id: 'ISSUE-5',
        title: 'GST Registration Not Approved',
        what: 'Client’s GST application was rejected.',
        reasons: ['Incomplete documents', 'Address verification issue', 'Mismatch in details'],
        fix: 'Review documents with client. Ensure correct address usage. Suggest reapplication.',
        escalate: 'Admin / Compliance Team',
        note: 'GST approval is handled by government authorities.'
    },
    {
        id: 'ISSUE-6',
        title: 'Client Says Address Is Invalid',
        what: 'Client doubts the validity of the provided address.',
        reasons: ['Misinformation', 'Bank/vendor confusion', 'Misunderstanding of virtual offices'],
        fix: 'Reassure commercial approval. Offer sample documents. Explain compliance usage.',
        escalate: 'Admin',
        condition: 'if external verification fails'
    },
    {
        id: 'ISSUE-7',
        title: 'Mail Not Received or Delayed',
        what: 'Client claims mail or courier is missing.',
        reasons: ['Courier delay', 'Incorrect sender details', 'Forwarding pending'],
        fix: 'Check mail log. Confirm forwarding preference. Inform expected timeline.',
        escalate: 'Operations Team',
        condition: 'if mail not logged'
    },
    {
        id: 'ISSUE-8',
        title: 'Client Unable to Download Documents',
        what: 'Document download link not working.',
        reasons: ['Expired link', 'Browser issues', 'Access permissions'],
        fix: 'Ask client to try another browser. Regenerate link. Resend via email.',
        escalate: 'Tech Support',
        condition: 'if issue persists'
    },
    {
        id: 'ISSUE-9',
        title: 'Booking Status Not Updating',
        what: 'Booking shows pending despite payment/KYC completion.',
        reasons: ['Backend sync delay', 'Admin approval pending'],
        fix: 'Refresh dashboard. Confirm payment & KYC status. Inform client of processing time.',
        escalate: 'Admin / Tech Team',
        condition: 'if delay exceeds SLA'
    },
    {
        id: 'ISSUE-10',
        title: 'Client Wants to Cancel Booking',
        what: 'Client requested cancellation.',
        reasons: [],
        fix: 'Explain cancellation policy clearly. Inform refund eligibility. Guide to support ticket.',
        escalate: 'Admin / Billing Team',
        condition: 'for refund processing'
    },
    {
        id: 'ISSUE-11',
        title: 'Client Complains About Support Delay',
        what: 'Client feels response time is slow.',
        reasons: [],
        fix: 'Acknowledge delay. Provide realistic timeline. Follow up internally.',
        escalate: 'Support Lead',
        condition: 'if SLA breached'
    },
    {
        id: 'ISSUE-12',
        title: 'Client Asking for Out of Scope Services',
        what: 'Client expects legal, tax, or accounting services.',
        reasons: [],
        fix: 'Clarify scope of services. Explain FlashSpace offerings. Redirect to professionals.',
        escalate: 'No escalation needed',
        noEscalation: true
    }
];

export const SALES_GUIDE_STEPS = [
    { title: 'Morning Review', text: 'Check your dashboard for new leads assigned overnight. Review "High Priority" queries.' },
    { title: 'Follow Ups', text: 'Go to "Clients" tab. Filter by "In Progress". Call clients who haven\'t completed documentation.' },
    { title: 'Update Status', text: 'Always update the client status after a call. Add notes in the "Notes" tab for every interaction.' }
];

export const SALES_FAQS = [
    // --- Pricing & Plans ---
    {
        id: "pricing-1",
        question: "Are there any hidden charges?",
        answer: "No. All pricing is transparent and clearly communicated upfront. Any optional add-ons (like additional mail forwarding or meeting room usage) are discussed before billing.",
        category: "pricing"
    },
    {
        id: "pricing-2",
        question: "Why is your pricing higher than some competitors?",
        answer: "Our pricing includes compliance-ready documentation, verified locations, and ongoing support. Many cheaper options exclude critical documents or charge later.",
        category: "pricing"
    },
    {
        id: "pricing-3",
        question: "Do you offer monthly and yearly plans?",
        answer: "Yes. Monthly plans offer flexibility, while yearly plans are more cost-effective and recommended for GST and compliance use cases.",
        category: "pricing"
    },
    {
        id: "pricing-4",
        question: "Can I upgrade my plan later?",
        answer: "Yes. Clients can upgrade plans at any time. The price difference is adjusted accordingly.",
        category: "pricing"
    },

    // --- Virtual Office & Legality ---
    {
        id: "legal-1",
        question: "Is the virtual office address legally valid?",
        answer: "Yes. All addresses are commercially approved and legally valid for business registration, GST, and official correspondence.",
        category: "registration"
    },
    {
        id: "legal-2",
        question: "Can I use this address for GST registration?",
        answer: "Yes. The address can be used for GST registration and comes with all required supporting documents.",
        category: "registration"
    },
    {
        id: "legal-3",
        question: "Will GST officers physically verify the address?",
        answer: "In some cases, yes. Our locations are prepared for verification and supported by proper documentation.",
        category: "registration"
    },
    {
        id: "legal-4",
        question: "Is this address accepted by banks?",
        answer: "Most major banks accept it. Final acceptance depends on the bank’s internal verification process.",
        category: "registration"
    },

    // --- Documents & Compliance ---
    {
        id: "docs-1",
        question: "What documents will I receive?",
        answer: "You will receive a No Objection Certificate (NOC), Service Agreement, Address Proof, and Utility Bill (where applicable).",
        category: "registration"
    },
    {
        id: "docs-2",
        question: "Are the documents legally valid?",
        answer: "Yes. All documents are digitally signed and legally valid for compliance and verification purposes.",
        category: "registration"
    },
    {
        id: "docs-3",
        question: "When will I receive the documents?",
        answer: "Documents are shared after payment and successful KYC verification.",
        category: "setup"
    },

    // --- KYC & Verification ---
    {
        id: "kyc-1",
        question: "Why is KYC required?",
        answer: "KYC is mandatory for legal compliance, fraud prevention, and adherence to government regulations.",
        category: "setup"
    },
    {
        id: "kyc-2",
        question: "What documents do I need to submit for KYC?",
        answer: "Typically: PAN Card, GST Certificate (if applicable), Business details, and ID proof of authorized signatory.",
        category: "setup"
    },
    {
        id: "kyc-3",
        question: "What happens if my KYC is rejected?",
        answer: "You will be informed of the reason and allowed to resubmit corrected documents.",
        category: "setup"
    },

    // --- Mail & Courier ---
    {
        id: "mail-1",
        question: "How does mail handling work?",
        answer: "All mail received at your virtual office address is logged and handled as per your selected plan.",
        category: "facilities"
    },
    {
        id: "mail-2",
        question: "Will I be notified when mail arrives?",
        answer: "Yes. You will receive an email notification whenever mail is received.",
        category: "facilities"
    },
    {
        id: "mail-3",
        question: "Can mail be forwarded to my address?",
        answer: "Yes. Mail can be forwarded via courier at additional cost.",
        category: "facilities"
    },

    // --- Coworking Spaces ---
    {
        id: "coworking-1",
        question: "What is the difference between Hot Desk and Dedicated Desk?",
        answer: "Hot Desk: Flexible seating, no fixed desk. Dedicated Desk: Fixed desk reserved only for you.",
        category: "coworking"
    },
    {
        id: "coworking-2",
        question: "Are utilities included in coworking plans?",
        answer: "Yes. Electricity, internet, housekeeping, and maintenance are included.",
        category: "coworking"
    },
    {
        id: "coworking-3",
        question: "Is there any lock-in period?",
        answer: "Most coworking plans are flexible with minimal or no lock-in.",
        category: "coworking"
    },

    // --- Meeting Rooms ---
    {
        id: "meeting-1",
        question: "How do I book a meeting room?",
        answer: "Meeting rooms can be booked on demand by selecting location, date, and time slot. Booking confirmation is shared via email.",
        category: "facilities"
    },
    {
        id: "meeting-2",
        question: "What facilities are available in meeting rooms?",
        answer: "High-speed WiFi, TV/Display, Whiteboard, and Reception support.",
        category: "facilities"
    },

    // --- Payments & Billing ---
    {
        id: "payment-1",
        question: "What payment methods are supported?",
        answer: "UPI, Debit & Credit Cards, and Net Banking.",
        category: "pricing"
    },
    {
        id: "payment-2",
        question: "What should I do if payment fails?",
        answer: "Try another card or UPI, check international transaction settings, retry after a few minutes, or escalate to support if the issue persists.",
        category: "pricing"
    },

    // --- Cancellation & Refunds ---
    {
        id: "refund-1",
        question: "Can I cancel my booking?",
        answer: "Yes. Cancellation requests can be raised via support.",
        category: "pricing"
    },
    {
        id: "refund-2",
        question: "Will I get a refund if I cancel?",
        answer: "Refund eligibility depends on plan type, usage status, and cancellation timing. Terms are shared at the time of purchase.",
        category: "pricing"
    },

    // --- Support & Escalation ---
    {
        id: "support-1",
        question: "How do I raise a support request?",
        answer: "Support tickets can be raised from the dashboard or by contacting the support team.",
        category: "basics"
    },
    {
        id: "support-2",
        question: "How long does support take to respond?",
        answer: "Most queries are responded to within 24 business hours.",
        category: "basics"
    },

    // --- Affiliate & Partnership ---
    {
        id: "affiliate-1",
        question: "Do you have an affiliate program?",
        answer: "Yes. We offer an affiliate program for partners who refer clients.",
        category: "benefits"
    },
    {
        id: "affiliate-2",
        question: "How are affiliates paid?",
        answer: "Affiliates earn commission on successful bookings after service activation.",
        category: "benefits"
    },

    // --- Important Clarifications ---
    {
        id: "clarify-1",
        question: "Do you provide legal or tax advisory?",
        answer: "No. FlashSpace provides address and documentation support, not legal or tax consultation.",
        category: "basics"
    },
    {
        id: "clarify-2",
        question: "Do you guarantee GST or business registration approval?",
        answer: "No. Approval is subject to government authority verification.",
        category: "basics"
    }
];

// --- SUPPORT HUB DATA (Placeholder) ---

export const SUPPORT_ARTICLES = [];
export const SALES_OBJECTION_RULES = {
    golden: {
        always: ['Listen fully', 'Acknowledge concern', 'Respond calmly', 'Ask clarifying questions'],
        never: ['Argue', 'Overpromise', 'Badmouth competitors', 'Rush the client']
    }
};

export const SUPPORT_OBJECTION_RULES = {
    golden: {
        always: ['Acknowledge emotion', 'Provide facts second', 'Give timeline third', 'Document everything'],
        never: ['Argue', 'Raise your tone', 'Overpromise', 'Share internal conflict']
    }
};

export const SUPPORT_OBJECTIONS = [
    {
        id: '1',
        title: 'This is unacceptable.',
        insight: 'They are frustrated and want immediate resolution.',
        response: 'I understand this is frustrating. Let me quickly review your case and provide a clear update.',
        tactics: ['Acknowledge emotion', 'Check system immediately', 'Provide realistic timeline', 'Avoid defensive tone', '❌ Avoid: "It’s not our fault."', '❌ Avoid: "You’ll have to wait."'],
        followup: null
    },
    {
        id: '2',
        title: 'I paid but nothing is activated.',
        insight: 'They fear loss of money.',
        response: 'I can see your payment. Let me check the activation status and update you right away.',
        tactics: ['Verify payment', 'Check KYC status', 'Confirm activation trigger', 'Escalate if sync delay'],
        followup: null
    },
    {
        id: '3',
        title: 'Why is my KYC still pending?',
        insight: 'They want speed.',
        response: 'KYC review typically takes 24–48 hours. Let me confirm where it is in the process.',
        tactics: ['Check document completeness', 'Confirm upload quality', 'Escalate if beyond SLA'],
        followup: null
    },
    {
        id: '4',
        title: 'My GST got rejected because of your address.',
        insight: 'They are blaming the platform.',
        response: 'I understand your concern. GST approval depends on government verification, but let’s review the documents to ensure everything was submitted correctly.',
        tactics: ['Review documentation', 'Confirm address format used', 'Escalate to Admin if needed'],
        followup: 'Important: Never guarantee government approvals.'
    },
    {
        id: '5',
        title: 'I want a refund immediately.',
        insight: 'They feel dissatisfied or uncertain.',
        response: 'I understand. Let me check the cancellation terms and guide you through the process.',
        tactics: ['Check service stage', 'Explain refund eligibility', 'Escalate to Billing', 'Never promise approval'],
        followup: null
    },
    {
        id: '6',
        title: 'Your team is not responding.',
        insight: 'They feel ignored.',
        response: 'I’m sorry for the delay. Let me prioritize this and provide an update now.',
        tactics: ['Check previous tickets', 'Provide clear timeline', 'Escalate internally if overdue'],
        followup: null
    },
    {
        id: '7',
        title: 'This address is fake.',
        insight: 'They fear compliance risk.',
        response: 'The address is commercially approved and used by multiple registered businesses. Let me share the relevant documentation.',
        tactics: ['Reassure legal validity', 'Offer document proof', 'Stay calm'],
        followup: null
    },
    {
        id: '8',
        title: 'Why was my KYC rejected? This makes no sense.',
        insight: 'They feel confused or offended.',
        response: 'Let me clearly explain the reason for rejection so we can correct it quickly.',
        tactics: ['Explain rejection in simple terms', 'Provide exact correction steps', 'Avoid vague answers'],
        followup: null
    },
    {
        id: '9',
        title: 'This is taking too long.',
        insight: 'They want urgency.',
        response: 'I understand the urgency. Here’s the currently status and expected timeline.',
        tactics: ['Provide factual timeline', 'Avoid false urgency', 'Escalate if SLA breached'],
        followup: null
    },
    {
        id: '10',
        title: 'I was promised something else.',
        insight: 'Possible miscommunication from Sales.',
        response: 'Let me review your booking details and clarify what is included in your selected plan.',
        tactics: ['Check CRM notes', 'Confirm selected plan', 'Explain inclusions clearly', 'Escalate if internal mismatch'],
        followup: 'Important: Never blame sales in front of client.'
    },
    {
        id: '11',
        title: 'I want to speak to a manager.',
        insight: 'They want authority intervention.',
        response: 'I’ll escalate this to the concerned team and ensure you receive a response promptly.',
        tactics: ['Document issue clearly', 'Escalate properly', 'Inform realistic callback timeline'],
        followup: null
    },
    {
        id: '12',
        title: 'Your service is useless.',
        insight: 'Emotional frustration.',
        response: 'I’m sorry this has been your experience. Let’s resolve this properly.',
        tactics: ['Stay calm', 'Avoid emotional reaction', 'Focus on solution', 'Escalate if abusive'],
        followup: null
    }
];
// --- Rules for Troubleshooting ---

export const SALES_TROUBLESHOOTING_RULES = null; // Placeholder if needed

export const SUPPORT_TROUBLESHOOTING_RULES = {
    priority: {
        low: ['Plan clarification', 'Document resend'],
        medium: ['KYC delay', 'Invoice confusion'],
        high: ['Payment deducted but not reflected', 'Access denied', 'Refund dispute'],
        critical: ['Legal threat', 'Social media escalation', 'Chargeback initiated']
    },
    golden: [
        'Verify before responding',
        'Acknowledge emotion',
        'Provide timeline',
        'Document in CRM',
        'Escalate only with complete details'
    ]
};

export const SUPPORT_ISSUES = [
    // --- Login & Account ---
    {
        id: 'sup-i1',
        title: 'Client Unable to Login',
        what: '“Invalid credentials” error, Page refresh loop, or Account not accessible.',
        reasons: ['Incorrect password', 'Unverified email', 'Expired session', 'Backend auth issue'],
        fix: 'Confirm correct email. Ask client to reset password. Check if account is verified. Ask client to clear cache.',
        escalate: 'Tech Team',
        condition: 'Reset link not working / Account locked'
    },
    {
        id: 'sup-i2',
        title: 'OTP Not Received',
        what: 'Client is not receiving OTP for login/verification.',
        reasons: ['Spam filtering', 'Email typo', 'System delay'],
        fix: 'Confirm email spelling. Ask client to check spam. Resend OTP. Wait 2–3 minutes.',
        escalate: 'Tech Team',
        condition: 'OTP repeatedly fails'
    },

    // --- Payment & Billing ---
    {
        id: 'sup-i3',
        title: 'Payment Deducted but Booking Not Created',
        what: 'Client paid but no booking generated.',
        reasons: ['Payment gateway delay', 'Sync failure', 'Incomplete transaction'],
        fix: 'Ask for transaction ID. Check payment status in admin. Wait 10–15 mins for sync. Refresh status.',
        escalate: 'Billing + Tech',
        condition: 'Payment success but no booking'
    },
    {
        id: 'sup-i4',
        title: 'Booking Pending Payment After Deduction',
        what: 'Status shows Pending Payment despite deduction.',
        reasons: [],
        fix: 'Verify payment confirmation. Confirm gateway callback. Inform client about delay.',
        escalate: 'Tech Team',
        condition: 'Status not updated within 30 mins'
    },
    {
        id: 'sup-i5',
        title: 'Client Disputing Invoice Amount',
        what: 'Client disagrees with the total amount.',
        reasons: ['GST confusion', 'Plan misunderstanding', 'Upgrade adjustment'],
        fix: 'Review invoice breakdown. Explain subtotal + tax. Confirm selected plan. Provide invoice copy.',
        escalate: 'Billing Team',
        condition: 'Billing discrepancy suspected'
    },

    // --- KYC & Documents ---
    {
        id: 'sup-i6',
        title: 'KYC Still Pending',
        what: 'KYC not approved within SLA (24–48 hours).',
        reasons: [],
        fix: 'Check document completeness. Confirm clarity. Inform client of review timeline.',
        escalate: 'Admin (KYC Team)',
        condition: 'Pending beyond SLA'
    },
    {
        id: 'sup-i7',
        title: 'KYC Rejected',
        what: 'Client KYC was rejected.',
        reasons: ['Blurred documents', 'Name mismatch', 'Expired ID', 'Incorrect business details'],
        fix: 'Check rejection reason. Clearly explain issue. Guide re-upload.',
        escalate: 'Admin',
        condition: 'Rejection reason unclear'
    },
    {
        id: 'sup-i8',
        title: 'Client Hasn’t Received Documents',
        what: 'Documents missing after payment & KYC approval.',
        reasons: [],
        fix: 'Verify status. Regenerate document link. Resend email.',
        escalate: 'Tech/Admin',
        condition: 'Document generation error'
    },

    // --- Virtual Office ---
    {
        id: 'sup-i9',
        title: 'Client Claims Address Is Invalid',
        what: 'Client or third party questioning address validity.',
        reasons: [],
        fix: 'Reassure commercial approval. Confirm correct address format. Share documentation.',
        escalate: 'Admin/Compliance',
        condition: 'External authority rejects address'
    },
    {
        id: 'sup-i10',
        title: 'GST Officer Verification Concern',
        what: 'Client worried about physical verification.',
        reasons: [],
        fix: 'Explain verification readiness. Confirm documents provided. Inform that approval depends on authority.',
        escalate: 'No escalation',
        condition: 'Never guarantee GST approval'
    },

    // --- Mail Handling ---
    {
        id: 'sup-i11',
        title: 'Mail Not Received',
        what: 'Client expecting mail that hasn’t arrived.',
        reasons: ['Courier delay', 'Sender mistake', 'Mail not yet logged'],
        fix: 'Check mail log. Confirm sender tracking. Inform estimated arrival.',
        escalate: 'Operations Team',
        condition: 'Mail missing from log'
    },
    {
        id: 'sup-i12',
        title: 'Mail Forwarding Delayed',
        what: 'Forwarding request not processed.',
        reasons: [],
        fix: 'Check forwarding request status. Confirm address. Provide timeline.',
        escalate: 'Operations',
        condition: 'Forwarding not processed'
    },

    // --- Coworking & Facility ---
    {
        id: 'sup-i13',
        title: 'Access Denied at Location',
        what: 'Client cannot enter the space.',
        reasons: ['Booking inactive', 'Expired plan', 'Access list not updated'],
        fix: 'Check booking status. Confirm activation date. Contact location manager if urgent.',
        escalate: 'Operations',
        condition: 'Immediate access needed'
    },
    {
        id: 'sup-i14',
        title: 'Facility Complaint',
        what: 'Internet, Cleanliness, or Noise issues.',
        reasons: [],
        fix: 'Collect details (date, time, issue type). Acknowledge concern. Forward to Operations.',
        escalate: 'Operations',
        condition: 'Always forward'
    },

    // --- Meeting Rooms ---
    {
        id: 'sup-i15',
        title: 'Booking Not Reflecting',
        what: 'Meeting room booking missing.',
        reasons: [],
        fix: 'Check booking ID. Confirm payment. Resend confirmation.',
        escalate: 'Tech',
        condition: 'Booking missing in system'
    },

    // --- Cancellation & Refund ---
    {
        id: 'sup-i16',
        title: 'Client Requests Cancellation',
        what: 'Client wants to cancel.',
        reasons: [],
        fix: 'Review cancellation policy. Confirm activation stage. Escalate to Billing/Admin.',
        escalate: 'Billing/Admin',
        condition: 'Do not promise refunds'
    },
    {
        id: 'sup-i17',
        title: 'Refund Delay Complaint',
        what: 'Refund not received within timeline.',
        reasons: [],
        fix: 'Check refund approval status. Inform processing timeline. Provide realistic expectation.',
        escalate: 'Billing Lead',
        condition: 'Refund beyond SLA'
    },

    // --- Portal & Tech ---
    {
        id: 'sup-i18',
        title: 'Dashboard Not Loading',
        what: 'Client cannot access dashboard.',
        reasons: [],
        fix: 'Ask client to refresh. Clear browser cache. Try alternate browser. Check system status.',
        escalate: 'Tech Team',
        condition: 'Persistent issue'
    },
    {
        id: 'sup-i19',
        title: 'Document Download Error',
        what: 'File download failing.',
        reasons: [],
        fix: 'Regenerate link. Send direct email copy. Suggest alternate device.',
        escalate: 'Tech',
        condition: 'File corrupted'
    }
];
export const SUPPORT_GUIDE_STEPS = [
    { title: 'Morning Review', text: 'Check your dashboard for new support tickets assigned overnight. Review "High Priority" issues first.' },
    { title: 'Follow Ups', text: 'Go to "Tickets" tab. Filter by "Pending". Follow up on tickets waiting for client response.' },
    { title: 'Update Status', text: 'Always update the ticket status after an action. Add notes in the "Internal Notes" for every interaction.' }
];
export const SUPPORT_FAQS = [
    // --- Account & Login ---
    {
        id: "acct-1",
        question: "Client says they cannot log in. What should I check?",
        answer: "Confirm correct email is being used. Ask client to reset password. Check if account is verified. Escalate to Tech if login error persists.",
        category: "basics"
    },
    {
        id: "acct-2",
        question: "Client says OTP is not received.",
        answer: "Confirm correct email. Ask client to check spam/junk. Resend OTP. Escalate to Tech if repeated failure.",
        category: "basics"
    },

    // --- Bookings ---
    {
        id: "book-1",
        question: "Booking shows “Pending Payment” even after client paid.",
        answer: "Verify payment status in admin panel. Check payment gateway logs. Inform client if processing delay. Escalate to Billing/Tech if mismatch continues.",
        category: "pricing"
    },
    {
        id: "book-2",
        question: "Booking shows “Pending KYC”. What should I tell the client?",
        answer: "Inform client that KYC is mandatory before activation. Review takes 24–48 hours. Missing/unclear documents may delay approval.",
        category: "registration"
    },
    {
        id: "book-3",
        question: "Client says booking is not activated.",
        answer: "Check Payment status, KYC approval, and Admin approval. If all complete and still inactive → escalate to Admin/Tech.",
        category: "registration"
    },

    // --- KYC & Documents ---
    {
        id: "kyc-sup-1",
        question: "Why is KYC required?",
        answer: "KYC is mandatory for regulatory compliance, fraud prevention, and business verification. Service cannot be activated without approved KYC.",
        category: "security"
    },
    {
        id: "kyc-sup-2",
        question: "Client’s KYC was rejected. What do I do?",
        answer: "Check rejection reason. Explain clearly to client. Ask for correct re-upload. Escalate only if reason unclear.",
        category: "security"
    },
    {
        id: "kyc-sup-3",
        question: "Client says documents were not received.",
        answer: "Confirm KYC approved. Confirm payment completed. Resend documents. Regenerate link if expired.",
        category: "setup"
    },
    {
        id: "kyc-sup-4",
        question: "When are documents shared?",
        answer: "Documents are shared only after successful payment and approved KYC.",
        category: "setup"
    },

    // --- Virtual Office ---
    {
        id: "vo-1",
        question: "Is the virtual office address legally valid?",
        answer: "Yes. It is commercially approved and legally valid for business registration and GST usage.",
        category: "benefits"
    },
    {
        id: "vo-2",
        question: "Can client use address for GST registration?",
        answer: "Yes. Required documents are provided for GST registration. Note: Approval is subject to government verification.",
        category: "benefits"
    },
    {
        id: "vo-3",
        question: "Client asking if GST approval is guaranteed?",
        answer: "No approval can be guaranteed. Authorities make the final decision.",
        category: "benefits"
    },

    // --- Mail Handling ---
    {
        id: "mail-sup-1",
        question: "Client says they haven’t received mail notification.",
        answer: "Check mail log. Confirm sender details. Verify email address. Escalate to Operations if mail not logged.",
        category: "facilities"
    },
    {
        id: "mail-sup-2",
        question: "How does mail forwarding work?",
        answer: "Mail is logged at location, client notified via email, and forwarded upon request (if applicable under plan).",
        category: "facilities"
    },

    // --- Coworking Spaces ---
    {
        id: "cowork-sup-1",
        question: "Client confused about desk types.",
        answer: "Hot Desk = Flexible seating. Dedicated Desk = Fixed personal desk. Private Office = Enclosed cabin.",
        category: "coworking"
    },
    {
        id: "cowork-sup-2",
        question: "Client complains about facility issues.",
        answer: "Acknowledge concern. Gather details (location, issue type, date). Escalate to Operations.",
        category: "coworking"
    },

    // --- Meeting Rooms ---
    {
        id: "meet-sup-1",
        question: "Client says meeting room booking not visible.",
        answer: "Verify booking in system. Confirm payment. Check date & time. Resend confirmation email. Escalate to Tech if not reflecting.",
        category: "facilities"
    },

    // --- Billing & Payments ---
    {
        id: "bill-1",
        question: "Payment deducted but booking not updated.",
        answer: "Verify transaction ID. Check payment gateway. Inform client of processing delay. Escalate to Billing/Tech.",
        category: "pricing"
    },
    {
        id: "bill-2",
        question: "Client wants invoice copy.",
        answer: "Locate invoice in dashboard. Resend invoice. Confirm billing details.",
        category: "pricing"
    },
    {
        id: "bill-3",
        question: "Client disputes tax amount.",
        answer: "Explain GST rate applied. Show invoice breakdown. Escalate to Billing if mismatch suspected.",
        category: "pricing"
    },

    // --- Cancellation & Refunds ---
    {
        id: "cancel-1",
        question: "Client wants to cancel booking.",
        answer: "Explain cancellation policy. Inform refund eligibility depends on service stage. Escalate to Billing/Admin for approval.",
        category: "pricing"
    },
    {
        id: "cancel-2",
        question: "Client demanding immediate refund.",
        answer: "Acknowledge request. Inform refund review process. Do not promise approval. Escalate to Billing.",
        category: "pricing"
    },

    // --- Technical Issues ---
    {
        id: "tech-1",
        question: "Dashboard not loading.",
        answer: "Ask client to refresh. Clear browser cache. Try another browser. Escalate to Tech if issue persists.",
        category: "setup"
    },
    {
        id: "tech-2",
        question: "Client cannot download documents.",
        answer: "Regenerate link. Resend via email. Suggest alternate browser. Escalate if link repeatedly fails.",
        category: "setup"
    },

    // --- Service Limitations ---
    {
        id: "limit-1",
        question: "Client asking for legal or tax consultation.",
        answer: "Clarify: FlashSpace provides address and documentation support, not legal advisory.",
        category: "basics"
    },
    {
        id: "limit-2",
        question: "Client asking for guaranteed bank approval.",
        answer: "Bank approval depends on individual bank policies. We provide required documentation only.",
        category: "basics"
    },

    // --- Escalation Guidelines ---
    {
        id: "esc-1",
        question: "Escalate To Tech When:",
        answer: "Login issues, Payment sync errors, Portal glitches.",
        category: "basics"
    },
    {
        id: "esc-2",
        question: "Escalate To Admin When:",
        answer: "KYC delay beyond SLA, Document discrepancies.",
        category: "basics"
    },
    {
        id: "esc-3",
        question: "Escalate To Operations When:",
        answer: "Mail handling issues, Facility complaints.",
        category: "basics"
    },
    {
        id: "esc-4",
        question: "Escalate To Billing When:",
        answer: "Refund requests, Payment disputes.",
        category: "basics"
    }
];
