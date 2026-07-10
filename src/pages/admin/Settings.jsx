import { useMemo, useState } from "react";
import { Bell, ShieldCheck, SlidersHorizontal, Save } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import Card from "../../components/ui/Card.jsx";
import storage from "../../services/storage.js";

const settingsSections = [
  { title: "Notifications", icon: Bell, description: "Control alerts for targets, approvals, and system events." },
  { title: "Security", icon: ShieldCheck, description: "Enforce session timeout and role-based access confidence." },
  { title: "Workflows", icon: SlidersHorizontal, description: "Fine-tune approval rules and auto-routing logic." },
];

export default function Settings() {
  const [preferences, setPreferences] = useState(() => storage.getSettings());

  const savePreferences = () => {
    storage.updateSettings(preferences);
  };

  const updateSetting = (key, value) => setPreferences((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Adjust platform-level controls for admins and supervisors.</p>
      </div>

      <div className="grid gap-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600"><Icon size={20} /></div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{section.title}</h2>
                    <p className="text-sm text-slate-500 mt-1">{section.description}</p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={Boolean(preferences[section.title.toLowerCase()])} onChange={(e) => updateSetting(section.title.toLowerCase(), e.target.checked)} />
                  Enable
                </label>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Admin preferences</h2>
            <p className="text-sm text-slate-500 mt-1">Save your current admin defaults for dashboards and alerts.</p>
          </div>
          <Button icon={Save} onClick={savePreferences}>Save changes</Button>
        </div>
      </Card>
    </div>
  );
}