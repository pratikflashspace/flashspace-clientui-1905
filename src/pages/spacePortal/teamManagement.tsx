import { useMemo, useState } from "react";
import { TEAM_MEMBERS, TeamMember, TeamMemberRole } from "@/data/spacePortal/team";
import { Search, UserPlus, Mail, Shield, MoreVertical, Filter, Trash2, Edit2, UserCheck, Clock, UserX, X, AlertTriangle } from "lucide-react";
import SearchBar from "@/components/ui/SpacePartner/SearchBar";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import Table from "@/components/ui/SpacePartner/Table";
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

type TeamMemberWithActions = TeamMember & { actions?: any };

export default function TeamManagement() {
    const [team, setTeam] = useState<TeamMember[]>(TEAM_MEMBERS);
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<TeamMemberRole | "ALL">("ALL");

    // Form Submitting State
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add Member Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newMember, setNewMember] = useState({
        name: "",
        email: "",
        role: "STAFF" as TeamMemberRole,
    });

    // Edit Member Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);

    const filteredMembers = useMemo(() => {
        return (team as TeamMemberWithActions[]).filter((member) => {
            const q = query.toLowerCase();
            const matchesQuery =
                member.name.toLowerCase().includes(q) ||
                member.email.toLowerCase().includes(q) ||
                member.id.toLowerCase().includes(q);

            const matchesRole = roleFilter === "ALL" ? true : member.role === roleFilter;

            return matchesQuery && matchesRole;
        });
    }, [team, query, roleFilter]);

    const totalMembers = team.length;

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            const memberToAdd: TeamMember = {
                id: `TM${String(team.length + 1).padStart(3, "0")}`,
                name: newMember.name,
                email: newMember.email,
                role: newMember.role,
                joinedDate: new Date().toISOString().split("T")[0],
            };

            setTeam([memberToAdd, ...team]);
            setIsSubmitting(false);
            setIsAddModalOpen(false);
            setNewMember({ name: "", email: "", role: "STAFF" });
            toast.success("Member added successfully!");
        }, 1000);
    };

    const handleEditMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMember) return;
        setIsSubmitting(true);

        setTimeout(() => {
            setTeam(team.map(m => m.id === editingMember.id ? editingMember : m));
            setIsSubmitting(false);
            setIsEditModalOpen(false);
            setEditingMember(null);
            toast.success("Member updated successfully!");
        }, 1000);
    };

    const handleDeleteMember = () => {
        if (!deletingMember) return;
        setIsSubmitting(true);

        setTimeout(() => {
            setTeam(team.filter(m => m.id !== deletingMember.id));
            setIsSubmitting(false);
            setIsDeleteModalOpen(false);
            setDeletingMember(null);
            toast.success("Member removed successfully!");
        }, 1000);
    };

    return (
        <div className="p-8 animate-in fade-in duration-500">
            {/* Heading */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Team <span className="text-[#3FA69E]">Management</span>
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Manage your staff members, roles, and platform permissions.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#3FA69E] px-6 py-3 font-semibold text-white shadow-lg shadow-[#3FA69E]/20 transition hover:bg-[#358E87] hover:shadow-xl active:scale-95"
                >
                    <UserPlus size={20} />
                    Add Member
                </button>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Members</p>
                            <h3 className="text-2xl font-bold text-slate-900">{totalMembers}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        placeholder="Search by name, email or ID..."
                    />

                    <SelectBox
                        value={roleFilter}
                        onChange={(val) => setRoleFilter(val as TeamMemberRole | "ALL")}
                        options={[
                            { label: "All Roles", value: "ALL" },
                            { label: "Admin", value: "ADMIN" },
                            { label: "Manager", value: "MANAGER" },
                            { label: "Staff", value: "STAFF" },
                        ]}
                    />
                </div>

                {/* Table */}
                <div className="mt-6">
                    <Table<TeamMemberWithActions>
                        data={filteredMembers}
                        columns={[
                            {
                                key: "name",
                                header: "Member",
                                render: (member) => {
                                    const initials = member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2);
                                    return (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                                                {initials}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{member.name}</p>
                                                <p className="text-xs text-slate-500">{member.id}</p>
                                            </div>
                                        </div>
                                    );
                                },
                            },
                            {
                                key: "email",
                                header: "Email Address",
                                render: (member) => (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Mail size={14} className="text-slate-400" />
                                        {member.email}
                                    </div>
                                ),
                            },
                            {
                                key: "role",
                                header: "Role",
                                render: (member) => (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.role === "ADMIN" ? "bg-purple-50 text-purple-700" :
                                        member.role === "MANAGER" ? "bg-blue-50 text-blue-700" :
                                            "bg-slate-100 text-slate-700"
                                        }`}>
                                        {member.role}
                                    </span>
                                ),
                            },
                            {
                                key: "joinedDate",
                                header: "Joined Date",
                                render: (member) => (
                                    <span className="text-slate-600">
                                        {new Date(member.joinedDate).toLocaleDateString()}
                                    </span>
                                ),
                            },
                            {
                                key: "actions",
                                header: "Actions",
                                render: (member) => (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                setEditingMember(member);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="text-slate-400 hover:text-[#3FA69E] transition"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeletingMember(member);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="text-slate-400 hover:text-rose-600 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        {/* <button className="text-slate-400 hover:text-slate-600 transition">
                                            <MoreVertical size={16} />
                                        </button> */}
                                    </div>
                                ),
                            },
                        ]}
                    />

                    {filteredMembers.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                                <UserX size={32} />
                            </div>
                            <p className="mt-4 font-medium text-slate-900">No members found</p>
                            <p className="text-sm text-slate-500">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Member Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-[#3FA69E]/20 rounded-xl">
                                <UserPlus className="w-6 h-6 text-[#3FA69E]" />
                            </div>
                            Assign Team Member
                        </DialogTitle>
                        <p className="text-slate-400 mt-2">Directly add a member and assign their workspace role.</p>
                    </DialogHeader>

                    <form onSubmit={handleAddMember} className="p-8 space-y-6 bg-white">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter member's full name"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                    className="rounded-xl border-slate-200 focus:ring-[#3FA69E] focus:border-[#3FA69E] h-12"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={newMember.email}
                                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                        className="rounded-xl border-slate-200 focus:ring-[#3FA69E] focus:border-[#3FA69E] h-12 pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Assign Role</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['ADMIN', 'MANAGER', 'STAFF'] as TeamMemberRole[]).map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setNewMember({ ...newMember, role })}
                                            className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all ${newMember.role === role
                                                ? "bg-[#3FA69E]/10 border-[#3FA69E] text-[#3FA69E] shadow-sm"
                                                : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200"
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 italic">
                                    {newMember.role === 'ADMIN' && "* Full access to all space settings and billing."}
                                    {newMember.role === 'MANAGER' && "* Can manage clients and spaces but not billing."}
                                    {newMember.role === 'STAFF' && "* Limited access to client view and basic analytics."}
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="pt-4 gap-3 sm:gap-0">
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="flex-1 px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 rounded-xl bg-[#3FA69E] font-semibold text-white shadow-lg shadow-[#3FA69E]/20 transition hover:bg-[#358E87] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={18} />
                                        Add Member
                                    </>
                                )}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Member Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-[#3FA69E]/20 rounded-xl">
                                <Edit2 className="w-6 h-6 text-[#3FA69E]" />
                            </div>
                            Update Member Profile
                        </DialogTitle>
                        <p className="text-slate-400 mt-2">Modify the details and workspace permissions.</p>
                    </DialogHeader>

                    {editingMember && (
                        <form onSubmit={handleEditMember} className="p-8 space-y-6 bg-white">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name" className="text-sm font-semibold text-slate-700">Full Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editingMember.name}
                                        onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                                        className="rounded-xl border-slate-200 focus:ring-[#3FA69E] focus:border-[#3FA69E] h-12"
                                        required
                                    />
                                </div>

                                <div className="space-y-2 opacity-60">
                                    <Label className="text-sm font-semibold text-slate-700">Email Address (Non-editable)</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            value={editingMember.email}
                                            disabled
                                            className="rounded-xl border-slate-100 bg-slate-50 h-12 pl-10 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Assign Role</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['ADMIN', 'MANAGER', 'STAFF'] as TeamMemberRole[]).map((role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => setEditingMember({ ...editingMember, role })}
                                                className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all ${editingMember.role === role
                                                    ? "bg-[#3FA69E]/10 border-[#3FA69E] text-[#3FA69E] shadow-sm"
                                                    : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200"
                                                    }`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="pt-4 gap-3 sm:gap-0">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 rounded-xl bg-[#3FA69E] font-semibold text-white shadow-lg shadow-[#3FA69E]/20 transition hover:bg-[#358E87] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <UserCheck size={18} />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[440px] rounded-3xl p-8 border-none shadow-2xl text-center">
                    <div className="mx-auto w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                        <AlertTriangle className="w-8 h-8 text-rose-500" />
                    </div>
                    <DialogHeader className="p-0 text-center">
                        <DialogTitle className="text-2xl font-bold text-slate-900 mx-auto">Remove Team Member?</DialogTitle>
                        <p className="mt-4 text-slate-600 leading-relaxed text-sm">
                            Are you sure you want to remove <span className="font-bold text-slate-900">{deletingMember?.name}</span>?
                            This action cannot be undone and they will lose all access immediately.
                        </p>
                    </DialogHeader>

                    <DialogFooter className="mt-8 flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition"
                        >
                            No, Keep Member
                        </button>
                        <button
                            onClick={handleDeleteMember}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 rounded-xl bg-rose-600 font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Yes, Remove Member"
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}