export interface Lead {
    id: string;
    name: string;
    phone: string;
    company: string;
    interest: string;
    status: "Hot" | "Warm" | "Cold" | "Converted";
    lastContact: string;
}
