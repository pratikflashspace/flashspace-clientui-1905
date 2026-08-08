import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  Phone,
  Scale,
  Sparkles,
  ChevronRight,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Vpob = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Set Document Title & Structured JSON-LD Metadata on Mount
  useEffect(() => {
    document.title = 'VPOB & APOB for Amazon and Flipkart Sellers | State GSTIN | FlashSpace';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Virtual Place of Business (VPOB) and APOB for Amazon FBA and Flipkart sellers. State GSTIN plus REG-14 fulfilment centre amendment in 12 working days. Very affordable pricing per state.'
    );

    // JSON-LD SCHEMAS: Service, Offer, FAQPage, HowTo, BreadcrumbList, Organization
    const schemaData = [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'VPOB and APOB for marketplace sellers',
        serviceType: 'GST Compliance & Virtual Place of Business',
        provider: {
          '@type': 'Organization',
          name: 'FlashSpace',
          url: 'https://flashspace.co'
        },
        description:
          'Virtual Place of Business (VPOB) addresses and Form REG-14 Additional Place of Business (APOB) registration for Amazon FBA and Flipkart Smart Fulfilment sellers across India.'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Offer',
        name: 'FlashSpace Multi-State VPOB & APOB Package',
        availability: 'https://schema.org/InStock',
        url: 'https://flashspace.co/vpob'
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the difference between VPOB and APOB?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'VPOB (Virtual Place of Business) is the principal registered address in a state used to obtain a state GSTIN via Form REG-01. APOB (Additional Place of Business) is the marketplace warehouse (such as Amazon FBA or Flipkart FC) added to your GST certificate via Form REG-14 core amendment. VPOB creates the registration; APOB attaches the inventory storage location.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is a virtual place of business legal for GST registration?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Under Rules 8 and 9 of the CGST Rules 2017, there is no requirement to own physical property to register for GST. Tax authorities permit registration on rented commercial premises provided valid proof of occupancy—such as a notarised consent/lease agreement, property owner NOC, and recent utility bill—is submitted.'
            }
          },
          {
            '@type': 'Question',
            name: 'Do I need a separate GSTIN for every state I store stock in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Under Section 24(ix) read with Section 25 of the CGST Act 2017, storing inventory in a state creates a taxable presence. Because GST is a destination-based consumption tax, stocking goods in an Amazon FBA or Flipkart FC in Karnataka, Maharashtra, or Haryana requires a distinct State GSTIN for that state.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is adding an APOB a core or non-core field amendment?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Adding a warehouse as an Additional Place of Business is a core field amendment under Form REG-14. Core field amendments alter key structural details of your GST registration and require formal review and approval by the jurisdictional GST officer.'
            }
          },
          {
            '@type': 'Question',
            name: 'How long does the whole process take?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The complete end-to-end process typically takes 3 to 5 weeks per state. Obtaining the VPOB document kit takes 24 to 48 hours, State GSTIN issuance under Form REG-01 takes 7 to 12 working days, and the Form REG-14 APOB amendment takes an additional 5 to 10 working days after GSTIN generation.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can I add more than one FC in the same state?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. You can add multiple fulfilment centres within the same state under a single State GSTIN. FlashSpace includes additional FC additions within the same state at no extra fee under your annual plan.'
            }
          },
          {
            '@type': 'Question',
            name: 'Will a GST officer physically visit the VPOB address?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Physical verification frequency varies by state. Tax authorities in states like Karnataka and Maharashtra initiate physical verification visits in approximately 65–75% of new VPOB registrations, whereas states like Delhi or Telangana have lower visit rates. FlashSpace provides on-ground staff at every VPOB address to receive visiting officers and present original documents.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is VPOB affordable in India?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. FlashSpace provides very affordable, transparent all-inclusive bundles that cover virtual office lease documents, Form REG-01 State GSTIN filing, Form REG-14 APOB amendment filing, physical verification support, and query resolution.'
            }
          },
          {
            '@type': 'Question',
            name: 'What happens to my GSTIN if I stop selling in that state?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'If you cease storing inventory or selling in a state, you must file Form REG-16 to officially surrender and cancel that state GSTIN. Never allow a registration to lapse silently, as unfiled monthly GSTR-1 and GSTR-3B returns accrue late fees under Section 47 up to Rs 5,000 per return.'
            }
          }
        ]
      }
    ];

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="vpob-page bg-[#FAF9F6] text-[#1A1A1A] min-h-screen selection:bg-[#36503F] selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Strict CSS Rule: Force Inter font family across every element on the entire page */}
      <style>{`
        .vpob-page,
        .vpob-page *,
        .vpob-page h1,
        .vpob-page h2,
        .vpob-page h3,
        .vpob-page h4,
        .vpob-page h5,
        .vpob-page h6,
        .vpob-page p,
        .vpob-page span,
        .vpob-page div,
        .vpob-page button,
        .vpob-page a,
        .vpob-page input,
        .vpob-page table,
        .vpob-page th,
        .vpob-page td,
        .vpob-page dt,
        .vpob-page dd {
          font-family: 'Inter', sans-serif !important;
        }
        .vpob-mono {
          font-family: 'Inter', sans-serif !important;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <Header />

      {/* A. BREADCRUMB */}
      <div className="bg-[#FAF9F6] border-b border-gray-200/80 pt-24 pb-3">
        <div className="max-w-7xl mx-auto px-6 text-xs text-gray-500 flex items-center gap-2 vpob-mono">
          <span className="hover:text-gray-900 cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="hover:text-gray-900 cursor-pointer" onClick={() => navigate('/services/virtual-office')}>Virtual Office</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#36503F] font-bold">VPOB & APOB for Marketplace Sellers</span>
        </div>
      </div>

      {/* B. HERO (TWO COLUMNS) */}
      <section className="bg-[#FAF9F6] border-b border-gray-200/80 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_380px] gap-12 items-stretch">
          {/* Left Column: Heading & Strategic Lead */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#36503F]/10 border border-[#36503F]/20 text-[#36503F] text-xs font-bold uppercase tracking-wider vpob-mono mb-4">
                <ShieldCheck className="w-4 h-4 text-[#36503F]" />
                Section 24(ix) CGST · 12 States Live
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
                VPOB and APOB for Amazon and Flipkart sellers
              </h1>

              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl font-normal">
                Store inventory in a state and you need a GSTIN there whatever your turnover. We supply the Virtual Place of Business (VPOB) to register on, then file the Form REG-14 core amendment that adds the Amazon or Flipkart fulfilment centre as your Additional Place of Business (APOB). Both halves, one flat price, 12 working days typical turnaround.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => scrollToSection('law')}
                className="bg-[#36503F] text-[#FEF8C5] px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-[#1F2E26] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Read Statutory Provisions
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToSection('vs')}
                className="bg-white border border-gray-300 text-gray-900 px-7 py-3.5 rounded-xl text-sm font-bold hover:border-gray-900 transition-colors flex items-center justify-center shadow-sm"
              >
                VPOB or APOB, which do I need?
              </button>
            </div>
          </div>

          {/* Right Column: Bare Definition List */}
          <div className="bg-white rounded-2xl p-6 border border-gray-300/80 shadow-md flex flex-col justify-between">
            <h3 className="text-xs uppercase tracking-widest text-[#36503F] font-bold mb-4 border-b border-gray-200 pb-2 vpob-mono">
              National VPOB Overview
            </h3>

            <dl className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <dt className="text-gray-600 font-medium">States Live</dt>
                <dd className="font-bold text-gray-900 vpob-mono text-base">12 States</dd>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <dt className="text-gray-600 font-medium">FCs Mapped</dt>
                <dd className="font-bold text-gray-900 vpob-mono text-base">48 Warehouses</dd>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <dt className="text-gray-600 font-medium">Sellers Onboarded</dt>
                <dd className="font-bold text-[#36503F] vpob-mono text-base">1,840+ Active</dd>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <dt className="text-gray-600 font-medium">GSTIN Typical Turnaround</dt>
                <dd className="font-bold text-gray-900 vpob-mono">7–12 Working Days</dd>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <dt className="text-gray-600 font-medium">APOB Amendment</dt>
                <dd className="font-bold text-gray-900 vpob-mono">5–10 Working Days</dd>
              </div>
              <div className="flex justify-between items-center pt-1">
                <dt className="text-gray-900 font-bold">Pricing</dt>
                <dd className="font-bold text-[#36503F] text-base vpob-mono">Very Affordable</dd>
              </div>
            </dl>

            <a
              href="tel:+919888687898"
              className="mt-6 w-full bg-emerald-50 border border-emerald-200 text-[#36503F] text-xs font-bold py-3 rounded-xl hover:bg-emerald-100 transition-colors text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              Speak to a VPOB Specialist
            </a>
          </div>
        </div>
      </section>

      {/* E. H2: THE RS 40 LAKH THRESHOLD DOES NOT PROTECT MARKETPLACE SELLERS (#law) */}
      <section id="law" className="py-16 bg-white border-b border-gray-200/80 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight max-w-4xl">
              The Rs 40 lakh threshold does not protect marketplace sellers
            </h2>

            <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
              Section 24(ix) explicitly overrides Section 22 turnover limits the moment your goods enter an Amazon FBA or Flipkart Smart Fulfilment warehouse.
            </p>
          </div>

          {/* 3-Card Statutory Legal Breakdown Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {/* Pillar 1: Compulsory Registration */}
            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm vpob-mono">
                    01
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold vpob-mono">
                    Section 24(ix)
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Compulsory GST Registration</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Section 22 establishes a baseline threshold of ₹40 lakh (₹20 lakh for services). However, Section 24(ix) mandates compulsory registration regardless of turnover for anyone supplying goods through e-commerce operators collecting TCS u/s 52.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200/80 text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Zero-turnover exemption ceases at first deposit</span>
              </div>
            </div>

            {/* Pillar 2: Multi-State Registration */}
            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-emerald-100 text-[#36503F] font-bold flex items-center justify-center text-sm vpob-mono">
                    02
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#36503F] border border-emerald-200 text-[11px] font-bold vpob-mono">
                    Section 25(1) & 2(85)
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Multi-State Storage Rules</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Section 2(85) defines any warehouse or godown where you store goods as a "place of business". Storing inventory in an Amazon or Flipkart FC in KA, MH, or HR legally obligates you to obtain a separate State GSTIN for that state.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200/80 text-[11px] font-bold text-[#36503F] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#36503F] shrink-0" />
                <span>Distinct State GSTIN required per storage node</span>
              </div>
            </div>

            {/* Pillar 3: Two-Stage Sequence */}
            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-sm vpob-mono">
                    03
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-bold vpob-mono">
                    REG-01 + REG-14
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Two-Stage Compliance Sequence</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Stage 1: FlashSpace address serves as VPOB to generate initial State GSTIN (Form REG-01). Stage 2: Attach FC warehouse as Additional Place of Business via Form REG-14 core amendment to prevent dock gate rejection.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200/80 text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>FC address must appear on official certificate</span>
              </div>
            </div>
          </div>

          {/* Statutory Pull Quote Card */}
          <div className="p-6 md:p-8 bg-[#1F2E26] text-white rounded-2xl shadow-lg border border-emerald-950">
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-widest text-[#FEF8C5] vpob-mono mb-2">
                  Official Statutory Quote — CGST Act 2017
                </div>
                <blockquote className="text-sm md:text-base text-emerald-100 font-medium italic leading-relaxed mb-3">
                  "Notwithstanding anything contained in sub-section (1) of section 22, the following categories of persons shall be registered under this Act... (ix) persons who supply goods or services or both, other than supplies specified under sub-section (5) of section 9, through such e-commerce operator who is required to collect tax at source under section 52."
                </blockquote>
                <cite className="text-xs text-emerald-300 font-semibold not-italic vpob-mono">
                  — Central Goods and Services Tax Act 2017, Sections 22, 24(ix) & 25
                </cite>
              </div>

              <a
                href="tel:+919888687898"
                className="shrink-0 bg-[#FEF8C5] text-[#1F2E26] hover:bg-yellow-200 px-5 py-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-md"
              >
                <Phone className="w-4 h-4 text-[#1F2E26]" />
                Verify Compliance Status
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* G. H2: VPOB AND APOB ARE NOT ALTERNATIVES, YOU NEED BOTH (#vs) */}
      <section id="vs" className="py-16 bg-[#FAF9F6] border-b border-gray-200/80 scroll-mt-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              VPOB and APOB are not alternatives, you need both
            </h2>
            <p className="text-base text-gray-600 max-w-3xl leading-relaxed">
              A common operational mistake sellers make is confusing VPOB with APOB. They form a mandatory sequential pipeline, not a choice.
            </p>
          </div>

          {/* Desktop & Responsive Reflow Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-300 shadow-sm bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1F2E26] text-white vpob-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-1/5">Compliance Aspect</th>
                  <th className="p-4 w-2/5">Virtual Place of Business (VPOB)</th>
                  <th className="p-4 w-2/5">Additional Place of Business (APOB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50 vpob-mono">What it is</td>
                  <td className="p-4 leading-relaxed">Primary registered address in the state supplied by FlashSpace.</td>
                  <td className="p-4 leading-relaxed">Marketplace fulfilment centre warehouse (e.g. Amazon BLR4, Flipkart Bhiwandi).</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50 vpob-mono">Legal Basis</td>
                  <td className="p-4 leading-relaxed">Section 2(85) & Section 25(1) CGST Act 2017.</td>
                  <td className="p-4 leading-relaxed">Section 2(85)(a) & Rule 19 CGST Rules 2017.</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50 vpob-mono">Form Used</td>
                  <td className="p-4 font-bold text-[#36503F] vpob-mono">Form REG-01 (New State Registration)</td>
                  <td className="p-4 font-bold text-[#36503F] vpob-mono">Form REG-14 (Core Field Amendment)</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50 vpob-mono">What You Supply</td>
                  <td className="p-4 leading-relaxed">Notarised lease, owner NOC, electricity bill, signage photo.</td>
                  <td className="p-4 leading-relaxed">Marketplace FC Allotment Letter & Active State GSTIN.</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50 vpob-mono">Timeline</td>
                  <td className="p-4 font-semibold vpob-mono">7 to 12 Working Days</td>
                  <td className="p-4 font-semibold vpob-mono">5 to 10 Working Days after GSTIN</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors bg-red-50/30">
                  <td className="p-4 font-bold text-red-900 bg-red-50/60 vpob-mono">If You Skip It</td>
                  <td className="p-4 text-red-800 leading-relaxed font-medium">Cannot apply for State GSTIN; no principal place of business.</td>
                  <td className="p-4 text-red-800 leading-relaxed font-medium">Inbound shipment turned away at FC gate; stock returned at your cost; ₹25,000 penalty u/s 125.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* H. H2: WHAT WE HAND OVER, PER STATE (#docs) */}
      <section id="docs" className="py-16 bg-white border-b border-gray-200/80 scroll-mt-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              What we hand over, per state
            </h2>
            <p className="text-base text-gray-600 max-w-3xl leading-relaxed">
              This is the exact mandatory document stack uploaded under "Proof of Principal Place of Business" in Form REG-01. No running around for signatures.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                num: '01',
                title: 'Notarised Rent Agreement',
                tag: 'Mandatory',
                desc: '11-month commercial lease agreement executed in your registered entity name, printed on valid state stamp paper, and notarised.'
              },
              {
                num: '02',
                title: 'Property Owner NOC',
                tag: 'Mandatory',
                desc: "Owner's letterhead NOC physically signed by property title holder explicitly granting permission to register your principal place of business."
              },
              {
                num: '03',
                title: 'Latest Electricity & Tax Bill',
                tag: 'Mandatory',
                desc: 'Recent utility bill (BSES/BESCOM/MSEDCL) dated comfortably inside the 60-day window accepted by tax officers during scrutiny.'
              },
              {
                num: '04',
                title: 'Physical Signage & Geotagged Photo',
                tag: 'Included',
                desc: 'Your business name mounted at the VPOB reception desk, complete with high-resolution geotagged photographs for verification files.'
              },
              {
                num: '05',
                title: 'Form REG-14 Core Amendment Filing',
                tag: 'Included',
                desc: 'Complete filing service to add your Amazon FBA or Flipkart FC as an Additional Place of Business (APOB) on your active GST certificate.'
              },
              {
                num: '06',
                title: 'On-Ground Physical Verification Support',
                tag: 'Included',
                desc: 'FlashSpace local staff present on-site to receive visiting GST inspectors and present original ownership and lease documents on demand.'
              }
            ].map((doc) => (
              <div key={doc.num} className="p-6 rounded-2xl bg-[#FAF9F6] border border-gray-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-gray-300 vpob-mono">{doc.num}</span>
                    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold vpob-mono ${
                      doc.tag === 'Mandatory' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {doc.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{doc.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* I. H2: FROM SIGNUP TO A COMPLIANT STATE GSTIN WITH THE FC ATTACHED (#process) */}
      <section id="process" className="py-16 bg-[#FAF9F6] border-b border-gray-200/80 scroll-mt-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              From signup to a compliant state GSTIN with the FC attached
            </h2>
            <p className="text-base text-gray-600 max-w-3xl leading-relaxed">
              Honest operational timeline. End-to-end execution takes 3 to 5 weeks per state. Plan your inbound marketplace stock shipments around these milestones.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 relative">
            {[
              { day: 'Day 0', title: 'Onboarding', desc: 'Submit PAN, Aadhaar of authorised signatory, incorporation proof, and FC allotment letter.' },
              { day: 'Day 1', title: 'VPOB Issuance', desc: 'FlashSpace issues notarised lease agreement, NOC, electricity bill, and signage proof.' },
              { day: 'Day 2', title: 'REG-01 Filing', desc: 'State GSTIN application filed under exact jurisdictional division and ward.' },
              { day: 'Day 3–12', title: 'GSTIN Approval', desc: 'Jurisdictional tax officer reviews documents and issues 15-digit State GSTIN.' },
              { day: 'Day 12–25', title: 'APOB Core Amendment', desc: 'Form REG-14 filed to list Amazon/Flipkart FC on the state GST certificate.' }
            ].map((step) => (
              <div key={step.day} className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm flex flex-col justify-between relative">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#36503F] font-bold vpob-mono mb-2">{step.day}</div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{step.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* J. H2: GET YOUR VPOB & APOB WITH SHUBHAM (#pricing) */}
      <section id="pricing" className="py-16 bg-[#1F2E26] text-white border-b border-emerald-950 scroll-mt-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_480px] gap-10 items-center">
            {/* Left Column: Heading & Paragraph */}
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
                Ready to expand your Amazon FBA or Flipkart reach across India?
              </h2>
              <p className="text-base md:text-lg text-emerald-100/90 leading-relaxed mb-6 font-normal">
                Very affordable all-inclusive pricing per state. Complete VPOB document kit, State GSTIN filing, and REG-14 APOB FC amendment included with 100% compliance.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:+919888687898"
                  className="bg-[#FEF8C5] text-[#1F2E26] hover:bg-yellow-200 px-6 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg"
                >
                  <Phone className="w-4 h-4 text-[#1F2E26]" />
                  Talk to a VPOB Specialist
                </a>
              </div>
            </div>

            {/* Right Column: Contact Shubham Card */}
            <div className="bg-white text-gray-900 rounded-2xl p-6 border border-gray-200 shadow-2xl text-left">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                <div className="relative shrink-0">
                  <img
                    src="/to_cloudinary/shubham.png"
                    alt="Shubham"
                    className="w-14 h-14 rounded-2xl object-cover object-top"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-gray-900 text-base leading-tight">Shubham</h4>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#36503F] text-[10px] font-bold border border-emerald-200">
                      VPOB Specialist
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs font-bold vpob-mono mt-1">+91 98886 87898</p>
                  <p className="text-emerald-700 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Direct Compliance Lead
                  </p>
                </div>
              </div>

              <a 
                href="tel:+919888687898"
                className="w-full py-3 rounded-xl bg-[#36503F] hover:bg-[#2c4133] text-[#FEF8C5] text-xs font-bold transition-all mb-5 flex items-center justify-center gap-2 shadow-md text-center"
              >
                <Phone className="w-4 h-4" />
                Contact Shubham Directly
              </a>

              <div>
                <h5 className="font-bold text-gray-900 text-xs mb-3 uppercase tracking-wider text-gray-500">Shubham will help you with:</h5>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Multi-State VPOB Selection",
                    "Amazon & Flipkart FC Mapping",
                    "Form REG-01 State Filing",
                    "Form REG-14 Core Amendment",
                    "Officer Visit On-Ground Support",
                    "Query Resolution (REG-03)"
                  ].map((item) => (
                    <div key={item} className="flex items-center text-xs text-gray-700 font-medium bg-gray-50 p-2 rounded-lg border border-gray-200/80 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#36503F] mr-1.5 shrink-0" />
                      <span className="leading-tight text-[11px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* K. H2: WHAT ACTUALLY HAPPENS WHEN THE FC IS NOT DECLARED (#risk) */}
      <section id="risk" className="py-16 bg-[#FAF9F6] border-b border-gray-200/80 scroll-mt-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-100 text-red-900 text-xs font-bold uppercase tracking-wider vpob-mono mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
              Compliance Risk Analysis
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              What actually happens when the FC is not declared
            </h2>
            <p className="text-base text-gray-600 max-w-3xl leading-relaxed">
              The classic failure pattern: a seller buys a VPOB, gets the state GSTIN, but neglects filing Form REG-14 to attach the warehouse. Your GSTIN is valid, but your storage operation is non-compliant.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                trigger: 'At the FC Gate',
                title: 'Inbound Shipment Rejection',
                desc: 'Amazon FBA and Flipkart dock security inspect your GST certificate. If the FC address is missing from your APOB list, your truck is turned away and stock is returned at your expense.'
              },
              {
                trigger: 'Seller Central',
                title: 'Payout Holds & Deactivation',
                desc: 'Marketplace automated audit bots cross-check tax records. Unlinked FC storage triggers account holds and listing deactivations across that state node.'
              },
              {
                trigger: 'Section 125 CGST Act',
                title: '₹25,000 General Penalty',
                desc: 'Operating from an unlisted business location attracts a mandatory statutory penalty of up to ₹25,000 per state registration under Section 125.'
              },
              {
                trigger: 'Sections 35 & 122',
                title: 'Stock Detention & Confiscation',
                desc: 'Goods stored in an undeclared warehouse are legally classified as unaccounted inventory. Tax officers can detain stock u/s 129 and levy 100% tax penalty.'
              },
              {
                trigger: 'Input Tax Credit',
                title: 'ITC Contestation at Scrutiny',
                desc: 'Input tax credit on Amazon/Flipkart marketplace fee invoices and warehousing charges becomes contestable during GST audit scrutiny if the FC is unlisted.'
              }
            ].map((risk, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-700 vpob-mono mb-2">{risk.trigger}</div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{risk.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{risk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* L. H2: VPOB AND APOB, ANSWERED HONESTLY (#faq) */}
      <section id="faq" className="py-16 bg-white border-b border-gray-200/80 scroll-mt-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              VPOB and APOB, answered honestly
            </h2>
            <p className="text-base text-gray-600">
              Direct, unedited compliance answers to the most critical marketplace seller questions.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: '1. What is the difference between VPOB and APOB?',
                a: 'VPOB (Virtual Place of Business) is the principal registered address in a state used to obtain a state GSTIN via Form REG-01. APOB (Additional Place of Business) is the marketplace warehouse (such as Amazon FBA or Flipkart FC) added to your GST certificate via Form REG-14 core amendment. VPOB creates the registration; APOB attaches the inventory storage location.'
              },
              {
                q: '2. Is a virtual place of business legal for GST registration?',
                a: 'Yes. Under Rules 8 and 9 of the CGST Rules 2017, there is no requirement to own physical property to register for GST. Tax authorities permit registration on rented commercial premises provided valid proof of occupancy—such as a notarised consent/lease agreement, property owner NOC, and recent utility bill—is submitted.'
              },
              {
                q: '3. Do I need a separate GSTIN for every state I store stock in?',
                a: 'Yes. Under Section 24(ix) read with Section 25 of the CGST Act 2017, storing inventory in a state creates a taxable presence. Because GST is a destination-based consumption tax, stocking goods in an Amazon FBA or Flipkart FC in Karnataka, Maharashtra, or Haryana requires a distinct State GSTIN for that state.'
              },
              {
                q: '4. Is adding an APOB a core or non-core field amendment?',
                a: 'Adding a warehouse as an Additional Place of Business is a core field amendment under Form REG-14. Core field amendments alter key structural details of your GST registration and require formal review and approval by the jurisdictional GST officer.'
              },
              {
                q: '5. How long does the whole process take?',
                a: 'The complete end-to-end process typically takes 3 to 5 weeks per state. Obtaining the VPOB document kit takes 24 to 48 hours, State GSTIN issuance under Form REG-01 takes 7 to 12 working days, and the Form REG-14 APOB amendment takes an additional 5 to 10 working days after GSTIN generation.'
              },
              {
                q: '6. Can I add more than one FC in the same state?',
                a: 'Yes. You can add multiple fulfilment centres within the same state under a single State GSTIN. FlashSpace includes additional FC additions within the same state at no extra fee under your annual plan.'
              },
              {
                q: '7. Will a GST officer physically visit the VPOB address?',
                a: 'Physical verification frequency varies by state. Tax authorities in states like Karnataka and Maharashtra initiate physical verification visits in approximately 65–75% of new VPOB registrations, whereas states like Delhi or Telangana have lower visit rates. FlashSpace provides on-ground staff at every VPOB address to receive visiting officers and present original documents.'
              },
              {
                q: '8. Is VPOB affordable in India?',
                a: 'Yes. FlashSpace provides very affordable, transparent all-inclusive bundles that cover virtual office lease documents, Form REG-01 State GSTIN filing, Form REG-14 APOB amendment filing, physical verification support, and query resolution.'
              },
              {
                q: '9. What happens to my GSTIN if I stop selling in that state?',
                a: 'If you cease storing inventory or selling in a state, you must file Form REG-16 to officially surrender and cancel that state GSTIN. Never allow a registration to lapse silently, as unfiled monthly GSTR-1 and GSTR-3B returns accrue late fees under Section 47 up to Rs 5,000 per return.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-gray-200 rounded-2xl bg-[#FAF9F6] overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-gray-900 text-sm flex items-center justify-between gap-4 hover:bg-gray-100/80 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-gray-700 leading-relaxed border-t border-gray-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Vpob;
