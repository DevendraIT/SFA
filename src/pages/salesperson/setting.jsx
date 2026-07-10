import { useState } from "react";
import { Bell, Lock, UserCircle2, Palette, Save } from "lucide-react";

const sections = [
  { key: "profile", label: "Profile", icon: UserCircle2 },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Lock },
  { key: "appearance", label: "Appearance", icon: Palette },
];

export default function SPSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="mt-2 text-slate-500">Manage your account preferences and app behavior.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="space-y-2">
            {sections.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  activeTab === key
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {activeTab === "profile" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Profile</h2>
                <p className="text-sm text-slate-500">Update your personal and work details.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Full name" defaultValue="Rahul Sharma" />
                <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Email" defaultValue="rahul@abcpharma.com" />
                <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Phone" defaultValue="9876543210" />
                <input className="rounded-xl border border-slate-200 px-4 py-3" placeholder="Territory" defaultValue="Indore" />
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
              {[
                "Daily visit reminders",
                "Order alerts",
                "Lead follow-up alerts",
                "Weekly summary",
              ].map((item) => (
                <label key={item} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
                  <span>{item}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                </label>
              ))}
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">Security</h2>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Current password" type="password" />
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="New password" type="password" />
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Confirm password" type="password" />
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">Appearance</h2>
              <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
                <span>Dark mode</span>
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
                <span>Compact layout</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
              </label>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white transition hover:bg-orange-600">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}