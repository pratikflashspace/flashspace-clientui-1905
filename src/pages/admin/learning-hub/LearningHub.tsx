import React, { useState } from 'react';
import FAQSection from '@/components/FAQsection';
import { BookOpen, HelpCircle, Users, ShieldAlert, MonitorPlay, ChevronRight, Sparkles, PlayCircle, FileText, X, CheckCircle, XCircle, Lightbulb, MessageCircle, Quote, CornerDownRight, Target, AlertTriangle, FileWarning, Headphones, Clock, Info, Monitor, Shield, Settings, DollarSign } from 'lucide-react';
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
import {
    SALES_OBJECTIONS, SALES_ISSUES, SALES_GUIDE_STEPS, SALES_FAQS,
    SUPPORT_OBJECTIONS, SUPPORT_ISSUES, SUPPORT_GUIDE_STEPS, SUPPORT_FAQS,
    SALES_OBJECTION_RULES, SUPPORT_OBJECTION_RULES,
    SALES_TROUBLESHOOTING_RULES, SUPPORT_TROUBLESHOOTING_RULES
} from './learning-hub-data';

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

const ProductTraining = ({ articles }: { articles: any[] }) => {
    const [selectedArticle, setSelectedArticle] = useState<any>(null);

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Training Modules</h2>
            </div>

            {articles.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No training modules available for this hub yet.</p>
                </div>
            ) : (
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
            )}

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


const ObjectionHandling = ({ objections, rules }: { objections: any[], rules: any }) => {
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
            {objections.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No objection scenarios available.</p>
                </div>
            ) : (
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
                                                    <Target className="w-4 h-4" /> Action Steps
                                                </h4>
                                                <ul className="space-y-2">
                                                    {obj.tactics.map((tactic: string, idx: number) => (
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
            )}

            {/* Golden Rules */}
            {/* Golden Rules */}
            <div className="grid md:grid-cols-12 gap-6 mt-8">
                <Card className="md:col-span-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0 shadow-xl overflow-hidden relative">
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
                                    {rules.golden.always.map((rule: string, idx: number) => (
                                        <li key={idx}>{rule}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-red-400 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> Never Do
                                </h4>
                                <ul className="space-y-2 text-gray-300 text-sm">
                                    {rules.golden.never.map((rule: string, idx: number) => (
                                        <li key={idx}>{rule}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div >
    );
};

const Troubleshooting = ({ issues, rules }: { issues: any[], rules?: any }) => {
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
            {issues.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No issues recorded yet.</p>
                </div>
            ) : (
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
                                                {issue.reasons.map((r: string, idx: number) => (
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
            )}

            {/* Support Rules Section */}
            {rules && (
                <div className="grid md:grid-cols-12 gap-6 mt-8">
                    {/* Priority Matrix */}
                    <Card className="md:col-span-7 border-0 shadow-lg bg-white overflow-hidden">
                        <CardHeader className="bg-red-50 border-b border-red-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg text-red-700">
                                <AlertTriangle className="w-5 h-5" />
                                Priority Matrix
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-2 divide-x divide-gray-100">
                                <div className="p-4 space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Critical (Immediate)</h4>
                                        <ul className="space-y-1">
                                            {rules.priority.critical.map((item: string, idx: number) => (
                                                <li key={idx} className="text-sm text-red-600 font-medium flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">High Priority</h4>
                                        <ul className="space-y-1">
                                            {rules.priority.high.map((item: string, idx: number) => (
                                                <li key={idx} className="text-sm text-orange-600 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4 bg-gray-50/50">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Medium Priority</h4>
                                        <ul className="space-y-1">
                                            {rules.priority.medium.map((item: string, idx: number) => (
                                                <li key={idx} className="text-sm text-blue-600 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Low Priority</h4>
                                        <ul className="space-y-1">
                                            {rules.priority.low.map((item: string, idx: number) => (
                                                <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Golden Rules */}
                    <Card className="md:col-span-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Shield className="w-24 h-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg text-yellow-400">
                                <Sparkles className="w-5 h-5" />
                                Golden Rules
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <ul className="space-y-3">
                                {rules.golden.map((rule: string, idx: number) => (
                                    <li key={idx} className="flex items-center gap-3 text-gray-200">
                                        <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            )}
        </motion.div>
    );
};

const GuideSection = ({ steps }: { steps: any[] }) => {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <MonitorPlay className="h-6 w-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">Portal Mastery</h2>
            </div>
            {steps.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No guides available yet.</p>
                </div>
            ) : (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            Daily Workflow
                        </CardTitle>
                        <CardDescription className="text-gray-400">Your step-by-step routine for maximum productivity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative border-l border-gray-700 ml-4 space-y-8 my-6">
                            {steps.map((step, idx) => (
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
            )}
        </motion.div>
    );
};


// --- Main Component ---

const LearningHub = () => {
    const [activeTab, setActiveTab] = useState('product');
    const [activeHub, setActiveHub] = useState<'sales' | 'support'>('sales');

    const modules = [
        { id: 'product', title: 'Product', icon: BookOpen, color: 'text-blue-600', gradient: 'from-blue-50 to-blue-100' },
        { id: 'faq', title: 'FAQs', icon: HelpCircle, color: 'text-green-600', gradient: 'from-green-50 to-green-100' },
        { id: 'objection', title: 'Objections', icon: Users, color: 'text-indigo-600', gradient: 'from-indigo-50 to-indigo-100' },
        { id: 'issue', title: 'Issues', icon: ShieldAlert, color: 'text-red-600', gradient: 'from-red-50 to-red-100' },
        { id: 'walkthrough', title: 'Guide', icon: MonitorPlay, color: 'text-yellow-600', gradient: 'from-yellow-50 to-yellow-100' },
    ];

    // Hardcoded complex content content for Sales Product Training for now
    // In a future refactor, this could be moved to a separate file if we can import JSX
    const SALES_PRODUCT_ARTICLES = [
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

    const SUPPORT_PRODUCT_ARTICLES = [
        {
            id: 's1',
            title: 'Virtual Office – Support Overview',
            category: 'Virtual Office',
            color: 'bg-blue-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">What a Virtual Office Is</h4>
                        <p className="text-gray-600 leading-relaxed">
                            A Virtual Office provides a legally valid commercial address for business registration, GST, and official communication without physical office rental.
                        </p>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">What the Client Receives</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Commercial business address</li>
                            <li>NOC (No Objection Certificate)</li>
                            <li>Service Agreement</li>
                            <li>Address proof documentation</li>
                            <li>Mail handling (as per plan)</li>
                            <li>Optional meeting room access</li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">When Support Gets Involved</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Client not received documents</li>
                            <li>Client confusion about address validity</li>
                            <li>GST officer verification query</li>
                            <li>Mail handling concerns</li>
                            <li>Plan clarification</li>
                        </ul>
                    </section>
                    <section className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wide mb-1">Important Clarifications</h4>
                                <ul className="text-blue-800 text-sm space-y-1">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> We provide address and documentation support.</li>
                                    <li className="flex items-center gap-2"><XCircle className="w-3.5 h-3.5" /> We do NOT provide legal or tax advisory.</li>
                                    <li className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> GST approval is handled by authorities, not us.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: 's2',
            title: 'Virtual Office Plans – Operational Understanding',
            category: 'Virtual Office',
            color: 'bg-indigo-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Plan Types</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {['GST Registration Plan', 'Business Registration Plan', 'Mailing Address Plan', 'Combo Plans'].map((item, idx) => (
                                <div key={idx} className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700 font-medium border border-gray-100">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">What Each Plan Typically Includes</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <h5 className="font-bold text-indigo-900 mb-2 text-sm uppercase tracking-wide">GST Plan</h5>
                                <ul className="space-y-1 text-sm text-indigo-800">
                                    <li>• GST-compliant address</li>
                                    <li>• NOC</li>
                                    <li>• Agreement</li>
                                    <li>• Utility bill (where applicable)</li>
                                </ul>
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <h5 className="font-bold text-indigo-900 mb-2 text-sm uppercase tracking-wide">Mailing Plan</h5>
                                <ul className="space-y-1 text-sm text-indigo-800">
                                    <li>• Mail receipt logging</li>
                                    <li>• Email notifications</li>
                                    <li>• Optional forwarding</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">Support Checklist</h4>
                                <p className="text-gray-700 text-sm mb-2">When Client Asks About Plan:</p>
                                <ul className="text-gray-700 text-sm space-y-1">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Confirm selected plan</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Confirm tenure (monthly/yearly)</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Confirm payment status</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Confirm document status</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: 's3',
            title: 'Coworking Spaces – Support Breakdown',
            category: 'Coworking',
            color: 'bg-cyan-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Desk Types</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Hot Desk', 'Dedicated Desk', 'Private Office'].map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-gray-700 border-gray-200 bg-gray-50">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">What Is Included</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {['Internet', 'Electricity', 'Maintenance', 'Access control', 'Pantry access'].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Common Support Queries</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Access timing issues</li>
                            <li>Billing clarification</li>
                            <li>Upgrade/downgrade requests</li>
                            <li>Facility complaints</li>
                        </ul>
                    </section>
                    <section className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-red-900 text-sm uppercase tracking-wide mb-1">Escalation Point</h4>
                                <p className="text-red-700 font-medium">
                                    Facility-related issues → <span className="font-bold">Operations Team</span>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: 's4',
            title: 'Meeting Rooms – Operational Flow',
            category: 'Meeting Rooms',
            color: 'bg-emerald-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Booking Process</h4>
                        <div className="space-y-3">
                            {['Client selects location', 'Chooses time slot', 'Booking confirmed', 'Email confirmation sent'].map((step, idx) => (
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
                        <h4 className="text-lg font-bold text-gray-900 mb-2">What Support Should Verify</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {['Date & time', 'Payment confirmation', 'Location', 'Access instructions sent'].map((item, idx) => (
                                <div key={idx} className="bg-emerald-50 px-3 py-2 rounded text-sm text-emerald-900 font-medium h-full flex items-center">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Common Issues</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Booking not reflecting</li>
                            <li>Wrong time slot</li>
                            <li>No confirmation email</li>
                        </ul>
                    </section>
                </div>
            )
        },
        {
            id: 's5',
            title: 'KYC & Compliance – Support Handling',
            category: 'Compliance',
            color: 'bg-orange-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Why KYC Is Required</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Regulatory compliance', 'Fraud prevention', 'Business verification'].map((tag, idx) => (
                                <div key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Required Documents</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>PAN</li>
                            <li>GST (if applicable)</li>
                            <li>ID proof</li>
                            <li>Business details</li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Support Responsibilities</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Check document upload status</li>
                            <li>Explain rejection reason clearly</li>
                            <li>Guide client for re-upload</li>
                        </ul>
                    </section>
                    <section className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-orange-600" />
                            <div>
                                <h4 className="font-bold text-orange-900 text-sm uppercase tracking-wide">SLA</h4>
                                <p className="text-orange-800 text-sm">KYC review typically takes 24–48 hours.</p>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: 's6',
            title: 'Document Issuance Process',
            category: 'Operations',
            color: 'bg-purple-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Documents Provided</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {['NOC', 'Service Agreement', 'Address Proof', 'Utility Bill (if applicable)'].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                    <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">When Documents Are Shared</h4>
                        <p className="text-gray-600">After:</p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Successful payment</li>
                            <li>Approved KYC</li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Common Issues & Quick Fixes</h4>
                        <div className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <span className="font-semibold text-gray-800 block text-sm">Issue: Client says documents not received</span>
                                <span className="text-green-600 text-sm flex items-center gap-1 mt-1"><CheckCircle className="w-3 h-3" /> Fix: Resend documents / Check spam</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <span className="font-semibold text-gray-800 block text-sm">Issue: Link expired</span>
                                <span className="text-green-600 text-sm flex items-center gap-1 mt-1"><CheckCircle className="w-3 h-3" /> Fix: Regenerate link</span>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: 's7',
            title: 'Mail Handling – Operational Process',
            category: 'Operations',
            color: 'bg-pink-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">How It Works</h4>
                        <div className="space-y-3">
                            {['Mail received at location', 'Logged by operations', 'Notification sent to client', 'Forwarded (if requested)'].map((step, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                    </div>
                                    <span className="text-gray-700 font-medium">{step}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Support Responsibilities</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Check mail log</li>
                            <li>Confirm forwarding request</li>
                            <li>Inform expected timeline</li>
                        </ul>
                    </section>
                    <section className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-red-900 text-sm uppercase tracking-wide mb-1">Escalation</h4>
                                <p className="text-red-700 font-medium">
                                    Missing mail → <span className="font-bold">Operations Team</span>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: 's8',
            title: 'Billing & Invoices – Support View',
            category: 'Finance',
            color: 'bg-teal-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Invoice Contains</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {['Booking number', 'Plan description', 'Subtotal', 'Tax', 'Total', 'Payment status'].map((item, idx) => (
                                <div key={idx} className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-700 border border-gray-100 text-center">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Support Should Verify</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Payment confirmation</li>
                            <li>Invoice generation</li>
                            <li>Status (Paid / Pending / Overdue)</li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Common Issues</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Payment deducted but status pending</li>
                            <li>Invoice not generated</li>
                            <li>Tax confusion</li>
                        </ul>
                    </section>
                </div>
            )
        },
        {
            id: 's9',
            title: 'Booking Lifecycle – Full Flow',
            category: 'Process',
            color: 'bg-blue-600',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Booking Statuses</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Pending Payment', 'Pending KYC', 'Active', 'Expired', 'Cancelled'].map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Support Actions by Status</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                <span className="font-semibold text-gray-800">Pending Payment</span>
                                <span className="text-sm text-gray-600">→ Guide payment retry</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                <span className="font-semibold text-gray-800">Pending KYC</span>
                                <span className="text-sm text-gray-600">→ Guide document submission</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                <span className="font-semibold text-gray-800">Active</span>
                                <span className="text-sm text-gray-600">→ Provide service-related assistance</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                <span className="font-semibold text-gray-800">Expired</span>
                                <span className="text-sm text-gray-600">→ Offer renewal guidance</span>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: 's10',
            title: 'Cancellation & Refund Policy',
            category: 'Policy',
            color: 'bg-red-500',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Cancellation Conditions</h4>
                        <p className="text-gray-600">Depends on:</p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Plan type</li>
                            <li>Service activation status</li>
                            <li>Usage stage</li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Support Role</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            <li>Explain policy clearly</li>
                            <li><span className="font-bold text-red-600">Avoid promising refunds</span></li>
                            <li>Escalate to Billing for approval</li>
                        </ul>
                    </section>
                </div>
            )
        },
        {
            id: 's11',
            title: 'Affiliate-Linked Bookings',
            category: 'Affiliate',
            color: 'bg-violet-500',
            content: (
                <div className="space-y-6">
                    <section className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-violet-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-violet-900 text-sm uppercase tracking-wide mb-1">Support Awareness</h4>
                                <p className="text-violet-800 text-sm mb-2">Affiliate tracking is internal.</p>
                                <ul className="text-violet-800 text-sm space-y-1">
                                    <li className="flex items-center gap-2"><XCircle className="w-3.5 h-3.5" /> Never discuss commission details</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> Focus only on client service</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: 's12',
            title: 'Escalation Matrix Overview',
            category: 'Escalation',
            color: 'bg-gray-800',
            content: (
                <div className="space-y-6">
                    <section>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Escalate To:</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Monitor className="w-4 h-4 text-blue-500" /> Tech Team</h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>Payment errors</li>
                                    <li>Portal glitches</li>
                                    <li>Login issues</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-purple-500" /> Admin</h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>KYC review delays</li>
                                    <li>Document inconsistencies</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Settings className="w-4 h-4 text-orange-500" /> Operations</h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>Mail handling</li>
                                    <li>Location access</li>
                                    <li>Facility issues</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> Billing</h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>Refund approval</li>
                                    <li>Payment discrepancies</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            )
        },
        {
            id: 's13',
            title: 'Tone & Communication Guidelines',
            category: 'Soft Skills',
            color: 'bg-yellow-500',
            content: (
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <h4 className="font-bold text-green-700 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Always
                            </h4>
                            <ul className="space-y-2 text-green-800 text-sm">
                                <li>Stay calm</li>
                                <li>Acknowledge concern</li>
                                <li>Give realistic timelines</li>
                                <li>Document interaction in CRM</li>
                            </ul>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                            <h4 className="font-bold text-red-700 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                                <XCircle className="w-4 h-4" /> Never
                            </h4>
                            <ul className="space-y-2 text-red-800 text-sm">
                                <li>Overpromise</li>
                                <li>Blame internal teams</li>
                                <li>Share internal notes</li>
                                <li>Discuss commission or backend data</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            {/* Hero Header */}
            <div className={`relative rounded-3xl p-8 md:p-12 mb-8 shadow-2xl overflow-hidden mx-1 transition-colors duration-500 ${activeHub === 'sales' ? 'bg-gradient-to-r from-violet-600 to-indigo-600' : 'bg-gradient-to-r from-cyan-600 to-teal-600'}`}>
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Sparkles className="w-64 h-64 text-white" />
                </div>

                <div className="absolute top-6 right-6 z-20 flex gap-4 bg-white/10 p-1.5 rounded-full backdrop-blur-sm border border-white/20">
                    <button
                        onClick={() => setActiveHub('sales')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${activeHub === 'sales' ? 'bg-white text-indigo-900 shadow-md' : 'text-white hover:bg-white/10'}`}
                    >
                        <Users className="w-4 h-4" /> Sales Hub
                    </button>
                    <button
                        onClick={() => setActiveHub('support')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${activeHub === 'support' ? 'bg-white text-teal-900 shadow-md' : 'text-white hover:bg-white/10'}`}
                    >
                        <Headphones className="w-4 h-4" /> Support Hub
                    </button>
                </div>


                <div className="relative z-10 max-w-3xl">
                    <motion.h1
                        key={activeHub}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
                    >
                        {activeHub === 'sales' ? 'Sales Knowledge Hub' : 'Support Learning Hub'}
                    </motion.h1>
                    <motion.p
                        key={`${activeHub}-desc`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-indigo-100 text-lg md:text-xl mb-4 leading-relaxed max-w-xl"
                    >
                        {activeHub === 'sales'
                            ? 'Your ultimate resource for product mastery, objection handling, and operational excellence.'
                            : 'Everything you need to troubleshoot issues, guide clients, and provide world-class support.'}
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
                            key={`${activeTab}-${activeHub}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {activeTab === 'product' && <ProductTraining articles={activeHub === 'sales' ? SALES_PRODUCT_ARTICLES : SUPPORT_PRODUCT_ARTICLES} />}
                            {activeTab === 'faq' && <FAQSection faqs={activeHub === 'sales' ? SALES_FAQS : SUPPORT_FAQS} />}
                            {activeTab === 'objection' && <ObjectionHandling objections={activeHub === 'sales' ? SALES_OBJECTIONS : SUPPORT_OBJECTIONS} rules={activeHub === 'sales' ? SALES_OBJECTION_RULES : SUPPORT_OBJECTION_RULES} />}
                            {activeTab === 'issue' && <Troubleshooting issues={activeHub === 'sales' ? SALES_ISSUES : SUPPORT_ISSUES} rules={activeHub === 'sales' ? SALES_TROUBLESHOOTING_RULES : SUPPORT_TROUBLESHOOTING_RULES} />}
                            {activeTab === 'walkthrough' && <GuideSection steps={activeHub === 'sales' ? SALES_GUIDE_STEPS : SUPPORT_GUIDE_STEPS} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LearningHub;
