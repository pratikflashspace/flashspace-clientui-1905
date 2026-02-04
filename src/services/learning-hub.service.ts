import { LearningModule, Article, FAQ, Objection, TroubleshootingIssue } from '@/types/learning-hub.types';
import { BookOpen, Users, HelpCircle, ShieldAlert, MonitorPlay } from 'lucide-react';

export const learningModules: LearningModule[] = [
    {
        id: 'module-1',
        title: 'Product Training',
        description: 'End-to-end knowledge of Flashspace offerings.',
        type: 'product',
        icon: 'BookOpen',
        color: 'bg-blue-100 text-blue-600'
    },
    {
        id: 'module-2',
        title: 'Client FAQs',
        description: 'Quick answers to common client questions.',
        type: 'faq',
        icon: 'HelpCircle',
        color: 'bg-green-100 text-green-600'
    },
    {
        id: 'module-3',
        title: 'Objection Handling',
        description: 'Overcome challenges and close more deals.',
        type: 'objection',
        icon: 'Users',
        color: 'bg-indigo-100 text-indigo-600'
    },
    {
        id: 'module-4',
        title: 'Issues & Troubleshooting',
        description: 'Fix operational issues quickly.',
        type: 'issue',
        icon: 'ShieldAlert',
        color: 'bg-red-100 text-red-600'
    },
    {
        id: 'module-5',
        title: 'Portal Walkthrough',
        description: 'Master the Flashspace sales portal.',
        type: 'walkthrough',
        icon: 'MonitorPlay',
        color: 'bg-yellow-100 text-yellow-600'
    }
];

// Mock Data
const mockArticles: Article[] = [
    {
        id: 'a1',
        moduleId: 'module-1',
        title: 'Virtual Office Explained',
        content: 'A comprehensive guide to what a Virtual Office is, including address usage, mail handling, and lounge access.',
        category: 'Virtual Office',
        lastUpdated: '2023-10-25',
        tags: ['Product', 'Virtual Office']
    },
    {
        id: 'a2',
        moduleId: 'module-1',
        title: 'Coworking Space Tiers',
        content: 'Detailed breakdown of Hot Desk vs. Dedicated Desk vs. Private Office memberships.',
        category: 'Coworking',
        lastUpdated: '2023-10-20',
        tags: ['Product', 'Coworking']
    },
    {
        id: 'w1',
        moduleId: 'module-5',
        title: 'Daily Sales Workflow',
        content: 'Check your dashboard first thing in the morning for new assignments. Follow up on queries marked "High Priority".',
        category: 'Best Practices',
        lastUpdated: '2023-11-01',
        tags: ['Waitlist', 'Sales']
    }
];

const mockFAQs: FAQ[] = [
    {
        id: 'f1',
        moduleId: 'module-2',
        category: 'Pricing',
        question: 'Are there hidden fees?',
        answer: 'No, our pricing is transparent. Setup fees are one-time only.'
    },
    {
        id: 'f2',
        moduleId: 'module-2',
        category: 'Legal',
        question: 'Can I use this address for GST registration?',
        answer: 'Yes, our Virtual Office Plus plan includes NOC for GST registration.'
    }
];

const mockObjections: Objection[] = [
    {
        id: 'o1',
        moduleId: 'module-3',
        objection: 'Price is too high compared to X',
        whyItHappens: 'Client is comparing only the base rent, not the amenities.',
        response: 'Highlight that our price includes electricity, internet, and coffee, which are extra elsewhere.',
        bestPractices: ['Show value', 'Break down costs']
    },
    {
        id: 'o2',
        moduleId: 'module-3',
        objection: 'I need a physical office, not virtual',
        whyItHappens: 'Client misunderstands the flexibility.',
        response: 'Explain they can upgrade anytime. Virtual acts as a low-risk entry point.',
        bestPractices: ['Focus on flexibility', 'Low risk']
    }
];

const mockIssues: TroubleshootingIssue[] = [
    {
        id: 'i1',
        moduleId: 'module-4',
        issue: 'Booking Payment Failed',
        description: 'Client tired to pay but got an error.',
        possibleReasons: ['Insufficient funds', 'Bank server down', 'Card not enabled for online tx'],
        solution: 'Ask client to try a different card or use UPI. If persistent, raise ticket.',
        escalation: { required: false }
    },
    {
        id: 'i2',
        moduleId: 'module-4',
        issue: 'Dashboard Not Loading',
        description: 'Client sees a spinner indefinitely.',
        possibleReasons: ['Browser cache issue', 'Internet connectivity'],
        solution: 'Ask client to clear cache/cookies or try Incognito mode.',
        escalation: { required: true, role: 'Tech Support' }
    }
];

class LearningHubService {
    getModules() {
        return Promise.resolve(learningModules);
    }

    getArticles(moduleId: string) {
        return Promise.resolve(mockArticles.filter(a => a.moduleId === moduleId));
    }

    getFAQs() {
        return Promise.resolve(mockFAQs);
    }

    getObjections() {
        return Promise.resolve(mockObjections);
    }

    getIssues() {
        return Promise.resolve(mockIssues);
    }

    search(query: string) {
        const lowerQuery = query.toLowerCase();
        // Simple search implementation
        const results = [
            ...mockArticles.filter(m => m.title.toLowerCase().includes(lowerQuery) || m.content.toLowerCase().includes(lowerQuery)).map(a => ({ ...a, type: 'article' })),
            ...mockFAQs.filter(f => f.question.toLowerCase().includes(lowerQuery) || f.answer.toLowerCase().includes(lowerQuery)).map(f => ({ ...f, type: 'faq', title: f.question })),
            ...mockObjections.filter(o => o.objection.toLowerCase().includes(lowerQuery)).map(o => ({ ...o, type: 'objection', title: o.objection })),
            ...mockIssues.filter(i => i.issue.toLowerCase().includes(lowerQuery)).map(i => ({ ...i, type: 'issue', title: i.issue }))
        ];
        return Promise.resolve(results);
    }
}

export const learningHubService = new LearningHubService();
