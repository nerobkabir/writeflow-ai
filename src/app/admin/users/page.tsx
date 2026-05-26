"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { MoreHorizontal, Search, User, ShieldAlert, Ban, Check, UserMinus } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  plan: "FREE" | "PRO" | "TEAM";
  createdAt: string;
  avatar: string | null;
  isBanned: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Dropdown menu state
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // AlertDialog state
  const [banPromptUser, setBanPromptUser] = useState<AdminUser | null>(null);
  
  const [tbodyRef] = useAutoAnimate<HTMLTableSectionElement>();
  const debouncedSearch = useDebouncedValue(search, 300);

  // Fetch users list
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      search: debouncedSearch,
      role,
    });
    fetch(`/api/admin/users?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users ?? []);
        setTotalPages(d.totalPages ?? 1);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [debouncedSearch, role, page]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenActionId(null);
      }
    };
    if (openActionId) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openActionId]);

  // Handle patching users (optimistic update first, then database sync)
  const patchUser = async (
    id: string,
    body: { role?: "USER" | "ADMIN"; isBanned?: boolean }
  ) => {
    // 1. Capture current state for rollback
    const originalUsers = [...users];

    // 2. Perform optimistic update instantly
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              ...(body.role ? { role: body.role } : {}),
              ...(body.isBanned !== undefined ? { isBanned: body.isBanned } : {}),
            }
          : u
      )
    );

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      toast.success("User updated successfully");
    } catch (error) {
      // Rollback on failure
      setUsers(originalUsers);
      toast.error("Failed to update user. Reverting changes...");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-sm text-muted-foreground">Search, ban, and modify user access permissions.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name or email..."
              className="h-10 w-full sm:w-[240px] rounded-lg border border-border bg-surface pl-9 pr-4 text-sm focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm focus:border-foreground focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-badge text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Avatar + Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Join Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody ref={tbodyRef} className="divide-y divide-border">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 rounded-full border-2 border-border border-t-accent animate-spin" />
                      <span>Loading user directory...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <p className="font-semibold text-foreground">No users found</p>
                      <p className="text-xs">Try adjusting your filters or search terms.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-badge/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-badge/60 text-foreground flex items-center justify-center font-bold text-xs shrink-0 select-none">
                          {user.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            user.name?.[0]?.toUpperCase() || "U"
                          )}
                        </div>
                        <span className="font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                          user.role === "ADMIN"
                            ? "bg-foreground text-background"
                            : "border border-border text-muted-foreground"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                          user.plan === "FREE"
                            ? "border border-border text-muted-foreground"
                            : user.plan === "PRO"
                            ? "bg-foreground text-background"
                            : "bg-accent text-accent-foreground"
                        }`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground font-medium text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            user.isBanned ? "bg-error animate-pulse" : "bg-success"
                          }`}
                        />
                        <span className={user.isBanned ? "text-error" : "text-success"}>
                          {user.isBanned ? "Banned" : "Active"}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right relative">
                      <button
                        className="rounded-lg p-2 hover:bg-badge text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setOpenActionId((prev) => (prev === user.id ? null : user.id))}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {/* Accessible Dropdown menu */}
                      <AnimatePresence>
                        {openActionId === user.id && (
                          <div ref={dropdownRef} className="absolute right-5 z-20 mt-1 w-48 origin-top-right rounded-xl border border-border bg-surface p-1 shadow-lg">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.12 }}
                            >
                              <button
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-badge transition-colors"
                                onClick={() => {
                                  setOpenActionId(null);
                                  patchUser(user.id, {
                                    role: user.role === "ADMIN" ? "USER" : "ADMIN",
                                  });
                                }}
                              >
                                <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
                                Make {user.role === "ADMIN" ? "User" : "Admin"}
                              </button>

                              <button
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-badge transition-colors"
                                onClick={() => {
                                  setOpenActionId(null);
                                  if (user.isBanned) {
                                    patchUser(user.id, { isBanned: false });
                                  } else {
                                    setBanPromptUser(user);
                                  }
                                }}
                              >
                                <Ban className="h-3.5 w-3.5 text-muted-foreground" />
                                {user.isBanned ? "Unban User" : "Ban User"}
                              </button>

                              <a
                                href={`/dashboard/profile?user=${user.id}`}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground hover:bg-badge transition-colors"
                              >
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                View Profile
                              </a>
                            </motion.div>
                          </div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-border/60 pt-4">
        <p className="text-xs text-muted-foreground">
          Showing Page <span className="font-semibold text-foreground">{page}</span> of{" "}
          <span className="font-semibold text-foreground">{totalPages}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-badge transition-colors disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-badge transition-colors disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* Premium custom Framer Motion Ban AlertDialog Modal */}
      <AnimatePresence>
        {banPromptUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setBanPromptUser(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-xl relative z-10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error-bg text-error mb-4">
                <UserMinus className="h-5.5 w-5.5" />
              </div>
              
              <h2 className="text-lg font-bold tracking-tight text-foreground">Are you sure?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground/90">
                This will prevent <span className="font-semibold text-foreground">{banPromptUser.name}</span> from logging in and writing or accessing documents.
              </p>
              
              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  className="rounded-xl border border-border bg-surface hover:bg-badge px-4 py-2 text-xs font-semibold text-foreground transition-colors"
                  onClick={() => setBanPromptUser(null)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-error hover:bg-error/90 px-4 py-2 text-xs font-semibold text-white transition-colors"
                  onClick={() => {
                    const id = banPromptUser.id;
                    setBanPromptUser(null);
                    patchUser(id, { isBanned: true });
                  }}
                >
                  Ban User
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
