import { useState } from "react";
import { Plus, Edit, MoreVertical, UserPlus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const initialTeamMembers = [
  {
    id: 1,
    name: "Raj Kumar",
    email: "raj.kumar@flashspace.com",
    role: "Operations Manager",
    spaces: ["Mumbai - BKC", "Delhi - CP"],
    status: "active",
    permissions: ["full_access"],
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@flashspace.com",
    role: "Client Relations",
    spaces: ["Bangalore - HSR"],
    status: "active",
    permissions: ["client_management", "enquiries"],
  },
  {
    id: 3,
    name: "Amit Verma",
    email: "amit.verma@flashspace.com",
    role: "Accounts Executive",
    spaces: ["All Spaces"],
    status: "active",
    permissions: ["payments", "invoices"],
  },
  {
    id: 4,
    name: "Sneha Reddy",
    email: "sneha.reddy@flashspace.com",
    role: "Front Desk",
    spaces: ["Chennai - Anna Nagar"],
    status: "inactive",
    permissions: ["mail_visits"],
  },
];

const rolesSummary = [
  { name: "Operations Manager", count: 1 },
  { name: "Client Relations", count: 2 },
  { name: "Accounts Executive", count: 1 },
  { name: "Front Desk", count: 3 },
];

//Team
export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Front Desk",
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const memberToAdd = {
        id: teamMembers.length + 1,
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        spaces: ["All Spaces"],
        status: "active",
        permissions: ["basic_access"],
      };

      setTeamMembers([...teamMembers, memberToAdd as any]);
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      setNewMember({ name: "", email: "", role: "Front Desk" });
      toast.success("Member added successfully!");
    }, 800);
  };

  const handleDelete = (id: number) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
    toast.success("Member removed");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Team <span className="text-primary italic">Members</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your team and their access permissions
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Team Members List */}
        <div className="lg:col-span-3">
          <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-bold text-foreground">
                    Member
                  </th>
                  <th className="text-left p-4 text-sm font-bold text-foreground">
                    Role
                  </th>
                  <th className="text-left p-4 text-sm font-bold text-foreground">
                    Assigned Spaces
                  </th>
                  <th className="text-left p-4 text-sm font-bold text-foreground">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-bold text-foreground text-right pr-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-sm text-foreground">
                            {member.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className="font-extrabold text-[10px] uppercase border-primary/20 text-primary bg-primary/5"
                      >
                        {member.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {member.spaces.map((space, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-[10px] font-bold bg-secondary/50 text-secondary-foreground"
                          >
                            {space}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          member.status === "active"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-100 border-none px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                        }
                      >
                        {member.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-rose-100 hover:text-rose-600"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Roles Summary */}
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground text-sm mb-4 uppercase tracking-wider opacity-70">
              Roles Overview
            </h3>
            <div className="space-y-3">
              {rolesSummary.map((role) => (
                <div
                  key={role.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {role.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="font-bold text-xs min-w-[24px] flex justify-center"
                  >
                    {role.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl p-5 shadow-sm bg-gradient-to-br from-background to-muted/20">
            <h3 className="font-bold text-foreground text-sm mb-4 uppercase tracking-wider opacity-70">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Total Members
                </span>
                <span className="font-extrabold text-foreground">
                  {teamMembers.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Active
                </span>
                <span className="font-extrabold text-emerald-600">
                  {teamMembers.filter((m) => m.status === "active").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Inactive
                </span>
                <span className="font-extrabold text-muted-foreground">
                  {teamMembers.filter((m) => m.status !== "active").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" />
              Add Team Member
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMember} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold">
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter member's full name"
                className="rounded-xl"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@flashspace.com"
                className="rounded-xl"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold">Assign Role</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Operations Manager",
                  "Client Relations",
                  "Accounts Executive",
                  "Front Desk",
                ].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setNewMember({ ...newMember, role })}
                    className={`py-2 px-3 rounded-xl border text-[10px] font-bold transition-all ${
                      newMember.role === role
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl font-bold h-11"
              >
                {isSubmitting ? "Adding..." : "Confirm & Send Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
