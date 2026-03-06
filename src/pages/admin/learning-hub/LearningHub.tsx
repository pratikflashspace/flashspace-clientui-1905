import {
    LayoutDashboard,
    Users,
    TrendingUp,
    Ticket,
    BookOpen,
    Trophy,
    Target,
    Headphones,
    Calculator,
    FileText,
    Wallet,
    Receipt,
    Play,
    FileText as DocIcon,
    Video,
    Clock,
    CheckCircle,
    ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navItems = [
    { label: "Dashboard", href: "/admin-portal", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Sales Analytics", href: "/admin-portal/sales", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Lead Management", href: "/admin-portal/leads", icon: <Target className="w-5 h-5" /> },
    { label: "Client Management", href: "/admin-portal/clients", icon: <Users className="w-5 h-5" /> },
    { label: "Ticket System", href: "/admin-portal/tickets", icon: <Ticket className="w-5 h-5" /> },
    { label: "Support Chats", href: "/admin-portal/support", icon: <Headphones className="w-5 h-5" /> },
    { label: "Learning Hub", href: "/admin-portal/learning", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Leaderboard", href: "/admin-portal/leaderboard", icon: <Trophy className="w-5 h-5" /> },
    { label: "Revenue Dashboard", href: "/admin-portal/revenue", icon: <Wallet className="w-5 h-5" /> },
    { label: "Invoices", href: "/admin-portal/invoices", icon: <Receipt className="w-5 h-5" /> },
    { label: "Receivable/Payable", href: "/admin-portal/finance", icon: <Calculator className="w-5 h-5" /> },
    { label: "Balance Sheet", href: "/admin-portal/balance", icon: <FileText className="w-5 h-5" /> },
];

const courses = [
    {
        id: 1,
        title: "FlashSpace Platform Basics",
        description: "Learn the fundamentals of the FlashSpace platform",
        modules: 8,
        duration: "2 hours",
        progress: 100,
        category: "Onboarding"
    },
    {
        id: 2,
        title: "Client Communication Best Practices",
        description: "Master the art of professional client communication",
        modules: 6,
        duration: "1.5 hours",
        progress: 75,
        category: "Skills"
    },
    {
        id: 3,
        title: "Advanced Ticket Resolution",
        description: "Handle complex support tickets efficiently",
        modules: 10,
        duration: "3 hours",
        progress: 40,
        category: "Support"
    },
    {
        id: 4,
        title: "Sales Closing Techniques",
        description: "Proven strategies to close more deals",
        modules: 12,
        duration: "4 hours",
        progress: 0,
        category: "Sales"
    },
];

const documents = [
    { title: "Employee Handbook", type: "PDF", size: "2.4 MB", updated: "Jan 15, 2024" },
    { title: "Support SOP Manual", type: "PDF", size: "5.1 MB", updated: "Jan 20, 2024" },
    { title: "Sales Pitch Deck", type: "PPT", size: "8.2 MB", updated: "Feb 1, 2024" },
    { title: "Compliance Guidelines", type: "PDF", size: "1.8 MB", updated: "Jan 10, 2024" },
];

const LearningHub = () => {
    return (
        <div className="max-w-[1600px] mx-auto p-6 bg-background min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                    Learning <span className="text-primary italic">Hub</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                    Training resources and documentation for the team
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4 mb-8">
                <div className="bg-background border border-border rounded-xl p-5">
                    <p className="text-2xl font-extrabold text-foreground">24</p>
                    <p className="text-sm text-muted-foreground">Total Courses</p>
                </div>
                <div className="bg-background border border-border rounded-xl p-5">
                    <p className="text-2xl font-extrabold text-green-600">8</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="bg-background border border-border rounded-xl p-5">
                    <p className="text-2xl font-extrabold text-primary">3</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div className="bg-background border border-border rounded-xl p-5">
                    <p className="text-2xl font-extrabold text-foreground">45</p>
                    <p className="text-sm text-muted-foreground">Documents</p>
                </div>
            </div>

            <Tabs defaultValue="courses" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                </TabsList>

                <TabsContent value="courses">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-background border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <Badge variant="outline">{course.category}</Badge>
                                    {course.progress === 100 ? (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Completed
                                        </Badge>
                                    ) : course.progress > 0 ? (
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                            <Clock className="w-3 h-3 mr-1" />
                                            In Progress
                                        </Badge>
                                    ) : null}
                                </div>

                                <h3 className="font-bold text-foreground mb-2">{course.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                    <span>{course.modules} modules</span>
                                    <span>•</span>
                                    <span>{course.duration}</span>
                                </div>

                                {course.progress > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-medium text-foreground">{course.progress}%</span>
                                        </div>
                                        <Progress value={course.progress} className="h-2" />
                                    </div>
                                )}

                                <Button variant={course.progress === 100 ? "outline" : "default"} className="w-full">
                                    {course.progress === 0 ? (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Start Course
                                        </>
                                    ) : course.progress === 100 ? (
                                        "Review Course"
                                    ) : (
                                        "Continue Learning"
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="documents">
                    <div className="bg-background border border-border rounded-xl overflow-hidden">
                        {documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <DocIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground">{doc.title}</h4>
                                        <p className="text-sm text-muted-foreground">{doc.type} • {doc.size} • Updated {doc.updated}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="videos">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
                                <div className="h-32 bg-muted flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                                        <Play className="w-5 h-5 text-primary-foreground ml-1" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-medium text-foreground mb-1">Training Video {i}</h4>
                                    <p className="text-sm text-muted-foreground">12:34 mins</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default LearningHub;
