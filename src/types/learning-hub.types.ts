export type LearningModuleType = 'product' | 'faq' | 'objection' | 'issue' | 'walkthrough';

export interface LearningModule {
    id: string;
    title: string;
    description: string;
    type: LearningModuleType;
    icon: string; // Lucide icon name or similar identifier
    color: string;
}

export interface Article {
    id: string;
    moduleId: string;
    title: string;
    content: string; // Markdown or HTML
    category?: string;
    videoUrl?: string; // Optional embedded video
    lastUpdated: string;
    tags: string[];
}

export interface FAQ {
    id: string;
    moduleId: string;
    question: string;
    answer: string;
    category: string;
}

export interface Objection {
    id: string;
    moduleId: string;
    objection: string;
    whyItHappens: string;
    response: string;
    bestPractices: string[];
}

export interface TroubleshootingIssue {
    id: string;
    moduleId: string;
    issue: string;
    description: string;
    possibleReasons: string[];
    solution: string; // What sales should tell client
    escalation: {
        required: boolean;
        role?: string; // e.g., "Engineering", "Billing Team"
    };
}
