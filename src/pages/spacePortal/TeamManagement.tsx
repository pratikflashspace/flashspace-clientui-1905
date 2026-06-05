import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Trash2, UserPlus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  createPartnerTeamMember,
  deletePartnerTeamMember,
  fetchPartnerTeamMembers,
  SpacePartnerTeamMember,
} from "@/services/spacePortal/spacePartner.service";

const getRoleLabel = (role?: string) => {
  if (!role) return "Team Member";
  return role
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<SpacePartnerTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string;
    password: string;
    isManuallySet: boolean;
  } | null>(null);
  const [useManualPassword, setUseManualPassword] = useState(false);
  const [manualPassword, setManualPassword] = useState("");

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const loadTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await fetchPartnerTeamMembers();

      if (response?.success && Array.isArray(response.data)) {
        setTeamMembers(response.data);
      } else {
        setTeamMembers([]);
        toast.error(response?.message || "Could not load team members");
      }
    } catch (error) {
      console.error("Failed to fetch team members", error);
      setTeamMembers([]);
      toast.error("Could not load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTeamMembers();
  }, []);

  const rolesSummary = useMemo(() => {
    if (teamMembers.length === 0) {
      return [{ name: "Team Member", count: 0 }];
    }

    const counters = new Map<string, number>();
    teamMembers.forEach((member) => {
      const roleName = getRoleLabel(member.role);
      counters.set(roleName, (counters.get(roleName) || 0) + 1);
    });

    return Array.from(counters.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [teamMembers]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = newMember.name.trim();
    const email = newMember.email.trim().toLowerCase();
    const phoneNumber = newMember.phoneNumber.trim();
    const customPassword = manualPassword.trim();

    if (!fullName || !email || !phoneNumber) {
      toast.error("Please fill name, email and phone number");
      return;
    }

    if (useManualPassword && !customPassword) {
      toast.error("Please enter a password");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createPartnerTeamMember({
        fullName,
        email,
        phoneNumber,
        password: useManualPassword ? customPassword : undefined,
      });

      if (response?.success && response?.data?.member) {
        const createdMember = response.data.member as SpacePartnerTeamMember;

        setTeamMembers((prev) => [createdMember, ...prev]);
        setGeneratedCredentials({
          email: createdMember.email,
          password: response?.data?.generatedPassword || customPassword,
          isManuallySet: useManualPassword,
        });
        setNewMember({ name: "", email: "", phoneNumber: "" });
        setUseManualPassword(false);
        setManualPassword("");

        toast.success("Team member added successfully");
      } else {
        toast.error(response?.message || "Failed to add member");
      }
    } catch (error) {
      console.error("Failed to create team member", error);
      toast.error("Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deletePartnerTeamMember(id);
      if (response?.success) {
        setTeamMembers((prev) => prev.filter((member) => member.id !== id));
        toast.success("Member removed");
      } else {
        toast.error(response?.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("Failed to delete member", error);
      toast.error("Failed to remove member");
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setIsSubmitting(false);
    setGeneratedCredentials(null);
    setNewMember({ name: "", email: "", phoneNumber: "" });
    setUseManualPassword(false);
    setManualPassword("");
  };

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Could not copy ${label.toLowerCase()}`);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="text-gray-900 dark:text-white">Team</span> <span className="text-[#36503F] italic">Members</span>
        
          </h1>
          <p className="text-muted-foreground mt-2">
            Add team members and share login credentials securely.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="py-16 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading team members...
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-bold text-foreground">
                      Member
                    </th>
                    <th className="text-left p-4 text-sm font-bold text-foreground">
                      Login Password
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
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
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
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
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
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-foreground font-semibold">
                              {member.loginPassword || "Not available"}
                            </span>
                            {member.loginPassword ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-6 rounded-md px-2 text-[10px]"
                                onClick={() =>
                                  void copyToClipboard(member.loginPassword as string, `${member.name} password`)
                                }
                              >
                                Copy
                              </Button>
                            ) : null}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className="font-extrabold text-[10px] uppercase border-primary/20 text-primary bg-primary/5"
                          >
                            {getRoleLabel(member.role)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-bold bg-secondary/50 text-secondary-foreground"
                          >
                            All Spaces
                          </Badge>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-lg hover:bg-rose-100 hover:text-rose-600"
                            onClick={() => void handleDelete(member.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-border">
                      <td
                        colSpan={6}
                        className="p-10 text-sm text-muted-foreground text-center"
                      >
                        No team members added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-foreground text-sm mb-4 uppercase tracking-wider opacity-70">
              Roles Overview
            </h3>
            <div className="space-y-3">
              {rolesSummary.map((role) => (
                <div key={role.name} className="flex items-center justify-between">
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeAddModal}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-[460px] shadow-2xl overflow-hidden border border-border text-slate-900 opacity-100 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserPlus className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Add Team Member</h2>
              </div>
              <button
                onClick={closeAddModal}
                className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <form onSubmit={handleAddMember} className="space-y-4">
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
                    placeholder="name@flashspace.aim"
                    className="rounded-xl"
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    className="rounded-xl"
                    value={newMember.phoneNumber}
                    onChange={(e) =>
                      setNewMember({ ...newMember, phoneNumber: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useManualPassword}
                      onChange={(e) => {
                        setUseManualPassword(e.target.checked);
                        if (!e.target.checked) setManualPassword("");
                      }}
                      className="h-4 w-4 rounded border-border"
                    />
                    Set password manually
                  </label>

                  {useManualPassword && (
                    <div className="mt-3 space-y-2">
                      <Label htmlFor="manual-password" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Password
                      </Label>
                      <Input
                        id="manual-password"
                        type="text"
                        placeholder="Enter a secure password"
                        className="rounded-xl"
                        value={manualPassword}
                        onChange={(e) => setManualPassword(e.target.value)}
                        required={useManualPassword}
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum 8 characters, including uppercase, lowercase and a special character.
                      </p>
                    </div>
                  )}
                </div>

                {generatedCredentials && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                    <p className="text-xs font-bold uppercase text-emerald-800 tracking-wide">
                      Login Credentials Ready
                    </p>

                    <div className="space-y-1">
                      <p className="text-[11px] uppercase font-semibold text-emerald-700/80">
                        Email
                      </p>
                      <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2">
                        <span className="text-xs font-medium text-slate-700 break-all">
                          {generatedCredentials.email}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 rounded-md"
                          onClick={() => void copyToClipboard(generatedCredentials.email, "Email")}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] uppercase font-semibold text-emerald-700/80">
                        {generatedCredentials.isManuallySet ? "Password" : "Temporary Password"}
                      </p>
                      <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2">
                        <span className="text-xs font-bold text-slate-900 break-all">
                          {generatedCredentials.password}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 rounded-md"
                          onClick={() =>
                            void copyToClipboard(generatedCredentials.password, "Password")
                          }
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-emerald-800">
                      These credentials can be used to sign in to the portal.
                    </p>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl font-bold h-11"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding...
                      </span>
                    ) : (
                      "Add Team Member"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
