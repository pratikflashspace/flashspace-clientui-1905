export type TeamMemberRole = "ADMIN" | "MANAGER" | "STAFF";

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: TeamMemberRole;
    joinedDate: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
    {
        id: "TM001",
        name: "John Smith",
        email: "john.smith@flashspace.com",
        role: "ADMIN",
        joinedDate: "2023-10-15",
    },
    {
        id: "TM002",
        name: "Sarah Johnson",
        email: "sarah.j@flexio.com",
        role: "MANAGER",
        joinedDate: "2023-11-02",
    },
    {
        id: "TM003",
        name: "Michael Chen",
        email: "m.chen@flashspace.com",
        role: "STAFF",
        joinedDate: "2023-12-10",
    },
    {
        id: "TM004",
        name: "Emma Wilson",
        email: "emma.w@flashspace.com",
        role: "STAFF",
        joinedDate: "2024-01-20",
    },
    {
        id: "TM005",
        name: "David Brown",
        email: "david.b@flashspace.com",
        role: "MANAGER",
        joinedDate: "2023-09-05",
    },
];