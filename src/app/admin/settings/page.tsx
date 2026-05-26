"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, ShieldAlert, Cpu, Sparkles, Image, RefreshCw, HelpCircle } from "lucide-react";

type SiteSettingsType = {
  siteName: string;
  logoUrl: string | null;
  maintenanceMode: boolean;
  draftAgentOn: boolean;
  rewriteAgentOn: boolean;
  chatAgentOn: boolean;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Form states
  const [siteName, setSiteName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Confirmation Alert Dialog
  const [resetPrompt, setResetPrompt] = useState(false);

  // Fetch settings
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.settings) {
          setSettings(d.settings);
          setSiteName(d.settings.siteName || "WriteFlow AI");
          setLogoUrl(d.settings.logoUrl || "");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Handle instant toggle settings (optimistic updates)
  const toggleSetting = async (key: keyof SiteSettingsType, value: boolean) => {
    if (!settings) return;

    const originalSettings = { ...settings };

    // Optimistically update locally
    setSettings({
      ...settings,
      [key]: value,
    });

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });

      if (!res.ok) throw new Error();
      toast.success("Settings updated successfully");
    } catch {
      toast.error("Failed to update settings. Reverting...");
      setSettings(originalSettings);
    }
  };

  // Save branding (Site name, logo url)
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: siteName.trim(),
          logoUrl: logoUrl.trim() || null,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("Branding settings saved successfully");
    } catch {
      toast.error("Failed to save branding settings");
    } finally {
      setSaving(false);
    }
  };

  // Reset to factory defaults (Danger Zone)
  const handleReset = async () => {
    setResetPrompt(false);
    setResetting(true);

    const defaults = {
      siteName: "WriteFlow AI",
      logoUrl: null,
      maintenanceMode: false,
      draftAgentOn: true,
      rewriteAgentOn: true,
      chatAgentOn: true,
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaults),
      });

      if (!res.ok) throw new Error();

      setSettings(defaults as any);
      setSiteName("WriteFlow AI");
      setLogoUrl("");
      toast.success("Settings reset to defaults successfully");
    } catch {
      toast.error("Failed to reset settings");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
        <span className="text-sm text-muted-foreground animate-pulse">Loading system settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-sm text-muted-foreground">Manage global application configurations and toggles.</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-border/60 pb-3">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-[15px] font-bold tracking-tight">General Branding</h2>
          </div>

          <form onSubmit={handleSaveBranding} className="space-y-5">
            <label className="block space-y-1.5 text-sm">
              <span className="text-xs font-semibold text-muted-foreground">Site Name</span>
              <input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Site Name"
                required
                className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-xs focus:border-foreground focus:outline-none transition-colors"
              />
            </label>

            <div className="space-y-1.5">
              <label className="block space-y-1.5 text-sm">
                <span className="text-xs font-semibold text-muted-foreground">Logo URL</span>
                <input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-xs focus:border-foreground focus:outline-none transition-colors"
                />
              </label>

              {logoUrl && (
                <div className="mt-3">
                  <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Logo Preview</span>
                  <div className="inline-flex items-center justify-center p-3 rounded-lg border border-border bg-badge h-14 w-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-foreground hover:bg-foreground/90 px-4 py-2.5 text-xs font-bold text-background disabled:opacity-60 transition-colors shadow-sm"
              >
                {saving ? "Saving General..." : "Save General"}
              </button>
            </div>
          </form>
        </div>

        {/* Maintenance Mode */}
        {settings && (
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-border/60 pb-3">
              <ShieldAlert className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-[15px] font-bold tracking-tight">Maintenance Mode</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-md">
                <h3 className="text-sm font-semibold text-foreground">Lock Down Application</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Toggle on to display a maintenance guard screen blocking regular and guest users. 
                  Administrators remain completely unaffected and can manage the site.
                </p>
              </div>

              {/* Large Premium Animatable Toggle */}
              <button
                type="button"
                onClick={() => toggleSetting("maintenanceMode", !settings.maintenanceMode)}
                className={`relative h-7 w-12 rounded-full cursor-pointer select-none shrink-0 transition-colors duration-200 ${
                  settings.maintenanceMode ? "bg-error" : "bg-border"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-background shadow transition-transform duration-200 ${
                    settings.maintenanceMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* AI Agents Toggles */}
        {settings && (
          <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-border/60 pb-3">
              <Cpu className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-[15px] font-bold tracking-tight">AI Agents Status</h2>
            </div>

            <div className="space-y-6 divide-y divide-border/60">
              {/* Draft Agent */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold text-foreground">Content Draft Agent</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Powers first-draft generation and template workflows in AI Writer. Disabling returns a 503 error.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSetting("draftAgentOn", !settings.draftAgentOn)}
                  className={`relative h-6 w-10 rounded-full cursor-pointer select-none shrink-0 transition-colors duration-200 ${
                    settings.draftAgentOn ? "bg-success" : "bg-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform duration-200 ${
                      settings.draftAgentOn ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Rewrite Agent */}
              <div className="flex items-center justify-between gap-4 pt-4">
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-sky-500" />
                    <h3 className="text-xs font-bold text-foreground">Rewrite & Tone Agent</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Powers editing commands like rewriting, expanding, and summarizing in tip-tap editor. Disabling returns a 503 error.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSetting("rewriteAgentOn", !settings.rewriteAgentOn)}
                  className={`relative h-6 w-10 rounded-full cursor-pointer select-none shrink-0 transition-colors duration-200 ${
                    settings.rewriteAgentOn ? "bg-success" : "bg-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform duration-200 ${
                      settings.rewriteAgentOn ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Chat Agent */}
              <div className="flex items-center justify-between gap-4 pt-4">
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-xs font-bold text-foreground">Chat Assistant</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Powers conversational workspace sidebar chat queries. Disabling returns a 503 error.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSetting("chatAgentOn", !settings.chatAgentOn)}
                  className={`relative h-6 w-10 rounded-full cursor-pointer select-none shrink-0 transition-colors duration-200 ${
                    settings.chatAgentOn ? "bg-success" : "bg-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform duration-200 ${
                      settings.chatAgentOn ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="rounded-xl border border-error bg-error-bg/20 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[15px] font-bold tracking-tight text-error">Danger Zone</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-md">
              <h3 className="text-xs font-bold text-foreground">Reset all settings to defaults</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Resets site title, clears custom logo, turns off maintenance mode, and enables all AI assistants. This action is irreversible.
              </p>
            </div>

            <button
              onClick={() => setResetPrompt(true)}
              className="rounded-xl bg-error hover:bg-error/90 px-4 py-2.5 text-xs font-bold text-white transition-colors shrink-0 shadow-sm"
            >
              Reset to defaults
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone Reset Confirmation AlertDialog Modal */}
      <AnimatePresence>
        {resetPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setResetPrompt(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-xl relative z-10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error-bg text-error mb-4 animate-pulse">
                <RefreshCw className="h-5.5 w-5.5" />
              </div>

              <h2 className="text-lg font-bold tracking-tight text-foreground">Reset configuration?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground/90">
                This will reset site name back to <span className="font-semibold text-foreground">"WriteFlow AI"</span>, clear custom logo images, turn off maintenance mode, and enable all AI workspace agents.
              </p>

              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  className="rounded-xl border border-border bg-surface hover:bg-badge px-4 py-2 text-xs font-semibold text-foreground transition-colors"
                  onClick={() => setResetPrompt(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-xl bg-error hover:bg-error/90 px-4 py-2 text-xs font-semibold text-white transition-colors"
                  onClick={handleReset}
                  disabled={resetting}
                >
                  {resetting ? "Resetting..." : "Reset Settings"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
