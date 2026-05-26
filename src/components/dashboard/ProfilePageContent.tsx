"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, Check, Loader2 } from "lucide-react";
import CountUp from "react-countup";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileForm {
  name: string;
  bio: string;
}

interface Stats {
  documentsThisMonth: number;
  totalWordsGenerated: number;
  aiRequestsThisMonth: number;
  plan: string;
}

export function ProfilePageContent() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "loading" | "success">("idle");
  const [stats, setStats] = useState<Stats | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch } = useForm<ProfileForm>({
    defaultValues: { name: "", bio: "" },
  });

  const bio = watch("bio");

  useEffect(() => {
    async function load() {
      const [profileRes, statsRes] = await Promise.all([
        fetch("/api/user/profile"),
        fetch("/api/user/stats"),
      ]);
      if (profileRes.ok) {
        const { user } = await profileRes.json();
        setEmail(user.email);
        setAvatarUrl(user.avatar);
        reset({ name: user.name, bio: user.bio ?? "" });
      }
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
    }
    load();
  }, [reset]);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const res = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: dataUrl }),
        });
        if (!res.ok) throw new Error("Upload failed");
        toast.success("Avatar updated");
      } catch {
        toast.error("Failed to upload avatar");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProfileForm) => {
    setSaveState("loading");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaveState("success");
      setTimeout(() => setSaveState("idle"), 2000);
      toast.success("Profile saved");
    } catch {
      setSaveState("idle");
      toast.error("Failed to save profile");
    }
  };

  const initials =
    watch("name")?.[0]?.toUpperCase() || email[0]?.toUpperCase() || "U";

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-8 space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
        <p className="text-[14px] text-muted-foreground mt-1">
          Manage your account and writing preferences.
        </p>
      </div>

      <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative group w-20 h-20 rounded-full overflow-hidden border border-border shrink-0"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center bg-foreground text-background text-2xl font-bold">
              {initials}
            </span>
          )}
          <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            {uploading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarChange}
          />
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Full Name
            </label>
            <input
              {...register("name", { required: true })}
              className="mt-1 w-full px-3 py-2 text-[13px] rounded-lg border border-border bg-background outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Bio
            </label>
            <textarea
              {...register("bio")}
              maxLength={200}
              rows={3}
              className="mt-1 w-full px-3 py-2 text-[13px] rounded-lg border border-border bg-background outline-none focus:border-foreground resize-none"
            />
            <p className="text-[11px] text-muted-foreground mt-1 text-right">
              {bio?.length ?? 0}/200
            </p>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Email
            </label>
            <input
              value={email}
              readOnly
              className="mt-1 w-full px-3 py-2 text-[13px] rounded-lg border border-border bg-badge text-muted-foreground cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={saveState === "loading"}
            className={cn(
              "px-5 py-2.5 rounded-lg text-[12px] font-bold flex items-center gap-2 transition-all",
              saveState === "success"
                ? "bg-success text-white"
                : "bg-foreground text-background hover:opacity-90"
            )}
          >
            {saveState === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
            {saveState === "success" && <Check className="w-4 h-4" />}
            {saveState === "success" ? "Saved" : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="border border-border rounded-xl p-5 bg-surface">
        <span className="text-[10px] font-bold uppercase tracking-wider border border-border px-2 py-0.5 rounded">
          {stats?.plan ?? "PRO"} PLAN
        </span>
        <ul className="mt-4 space-y-2 text-[13px] text-muted-foreground">
          <li>• Unlimited AI document drafts</li>
          <li>• Contextual rewrite & chat agents</li>
          <li>• Priority Intelligence Pro models</li>
          <li>• Export & collaboration tools</li>
        </ul>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-border rounded-xl p-4 bg-surface">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Documents Created
            </p>
            <p className="text-3xl font-bold mt-2">
              <CountUp end={stats.documentsThisMonth} duration={1.2} />
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">this month</p>
          </div>
          <div className="border border-border rounded-xl p-4 bg-surface">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Words Generated
            </p>
            <p className="text-3xl font-bold mt-2">
              <CountUp end={stats.totalWordsGenerated} duration={1.2} separator="," />
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">all time</p>
          </div>
          <div className="border border-border rounded-xl p-4 bg-surface">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              AI Requests
            </p>
            <p className="text-3xl font-bold mt-2">
              <CountUp end={stats.aiRequestsThisMonth} duration={1.2} />
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">this month</p>
          </div>
        </div>
      )}
    </div>
  );
}
