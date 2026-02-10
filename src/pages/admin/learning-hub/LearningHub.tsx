import React, { useState } from 'react';
import FAQSection from '@/components/FAQsection';
import { BookOpen, HelpCircle, Users, ShieldAlert, MonitorPlay, ChevronRight, Sparkles, PlayCircle, FileText, X, CheckCircle, XCircle, Lightbulb, MessageCircle, Quote, CornerDownRight, Target, AlertTriangle, FileWarning } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

// --- Sub-components ---

const ProductTraining = () => {
    const [selectedArticle, setSelectedArticle] = useState<any>(null);

    // Mock data for product training
    const articles = [
        {
            id: '1',
            title: 'Virtual Office Explained',
            category: 'Virtual Office',
            color: 'bg-blue-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">What is a Virtual Office?</h4>
                        <p className="text-gray-600 leading-relaxed">
                            A Virtual Office allows businesses to register, operate, and receive official correspondence using a premium commercial address while working remotely or from any location.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">What the Client Receives</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Commercial business address</li>
                            <li>Mail & courier handling</li>
                            <li>Address proof for GST, MCA & banks</li>
                            <li>No Objection Certificate (NOC)</li>
                            <li>Service agreement</li>
                            <li>Optional meeting room access</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Use Cases</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                'Business registration',
                                'GST registration',
                                'Market expansion',
                                'Professional branding',
                                'Compliance requirements'
                            ].map((item, idx) => (
                                <div key={idx} className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700 font-medium border border-gray-100">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Ideal Customer Profile</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Startups & founders</li>
                            <li>Freelancers</li>
                            <li>Consultants</li>
                            <li>Remote-first companies</li>
                            <li>International businesses entering India</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Key Selling Points</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                'Zero office setup cost',
                                'No long-term lock-in',
                                'Faster business registration',
                                'Legally compliant address'
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                    <Sparkles className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Virtual Office vs Traditional Office</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h5 className="font-bold text-blue-900 mb-2 text-center text-sm uppercase tracking-wide">Virtual Office</h5>
                                <ul className="space-y-2 text-sm text-blue-800">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" /> Low cost</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" /> No lease</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" /> Fast setup</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" /> Flexible</li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h5 className="font-bold text-gray-900 mb-2 text-center text-sm uppercase tracking-wide">Traditional Office</h5>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500 flex-shrink-0" /> High rent</li>
                                    <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500 flex-shrink-0" /> Long lock-in</li>
                                    <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500 flex-shrink-0" /> Setup cost</li>
                                    <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500 flex-shrink-0" /> Maintenance overhead</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-center font-medium italic border border-blue-100">
                            Sales Angle: “Why pay for space you don’t sit in?”
                        </div>
                    </section>

                    <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">Internal Sales Tip</h4>
                                <p className="text-gray-700 italic">
                                    Always clarify purpose first:
                                    <br />
                                    <span className="font-semibold">“Is this for GST, company registration, or address proof?”</span>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: '2',
            title: 'Coworking Space Tiers',
            category: 'Coworking',
            color: 'bg-cyan-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">What is a Coworking Space?</h4>
                        <p className="text-gray-600 leading-relaxed">
                            A shared, fully-managed workspace offering desks, cabins, and office facilities without long-term lease commitments.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Desk Types</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { name: 'Hot Desk', desc: 'Flexible seating' },
                                { name: 'Dedicated Desk', desc: 'Fixed personal desk' },
                                { name: 'Private Office', desc: 'Enclosed team cabin' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="h-2 w-2 rounded-full bg-cyan-500" />
                                    <div>
                                        <span className="font-semibold text-gray-900">{item.name}</span>
                                        <span className="text-gray-500 text-sm ml-2">– {item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">What’s Included</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                'High-speed internet',
                                'Electricity',
                                'Housekeeping',
                                'Security',
                                'Pantry access'
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                    <Sparkles className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Ideal For</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Startups', 'Small teams', 'Remote employees', 'Freelancers'].map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </section>

                    <section className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-cyan-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">Sales Angle</h4>
                                <p className="text-gray-700 italic font-medium">
                                    “Pay only for workspace — not maintenance, setup, or long leases.”
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="pt-6 border-t border-gray-100">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="p-1 bg-cyan-100 rounded text-cyan-600">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            Coworking Pricing Structure
                        </h4>

                        <div className="grid gap-6">
                            <div>
                                <h5 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">Pricing Model</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        'Monthly subscriptions',
                                        'Location-based pricing',
                                        'Desk-type-based pricing'
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700 border border-gray-100 font-medium text-center">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h5 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">What Influences Price</h5>
                                <div className="flex flex-wrap gap-2">
                                    {['City & locality', 'Desk type', 'Amenities', 'Demand'].map((tag, idx) => (
                                        <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">Internal Tip</h4>
                                        <p className="text-gray-700 italic font-medium">
                                            Always recommend <span className="font-bold text-gray-900">Dedicated Desk</span> for clients working 5+ days/week.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: '3',
            title: 'Meeting Room Booking Process',
            category: 'Meeting Rooms',
            color: 'bg-emerald-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Meeting Room Booking Explained</h4>
                        <p className="text-gray-600 leading-relaxed">
                            On-demand professional meeting spaces available by the hour or day.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Use Cases</h4>
                        <div className="flex flex-wrap gap-2">
                            {[
                                'Client meetings',
                                'Investor pitches',
                                'Interviews',
                                'Team discussions'
                            ].map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-gray-700 border-gray-200 bg-gray-50">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Booking Process</h4>
                        <div className="space-y-3">
                            {[
                                'Select location',
                                'Choose time slot',
                                'Confirm booking',
                                'Access details shared via email'
                            ].map((step, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                    </div>
                                    <span className="text-gray-700 font-medium">{step}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">What’s Included</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                'Whiteboard',
                                'WiFi',
                                'Reception support'
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                    <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">Upsell Trigger</h4>
                                <p className="text-gray-700 italic font-medium mb-1">
                                    Whenever client mentions:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {['Investors', 'Presentations', 'Clients'].map((trigger, idx) => (
                                        <span key={idx} className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-100">
                                            {trigger}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },

        {
            id: '4',
            title: 'Business Registration Support',
            category: 'Services',
            color: 'bg-purple-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Business Registration Services</h4>
                        <p className="text-gray-600 leading-relaxed">
                            Expert assistance in registering your business entity with complete documentation support.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Supported Registrations</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                'Private Limited',
                                'LLP (Limited Liability Partnership)',
                                'OPC (One Person Company)',
                                'Partnership Firm',
                                'Proprietorship'
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                                    <span className="font-semibold text-gray-800 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">What We Assist With</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                'Address documentation',
                                'NOC issuance',
                                'Rent Agreement',
                                'Registration coordination'
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                    <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">Important Clarification</h4>
                                <p className="text-gray-700 italic font-medium">
                                    FlashSpace provides <span className="font-semibold text-gray-900">address & documentation support</span>, not legal filing services itself.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: '5',
            title: 'GST Registration Support',
            category: 'Compliance',
            color: 'bg-orange-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">How Virtual Office Helps GST</h4>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Provides valid GST address for registration</li>
                            <li>Supplies all required documentation</li>
                            <li>Supports physical verification visits by tax authorities</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Documents Provided</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                'No Objection Certificate (NOC)',
                                'Rent Agreement',
                                'Utility Bill (Electricity/Water)'
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-100 text-center h-full">
                                    <Sparkles className="w-5 h-5 text-orange-500 mb-2" />
                                    <span className="font-semibold text-gray-800 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-red-900 text-sm uppercase tracking-wide mb-1">Internal Warning</h4>
                                <p className="text-red-700 italic font-medium">
                                    <span className="font-bold">Never guarantee GST approval</span> — final approval lies solely with the tax authorities.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Product Training Modules</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                    <motion.div key={article.id} variants={itemVariants} whileHover={{ y: -5 }} className="cursor-pointer">
                        <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all overflow-hidden group flex flex-col">
                            <div className={`h-2 w-full ${article.color}`} />
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="mb-2 bg-gray-100/80 hover:bg-gray-200">{article.category}</Badge>
                                    <div className={`p-2 rounded-full bg-gray-50 group-hover:bg-${article.color}/10 transition-colors`}>
                                        <FileText className={`h-4 w-4 text-gray-400 group-hover:text-${article.color}`} />
                                    </div>
                                </div>
                                <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {article.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-end">
                                <p className="text-sm text-gray-500 mb-6">Master this topic with our comprehensive guide.</p>
                                <div className="flex justify-between items-center text-xs font-medium text-gray-400 border-t pt-4 mt-auto">
                                    <button
                                        onClick={() => setSelectedArticle(article)}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors group/btn"
                                    >
                                        Read Now <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Detailed Article Popup */}
            <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] p-0 flex flex-col bg-white border-0 shadow-2xl rounded-2xl overflow-hidden gap-0">
                    <div className={`h-3 w-full shrink-0 ${selectedArticle?.color || 'bg-blue-500'}`} />

                    <div
                        className="flex-1 overflow-y-auto p-6 pt-4 overscroll-contain scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                        data-lenis-prevent
                    >
                        <DialogHeader className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                                    {selectedArticle?.category}
                                </Badge>
                            </div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                                {selectedArticle?.title}
                            </DialogTitle>
                            <DialogDescription>
                                comprehensive guide
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-2 text-gray-800">
                            {selectedArticle?.content}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};


const ObjectionHandling = () => {
    const objections = [
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

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-indigo-100 rounded-xl">
                    <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Objection Playbook</h2>
                    <p className="text-gray-500 text-sm">Handle resistance calmly, confidently, and consistently</p>
                </div>
            </div>

            {/* Objections List */}
            <div className="grid gap-4">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {objections.map((obj) => (
                        <AccordionItem key={obj.id} value={obj.id} className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden px-0">
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                        {obj.id.replace('o', '')}
                                    </span>
                                    <span className="font-semibold text-gray-800 text-lg">“{obj.title}”</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 pt-2 bg-gray-50/50">
                                <div className="space-y-6">
                                    {/* Insight */}
                                    <div className="flex items-start gap-3 text-gray-600 italic border-l-4 border-indigo-200 pl-3">
                                        <Lightbulb className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                                        <span>What they really mean: <span className="font-semibold text-gray-800 not-italic">{obj.insight}</span></span>
                                    </div>

                                    {/* Suggested Response */}
                                    <div className="relative">
                                        <div className="absolute -top-3 -left-2 text-indigo-200">
                                            <Quote className="w-8 h-8 fill-current opacity-50" />
                                        </div>
                                        <div className="bg-indigo-600 text-white p-5 rounded-tr-xl rounded-br-xl rounded-bl-xl ml-2 shadow-md relative z-10">
                                            <p className="font-medium text-lg leading-relaxed">"{obj.response}"</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* Winning Tactics */}
                                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="flex items-center gap-2 font-bold text-xs text-green-600 uppercase tracking-wider mb-3">
                                                <Target className="w-4 h-4" /> Winning Tactics
                                            </h4>
                                            <ul className="space-y-2">
                                                {obj.tactics.map((tactic, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                                        {tactic}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Follow Up */}
                                        {obj.followup && (
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                                                <h4 className="flex items-center gap-2 font-bold text-blue-600 text-xs uppercase tracking-wider mb-3">
                                                    <CornerDownRight className="w-4 h-4" /> Recommended Follow-up
                                                </h4>
                                                <div className="flex gap-3">
                                                    <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                                    <p className="text-sm text-blue-900 font-medium italic">"{obj.followup}"</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Golden Rules & Takeaway */}
            <div className="grid md:grid-cols-12 gap-6 mt-8">
                {/* Golden Rules */}
                <Card className="md:col-span-7 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Sparkles className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl text-yellow-400">
                            <Sparkles className="w-5 h-5" />
                            Golden Rules
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-green-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Always Do
                                </h4>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    <li>Listen fully</li>
                                    <li>Acknowledge concern</li>
                                    <li>Respond calmly</li>
                                    <li>Ask clarifying questions</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> Never Do
                                </h4>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    <li>Argue</li>
                                    <li>Overpromise</li>
                                    <li>Badmouth competitors</li>
                                    <li>Rush the client</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Final Takeaway */}
                <Card className="md:col-span-5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 shadow-xl flex flex-col justify-center text-center p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10">
                        <Quote className="w-10 h-10 mx-auto mb-4 text-white/30 fill-current" />
                        <h3 className="text-lg font-medium text-indigo-100 uppercase tracking-widest mb-2">Final Takeaway</h3>
                        <p className="text-2xl font-bold leading-tight">
                            "An objection is <span className="text-yellow-400">interest</span> in disguise."
                        </p>
                        <p className="mt-4 text-sm text-indigo-200">
                            If handled right, it increases trust and conversion.
                        </p>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

const Troubleshooting = () => {
    const issues = [
        {

            title: 'Booking Payment Failed',
            what: 'Client attemped payment but received an error.',
            reasons: ['Bank declined transaction', 'UPI timeout', 'International transactions disabled', 'Gateway outage'],
            fix: 'Ask client to try a different card or UPI. Confirm international transactions are enabled. Retry after 5–10 mins.',
            escalate: 'Tech Support',
            bad: '“It’s a system problem” or “Try later” without guidance',
            highFreq: true
        },
        {

            title: 'Client Not Receiving Emails',
            what: 'Client did not receive welcome email or documents.',
            reasons: ['Landed in spam/junk', 'Incorrect email entered', 'Provider blocking system emails'],
            fix: 'Ask client to check spam/junk. Verify email spelling in dashboard. Resend from admin panel.',
            escalate: 'Admin / Tech Team',
            highFreq: true
        },
        {

            title: 'KYC Status Showing Pending',
            what: 'Client completed KYC, but status hasn’t changed.',
            reasons: ['Documents under review', 'Missing or unclear documents', 'Admin verification pending'],
            fix: 'Inform client review takes 24–48 hours. Verify documents are uploaded and clear.',
            escalate: 'Admin (KYC Team)',
            condition: 'if delayed beyond SLA'
        },
        {

            title: 'KYC Rejected',
            what: 'Client’s KYC documents were rejected.',
            reasons: ['Blurred/unclear documents', 'Mismatch in details', 'Expired or invalid documents'],
            fix: 'Explain rejection reason clearly. Request re-upload of correct documents in proper format.',
            escalate: 'Admin',
            condition: 'only if rejection reason is unclear'
        },
        {

            title: 'GST Registration Not Approved',
            what: 'Client’s GST application was rejected.',
            reasons: ['Incomplete documents', 'Address verification issue', 'Mismatch in details'],
            fix: 'Review documents with client. Ensure correct address usage. Suggest reapplication.',
            escalate: 'Admin / Compliance Team',
            note: 'GST approval is handled by government authorities.'
        },
        {

            title: 'Client Says Address Is Invalid',
            what: 'Client doubts the validity of the provided address.',
            reasons: ['Misinformation', 'Bank/vendor confusion', 'Misunderstanding of virtual offices'],
            fix: 'Reassure commercial approval. Offer sample documents. Explain compliance usage.',
            escalate: 'Admin',
            condition: 'if external verification fails'
        },
        {

            title: 'Mail Not Received or Delayed',
            what: 'Client claims mail or courier is missing.',
            reasons: ['Courier delay', 'Incorrect sender details', 'Forwarding pending'],
            fix: 'Check mail log. Confirm forwarding preference. Inform expected timeline.',
            escalate: 'Operations Team',
            condition: 'if mail not logged'
        },
        {

            title: 'Client Unable to Download Documents',
            what: 'Document download link not working.',
            reasons: ['Expired link', 'Browser issues', 'Access permissions'],
            fix: 'Ask client to try another browser. Regenerate link. Resend via email.',
            escalate: 'Tech Support',
            condition: 'if issue persists'
        },
        {

            title: 'Booking Status Not Updating',
            what: 'Booking shows pending despite payment/KYC completion.',
            reasons: ['Backend sync delay', 'Admin approval pending'],
            fix: 'Refresh dashboard. Confirm payment & KYC status. Inform client of processing time.',
            escalate: 'Admin / Tech Team',
            condition: 'if delay exceeds SLA'
        },
        {

            title: 'Client Wants to Cancel Booking',
            what: 'Client requested cancellation.',
            reasons: [],
            fix: 'Explain cancellation policy clearly. Inform refund eligibility. Guide to support ticket.',
            escalate: 'Admin / Billing Team',
            condition: 'for refund processing'
        },
        {

            title: 'Client Complains About Support Delay',
            what: 'Client feels response time is slow.',
            reasons: [],
            fix: 'Acknowledge delay. Provide realistic timeline. Follow up internally.',
            escalate: 'Support Lead',
            condition: 'if SLA breached'
        },
        {

            title: 'Client Asking for Out of Scope Services',
            what: 'Client expects legal, tax, or accounting services.',
            reasons: [],
            fix: 'Clarify scope of services. Explain FlashSpace offerings. Redirect to professionals.',
            escalate: 'No escalation needed',
            noEscalation: true
        }
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-red-100 rounded-xl">
                    <ShieldAlert className="h-6 w-6 text-red-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Issues & Troubleshooting</h2>
                    <p className="text-gray-500 text-sm">Resolve client issues quickly and reduce escalations</p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {issues.map((issue) => (
                    <motion.div key={issue.id} variants={itemVariants}>
                        <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group overflow-hidden">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm text-red-500 font-bold text-xs uppercase">
                                            {issue.id}
                                        </div>
                                        <CardTitle className="text-lg font-bold text-gray-800 leading-tight">
                                            {issue.title}
                                        </CardTitle>
                                    </div>
                                    {issue.highFreq && (
                                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 shrink-0">
                                            High Freq
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription className="mt-2 text-gray-600">
                                    <span className="font-semibold text-gray-700">What Happened:</span> {issue.what}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pt-6 space-y-4">
                                {/* Reasons */}
                                {issue.reasons.length > 0 && (
                                    <div className="text-sm">
                                        <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider block mb-2">Possible Reasons</span>
                                        <ul className="grid grid-cols-1 gap-1">
                                            {issue.reasons.map((r, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-gray-600">
                                                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Quick Fix */}
                                <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                                    <h4 className="flex items-center gap-2 font-bold text-xs text-green-700 uppercase tracking-wider mb-2">
                                        <CheckCircle className="w-3.5 h-3.5" /> Quick Fix
                                    </h4>
                                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                                        {issue.fix}
                                    </p>
                                </div>

                                {/* Escalation */}
                                <div className={`flex items-start gap-3 p-3 rounded-lg border ${issue.noEscalation ? 'bg-gray-50 border-gray-100' : 'bg-red-50 border-red-100'}`}>
                                    {issue.noEscalation ? (
                                        <CheckCircle className="w-4 h-4 text-gray-500 mt-0.5" />
                                    ) : (
                                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                                    )}
                                    <div className="text-sm">
                                        <span className={`font-bold block ${issue.noEscalation ? 'text-gray-700' : 'text-red-700'}`}>
                                            Escalate to: {issue.escalate}
                                        </span>
                                        {issue.condition && (
                                            <span className="text-xs text-gray-500 block mt-0.5">({issue.condition})</span>
                                        )}
                                    </div>
                                </div>

                                {/* Warnings/Notes */}
                                {issue.bad && (
                                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded border border-red-100">
                                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                                        <span className="font-medium">Avoid Saying: {issue.bad}</span>
                                    </div>
                                )}
                                {issue.note && (
                                    <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded border border-blue-100">
                                        <FileText className="w-3.5 h-3.5 shrink-0" />
                                        <span className="font-medium">{issue.note}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Golden Rules & Final Takeaway */}
            <div className="grid md:grid-cols-12 gap-6 mt-6">
                <Card className="md:col-span-8 bg-gray-900 text-white border-0 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <ShieldAlert className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl text-yellow-400">
                            <Sparkles className="w-5 h-5" />
                            Escalation Golden Rules
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-8 relative z-10">
                        <div>
                            <h4 className="font-bold text-red-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Escalate When
                            </h4>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Issue repeats twice</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> SLA breached</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Client is frustrated</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Compliance concern</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-green-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Do NOT Escalate When
                            </h4>
                            <ul className="space-y-2 text-gray-300 text-sm">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Issue has a documented fix</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Client hasn't followed instructions</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Issue is informational</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-4 bg-gradient-to-br from-red-600 to-red-700 text-white border-0 shadow-xl flex flex-col justify-center text-center p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10">
                        <ShieldAlert className="w-10 h-10 mx-auto mb-4 text-white/30" />
                        <h3 className="text-lg font-medium text-red-100 uppercase tracking-widest mb-2">Final Takeaway</h3>
                        <p className="text-xl font-bold leading-tight mb-2">
                            Quick fixes build <span className="text-yellow-400">trust</span>.
                        </p>
                        <p className="text-lg font-bold leading-tight text-red-100">
                            Clear escalation prevents <span className="text-white">chaos</span>.
                        </p>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

const SalesWalkthrough = () => {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <MonitorPlay className="h-6 w-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">Portal Mastery</h2>
            </div>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        Daily Sales Workflow
                    </CardTitle>
                    <CardDescription className="text-gray-400">Your step-by-step routine for maximum productivity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative border-l border-gray-700 ml-4 space-y-8 my-6">
                        {[
                            { title: 'Morning Review', text: 'Check your dashboard for new leads assigned overnight. Review "High Priority" queries.' },
                            { title: 'Follow Ups', text: 'Go to "Clients" tab. Filter by "In Progress". Call clients who haven\'t completed documentation.' },
                            { title: 'Update Status', text: 'Always update the client status after a call. Add notes in the "Notes" tab for every interaction.' }
                        ].map((step, idx) => (
                            <motion.div key={idx} variants={itemVariants} className="ml-8 relative">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full -left-12 text-black font-bold ring-4 ring-gray-800">
                                    {idx + 1}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-gray-300 leading-relaxed max-w-2xl">{step.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};


// --- Main Component ---

const LearningHub = () => {
    const [activeTab, setActiveTab] = useState('product');

    const modules = [
        { id: 'product', title: 'Product', icon: BookOpen, color: 'text-blue-600', gradient: 'from-blue-50 to-blue-100' },
        { id: 'faq', title: 'FAQs', icon: HelpCircle, color: 'text-green-600', gradient: 'from-green-50 to-green-100' },
        { id: 'objection', title: 'Objections', icon: Users, color: 'text-indigo-600', gradient: 'from-indigo-50 to-indigo-100' },
        { id: 'issue', title: 'Issues', icon: ShieldAlert, color: 'text-red-600', gradient: 'from-red-50 to-red-100' },
        { id: 'walkthrough', title: 'Guide', icon: MonitorPlay, color: 'text-yellow-600', gradient: 'from-yellow-50 to-yellow-100' },
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* Hero Header */}
            <div className="relative rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 mb-8 shadow-2xl overflow-hidden mx-1">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Sparkles className="w-64 h-64 text-white" />
                </div>

                <div className="relative z-10 max-w-3xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
                    >
                        Sales Knowledge Hub
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-indigo-100 text-lg md:text-xl mb-4 leading-relaxed max-w-xl"
                    >
                        Your ultimate resource for product mastery, objection handling, and operational excellence.
                    </motion.p>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-8">
                {/* Modern Tabs */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-1">
                    {modules.map((m) => {
                        const Icon = m.icon;
                        const isActive = activeTab === m.id;
                        return (
                            <motion.div
                                key={m.id}
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActiveTab(m.id)}
                                className={`relative cursor-pointer rounded-2xl p-4 transition-all overflow-hidden ${isActive ? 'shadow-lg ring-2 ring-offset-2 ring-indigo-500' : 'bg-white shadow-sm hover:shadow-md border border-gray-100'}`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabBg"
                                        className={`absolute inset-0 bg-gradient-to-br ${m.gradient}`}
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <div className="relative z-10 flex flex-col items-center text-center gap-3">
                                    <div className={`p-3 rounded-xl ${isActive ? 'bg-white/80 backdrop-blur' : 'bg-gray-50'} transition-colors`}>
                                        <Icon className={`h-6 w-6 ${isActive ? m.color : 'text-gray-400'}`} />
                                    </div>
                                    <span className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {m.title}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {activeTab === 'product' && <ProductTraining />}
                            {activeTab === 'faq' && <FAQSection />}
                            {activeTab === 'objection' && <ObjectionHandling />}
                            {activeTab === 'issue' && <Troubleshooting />}
                            {activeTab === 'walkthrough' && <SalesWalkthrough />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LearningHub;
