import React, { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Shield,
  MoreVertical,
  Users,
  UserCheck,
  UserPlus,
  Download,
  Filter,
  Trash2,
  RotateCcw,
  X,
  Plus,
  Mail,
  Lock,
  ChevronDown,
} from "lucide-react";
import { getUploadedFileUrl } from "@/utils/fileUrl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";

interface User {
  id: string;
  fullName: string;
  email: string;
  role:
    | "user"
    | "admin"
    | "support"
    | "partner"
    | "sales"
    | "affiliate"
    | "super_admin";
  isEmailVerified?: boolean;
  createdAt: string;
  profilePicture?: string;
}

export default function UserManagement() {
  const { user: currentSessionUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"active" | "deleted">("active");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    newThisMonth: 0,
  });

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user" as
      | "user"
      | "admin"
      | "support"
      | "partner"
      | "sales"
      | "super_admin",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filter, viewMode]);

  const fetchUsers = async (page = pagination.page) => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers({
        deleted: viewMode === "deleted",
        search: searchTerm,
        role: filter,
        page: page,
        limit: 10,
      });
      if (response.success && response.data) {
        const mappedUsers = (response.data.users || []).map((u) => ({
          ...u,
          id: u.id || u._id,
        }));
        setUsers(mappedUsers as User[]);
        setPagination(
          response.data.pagination || { page: 1, pages: 1, total: 0 },
        );
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    const isTrashView = viewMode === "deleted";
    const action = isTrashView ? "restore" : "move this user to trash";

    if (confirm(`Are you sure you want to ${action} ${user.fullName}?`)) {
      try {
        const response = await adminService.deleteUser(user.id, isTrashView);

        // console.log("Delete user response:", response);

        if (response.success) {
          toast.success(
            response.message ||
              (isTrashView
                ? "User restored successfully"
                : "User moved to trash"),
          );
          fetchUsers();
        } else {
          console.error("API returned error:", response);
          toast.error(response.message || "Failed to update user");
        }
      } catch (error: any) {
        console.error("Caught error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleUpdateRole = async (user: User, newRole: string) => {
    try {
      // Send commonly required fields for PUT updates
      const payload = {
        fullName: user.fullName,
        email: user.email,
        role: newRole as any,
      };
      const response = await adminService.updateUser(user.id, payload);

      if (response.success) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers();
      } else {
        console.error("Role update failed:", response);
        toast.error(
          response.message || "Failed to update role: Unknown server error",
        );
      }
    } catch (error: any) {
      console.error("Role update exception:", error);
      toast.error(error?.message || "An error occurred while updating role");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await adminService.createUser(newUser);
      if (response.success) {
        toast.success("User created successfully");
        setIsAddUserModalOpen(false);
        setNewUser({ fullName: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to create user");
      }
    } catch (error) {
      toast.error("An error occurred while creating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users; // Server-side filtering now

  // Stats are now fetched from backend to support server-side pagination
  const displayTotal = viewMode === "active" ? stats.total : pagination.total;
  const verifiedUsersCount = stats.verified;
  const newUsersCount = stats.newThisMonth;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomGradient = (name: string) => {
    const gradients = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-teal-500",
      "from-orange-500 to-amber-500",
    ];
    const index = name.length % gradients.length;
    return gradients[index];
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return {
          label: "Super Admin",
          className: "bg-red-50 text-red-700 border-red-200 font-bold",
          icon: <Shield className="w-3 h-3" />,
        };
      case "admin":
        return {
          label: "Admin",
          className: "bg-purple-50 text-purple-700 border-purple-200",
          icon: <Shield className="w-3 h-3" />,
        };
      case "partner":
        return {
          label: "Space Partner",
          className: "bg-orange-50 text-orange-700 border-orange-200",
          icon: <Users className="w-3 h-3" />,
        };
      case "affiliate":
        return {
          label: "Affiliate Partner",
          className: "bg-cyan-50 text-cyan-700 border-cyan-200",
          icon: <Users className="w-3 h-3" />,
        };
      case "sales":
        return {
          label: "Sales Team",
          className: "bg-green-50 text-green-700 border-green-200",
          icon: <Users className="w-3 h-3" />,
        };
      case "user":
      default:
        return {
          label: "Client",
          className: "bg-blue-50 text-blue-700 border-blue-200",
          icon: null,
        };
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <AdminPageSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-8 animate-in fade-in duration-500" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-[30px] font-extrabold text-foreground tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
              User <span className="text-primary italic">Management</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Oversee, manage, and analyze user base.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setViewMode("active")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "active"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setViewMode("deleted")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  viewMode === "deleted"
                    ? "bg-white text-destructive shadow-sm"
                    : "text-muted-foreground hover:text-destructive"
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Bin
              </button>
            </div>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {viewMode === "active" ? "Total Users" : "Deleted Users"}
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{displayTotal}</h3>
          </div>

          <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Verified</span>
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{verifiedUsersCount}</h3>
          </div>

          <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">New This Month</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{newUsersCount}</h3>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-none rounded-xl w-full md:w-auto h-11">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 cursor-pointer outline-none w-full"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Clients</option>
                  <option value="partner">Space Partners</option>
                  <option value="affiliate">Affiliate Partners</option>
                  <option value="sales">Sales Team</option>
                  <option value="support">Support Team</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </div>

          {/* List Content */}
          <div className="min-h-[400px]">
            {filteredUsers.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  {viewMode === "deleted" ? (
                    <Trash2 className="w-8 h-8 text-gray-300" />
                  ) : (
                    <Users className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  {viewMode === "deleted" ? "Bin is empty" : "No users found"}
                </h3>
                <p className="text-gray-400 text-sm mt-1 font-medium max-w-xs mx-auto">
                  {viewMode === "deleted"
                    ? "Deleted users will appear here for 30 days before permanent removal."
                    : "Try adjusting your search criteria or role filters."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop view */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-sm font-semibold text-foreground">User Profile</th>
                        <th className="px-6 py-4 text-sm font-semibold text-foreground">Role</th>
                        <th className="px-6 py-4 text-sm font-semibold text-foreground">Verification</th>
                        <th className="px-6 py-4 text-sm font-semibold text-foreground">Joined Date</th>
                        <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((user) => {
                        const roleBadge = getRoleBadge(user.role);
                        return (
                          <tr
                            key={user.id}
                            className={`group hover:bg-gray-50/50 transition-all duration-200 ${
                              viewMode === "deleted" ? "opacity-75" : ""
                            }`}
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-11 w-11 ring-2 ring-background shadow-lg group-hover:scale-110 transition-transform rounded-2xl overflow-hidden">
                                  {user.profilePicture && (
                                    <AvatarImage src={getUploadedFileUrl(user.profilePicture)} alt={user.fullName} className="object-cover" />
                                  )}
                                  <AvatarFallback className="bg-[#334d3d] text-[#FEF8C3] font-black text-xs">
                                    {getInitials(user.fullName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="font-extrabold text-foreground truncate max-w-[200px] leading-tight mb-0.5">{user.fullName}</p>
                                  <p className="text-[11px] text-muted-foreground font-bold truncate max-w-[200px]">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              {viewMode === "active" ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger className="focus:outline-none">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wider border uppercase transition-all hover:bg-white hover:shadow-md ${roleBadge.className}`}>
                                      {roleBadge.icon}
                                      {roleBadge.label}
                                      <ChevronDown className="w-3 h-3 opacity-50" />
                                    </span>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuPortal>
                                    <DropdownMenuContent align="start" className="w-56 bg-white shadow-2xl border-0 rounded-2xl p-2 z-[100]">
                                      <DropdownMenuLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-3">Assign New Role</DropdownMenuLabel>
                                      <DropdownMenuSeparator className="bg-gray-50 mx-2" />
                                      {["user", "partner", "affiliate", "sales", "support", "admin"].map((r) => (
                                        <DropdownMenuItem 
                                          key={r}
                                          onClick={() => handleUpdateRole(user, r)}
                                          className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                          <span className="text-xs font-bold capitalize">{r.replace("_", " ")}</span>
                                          {user.role === r && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenuPortal>
                                </DropdownMenu>
                              ) : (
                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wider border uppercase ${roleBadge.className}`}>
                                  {roleBadge.icon}
                                  {roleBadge.label}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              {viewMode === "deleted" ? (
                                <span className="inline-flex items-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-1 rounded-lg">Deleted</span>
                              ) : user.isEmailVerified ? (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-lg">Verified</span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-lg">Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">
                                {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right whitespace-nowrap">
                              <DropdownMenu>
                                <DropdownMenuTrigger className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all border border-gray-100">
                                  <MoreVertical className="w-5 h-5" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white shadow-2xl border-0 rounded-2xl p-2 z-[60]">
                                  {viewMode === "active" ? (
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteUser(user)}
                                      className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 transition-all font-black text-xs"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                      Move to Trash
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteUser(user)}
                                      className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-green-600 hover:bg-green-50 focus:bg-green-50 transition-all font-black text-xs"
                                    >
                                      <RotateCcw className="w-4 h-4 text-green-500" />
                                      Restore User
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Small Screen Card View */}
                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50/30">
                  {filteredUsers.map((user) => {
                    const roleBadge = getRoleBadge(user.role);
                    return (
                      <div key={user.id} className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 ring-2 ring-background shadow-lg rounded-2xl overflow-hidden">
                              {user.profilePicture && (
                                <AvatarImage src={getUploadedFileUrl(user.profilePicture)} alt={user.fullName} className="object-cover" />
                              )}
                              <AvatarFallback className="bg-[#334d3d] text-[#FEF8C3] font-black text-xs">
                                {getInitials(user.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <h3 className="font-black text-foreground truncate max-w-[140px] leading-tight">{user.fullName}</h3>
                              <p className="text-[11px] text-muted-foreground font-bold truncate max-w-[140px]">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="p-2 bg-gray-50 rounded-xl text-gray-400">
                                <MoreVertical className="w-5 h-5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-white shadow-2xl border-0 rounded-2xl p-2 z-[60]">
                                {viewMode === "active" ? (
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteUser(user)}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 font-black text-xs"
                                  >
                                    <Trash2 className="w-4 h-4" /> Move to Trash
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteUser(user)}
                                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-green-600 font-black text-xs"
                                  >
                                    <RotateCcw className="w-4 h-4" /> Restore User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wider border uppercase ${roleBadge.className}`}>
                            {roleBadge.label}
                          </span>
                          {user.isEmailVerified ? (
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">Verified</span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">Pending</span>
                          )}
                        </div>

                        <div className="pt-3 border-t border-muted/50 flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' })}</span>
                          {viewMode === "active" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="text-primary hover:text-primary/80 font-extrabold flex items-center gap-1">
                                Role Settings <ChevronDown className="w-3 h-3" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-56 bg-white shadow-2xl border-0 rounded-2xl p-2 z-[100]"
                              >
                                <DropdownMenuLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-3">
                                  Assign New Role
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-50 mx-2" />
                                {["user", "partner", "affiliate", "sales", "support", "admin"].map((r) => (
                                  <DropdownMenuItem
                                    key={r}
                                    onClick={() => handleUpdateRole(user, r as any)}
                                    className="px-3 py-3 rounded-xl text-xs font-bold capitalize cursor-pointer hover:bg-gray-50"
                                  >
                                    <span>{r.replace("_", " ")}</span>
                                    {user.role === r && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                  </DropdownMenuItem>
                                ))}
                                {currentSessionUser?.role === "super_admin" && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRole(user, "super_admin")}
                                    className="px-3 py-3 rounded-xl text-xs font-black text-red-600 cursor-pointer hover:bg-red-50"
                                  >
                                    <span>Super Admin</span>
                                    {user.role === "super_admin" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 md:p-6 rounded-[24px] md:rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 gap-4">
          <p className="text-[11px] md:text-xs text-muted-foreground font-black uppercase tracking-widest text-center sm:text-left">
            Showing Page <span className="text-foreground mx-1">{pagination.page}</span> 
            of <span className="text-foreground mx-1">{pagination.pages}</span>
            <span className="mx-3 opacity-20">|</span>
            Total <span className="text-foreground mx-1">{pagination.total}</span> Results
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchUsers(pagination.page - 1)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-white text-gray-700 border-2 border-gray-50 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black text-[10px] uppercase tracking-wider"
            >
              Previous
            </button>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchUsers(pagination.page + 1)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black text-[10px] uppercase tracking-wider shadow-lg shadow-primary/10"
            >
              Next
            </button>
          </div>
        </div>

        {/* Add User Modal */}
        {isAddUserModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-t-[32px] sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-300 border border-gray-100 max-h-[95vh] flex flex-col">
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50/50 to-white shrink-0">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
                    Add New User
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium mt-1">
                    Create a new account and assign permissions.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="text-gray-400 hover:text-gray-900 p-2.5 rounded-full hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
 
              <form onSubmit={handleAddUser} className="p-6 md:p-8 space-y-6 overflow-y-auto scrollbar-none">
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="p-1.5 bg-gray-100 rounded-lg group-focus-within:bg-black group-focus-within:text-white transition-colors duration-200">
                          <Users className="w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                        </div>
                      </div>
                      <input
                        type="text"
                        required
                        value={newUser.fullName}
                        onChange={(e) =>
                          setNewUser({ ...newUser, fullName: e.target.value })
                        }
                        className="w-full pl-14 pr-4 py-3 bg-muted/30 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary/10 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="p-1.5 bg-gray-100 rounded-lg group-focus-within:bg-black group-focus-within:text-white transition-colors duration-200">
                          <Mail className="w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                        </div>
                      </div>
                      <input
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        className="w-full pl-14 pr-4 py-3 bg-muted/30 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary/10 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="p-1.5 bg-gray-100 rounded-lg group-focus-within:bg-black group-focus-within:text-white transition-colors duration-200">
                          <Lock className="w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                        </div>
                      </div>
                      <input
                        type="password"
                        required
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        className="w-full pl-14 pr-4 py-3 bg-muted/30 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary/10 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground"
                        placeholder="••••••••"
                        minLength={8}
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                      Account Role
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="p-1.5 bg-gray-100 rounded-lg group-focus-within:bg-black group-focus-within:text-white transition-colors duration-200">
                          <Shield className="w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                        </div>
                      </div>
                      <select
                        required
                        value={newUser.role}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            role: e.target.value as any,
                          })
                        }
                        className="w-full pl-14 pr-10 py-3 bg-muted/30 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary/10 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-foreground appearance-none cursor-pointer"
                      >
                        <option value="user">Client</option>
                        <option value="partner">Space Partner</option>
                        <option value="affiliate">Affiliate Partner</option>
                        <option value="admin">Admin</option>
                        {currentSessionUser?.role === "super_admin" && (
                          <option value="super_admin">Super Admin</option>
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex flex-col-reverse sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="flex-1 px-6 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-200 font-extrabold transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] px-6 py-4 bg-primary text-primary-foreground rounded-2xl hover:opacity-90 font-black transition-all duration-200 shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating User...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        <span>Create User</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
