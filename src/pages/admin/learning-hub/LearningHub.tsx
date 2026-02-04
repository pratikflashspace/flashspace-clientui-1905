import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { learningHubService } from '@/services/learning-hub.service';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, HelpCircle, Users, ShieldAlert, MonitorPlay, ChevronRight, Sparkles, PlayCircle, FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface SearchResult {
    id: string;
    type: string;
    title: string;
    content?: string;
    answer?: string;
    response?: string;
    description?: string;
}

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
    // Mock data for product training
    const articles = [
        { id: '1', title: 'Virtual Office Explained', update: '2 days ago', category: 'Virtual Office', color: 'bg-blue-500' },
        { id: '2', title: 'Coworking Space Tiers', update: '1 week ago', category: 'Coworking', color: 'bg-cyan-500' },
        { id: '3', title: 'Meeting Room Booking Process', update: '3 weeks ago', category: 'Meeting Rooms', color: 'bg-emerald-500' },
        { id: '4', title: 'Pricing Plans Overview', update: '1 month ago', category: 'General', color: 'bg-indigo-500' },
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
                        <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all overflow-hidden group">
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
                            <CardContent>
                                <p className="text-sm text-gray-500 mb-6">Master this topic with our comprehensive guide.</p>
                                <div className="flex justify-between items-center text-xs font-medium text-gray-400 border-t pt-4">
                                    <span>Updated {article.update}</span>
                                    <span className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                                        Read Now <ChevronRight className="h-3 w-3" />
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

const ClientFAQs = () => {
    const faqs = [
        { id: 'f1', q: 'Are there hidden fees?', a: 'No, all fees are transparently listed in the agreement. We prioritize clarity in all our contracts.', category: 'Pricing' },
        { id: 'f2', q: 'Can I use this address for GST?', a: 'Yes, provided you subscribe to the Virtual Office Plus plan which includes an NOC specifically for GST usage.', category: 'Legal' },
        { id: 'f3', q: 'How do I cancel my booking?', a: 'Cancellations can be made 24 hours prior via the user dashboard without any penalty.', category: 'Booking' },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg bg-white px-4 shadow-sm hover:shadow-md transition-shadow">
                                <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-green-600 hover:no-underline py-4">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={`
                                            ${faq.category === 'Pricing' ? 'text-green-600 border-green-200 bg-green-50' :
                                                faq.category === 'Legal' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                                                    'text-purple-600 border-purple-200 bg-purple-50'}
                                        `}>
                                            {faq.category}
                                        </Badge>
                                        {faq.q}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4 pl-1">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const ObjectionHandling = () => {
    const objections = [
        { id: 'o1', title: 'Price is too high', response: 'Focus on the all-inclusive value: electricity, internet, coffee, and cleaning included.', tips: ['Break down daily cost', 'Compare with traditional lease'] },
        { id: 'o2', title: 'I check competitors first', response: 'Acknowledge valid competition but highlight our superior flexibility and zero lock-in contracts.', tips: ['Don\'t badmouth competition', 'Focus on community'] },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Users className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Objection Playbook</h2>
            </div>
            <div className="grid gap-6">
                {objections.map((obj) => (
                    <motion.div key={obj.id} variants={itemVariants}>
                        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <span className="text-indigo-600">“</span>
                                    {obj.title}
                                    <span className="text-indigo-600">”</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Suggested Response</h4>
                                    <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-gray-800 italic relative">
                                        <Sparkles className="w-4 h-4 text-indigo-400 absolute top-2 right-2" />
                                        "{obj.response}"
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Winning Tactics</h4>
                                    <ul className="space-y-2">
                                        {obj.tips.map((tip, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-gray-600 bg-white p-2 rounded-lg border shadow-sm">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

const Troubleshooting = () => {
    const issues = [
        { id: 'i1', title: 'Booking Payment Failed', desc: 'Client tried to pay but got an error.', solution: 'Ask client to try a different card or UPI. Check if international transactions are enabled.', escalation: 'Tech Support (if persistent)' },
        { id: 'i2', title: 'Client not receiving emails', desc: 'Welcome email not received.', solution: 'Ask client to check spam/junk folder. Verify email spelling in dashboard.', escalation: 'Admin' },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <ShieldAlert className="h-6 w-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Troubleshooting Guide</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {issues.map((issue) => (
                    <motion.div key={issue.id} variants={itemVariants}>
                        <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow bg-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <ShieldAlert className="w-24 h-24 text-red-500" />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <CardTitle className="text-lg font-bold text-gray-800">{issue.title}</CardTitle>
                                    <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">High Freq</Badge>
                                </div>
                                <CardDescription>{issue.desc}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                    <span className="text-xs font-bold text-green-700 uppercase block mb-1">Quick Fix</span>
                                    <p className="text-sm font-medium text-gray-800">{issue.solution}</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="font-semibold text-gray-700">Escalate to:</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">{issue.escalation}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
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
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: searchResults, isLoading: isSearching } = useQuery<SearchResult[]>({
        queryKey: ['learning-search', debouncedQuery],
        queryFn: () => learningHubService.search(debouncedQuery),
        enabled: debouncedQuery.length > 2,
    });

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
                        className="text-indigo-100 text-lg md:text-xl mb-8 leading-relaxed max-w-xl"
                    >
                        Your ultimate resource for product mastery, objection handling, and operational excellence.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative max-w-lg"
                    >
                        <Input
                            placeholder="Search for anything (e.g., 'price', 'cancellation')..."
                            className="pl-12 h-14 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-indigo-200 focus:bg-white/20 backdrop-blur-md shadow-lg transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-4 h-6 w-6 text-indigo-200" />
                    </motion.div>
                </div>
            </div>

            {debouncedQuery.length > 2 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="flex-1 overflow-auto border-0 shadow-lg bg-white/80 backdrop-blur">
                        <CardHeader>
                            <CardTitle className="text-2xl">Search Results for "<span className="text-indigo-600">{debouncedQuery}</span>"</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isSearching ? (
                                <div className="text-center py-12 text-indigo-400">Searching knowledge base...</div>
                            ) : searchResults && searchResults.length > 0 ? (
                                <div className="space-y-4">
                                    {searchResults.map((result: SearchResult) => (
                                        <div key={result.id} className="p-4 rounded-xl hover:bg-gray-50 transition-colors border-b last:border-0 cursor-pointer group">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 border-0 uppercase text-[10px] tracking-wider">{result.type}</Badge>
                                                <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">{result.title}</h3>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed">
                                                {result.content || result.answer || result.response || result.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex p-4 rounded-full bg-gray-100 mb-4">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">No results found</h3>
                                    <p className="text-gray-500">Try adjusting your search terms.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
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
                                {activeTab === 'faq' && <ClientFAQs />}
                                {activeTab === 'objection' && <ObjectionHandling />}
                                {activeTab === 'issue' && <Troubleshooting />}
                                {activeTab === 'walkthrough' && <SalesWalkthrough />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearningHub;
