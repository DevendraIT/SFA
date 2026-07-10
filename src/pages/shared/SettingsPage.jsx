import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Moon, Sun, Globe, Bell, Lock, LogOut, Save } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { Input, Select } from "../../components/ui/Input.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import storage from "../../services/storage.js";
import { showSuccess, showError } from "../../context/ToastContext.jsx";

export default function SettingsPage({ theme: roleTheme = "indigo" }) {
  const { theme, setTheme } = useTheme();
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => storage.getSettings());

  const { register, handleSubmit } = useForm({ defaultValues: settings });

  const onSaveSettings = (data) => {
    storage.updateSettings(data);
    setSettings(data);
    if (data.theme) setTheme(data.theme);
    showSuccess("Settings saved");
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    const current = e.target.current.value;
    const newPass = e.target.new.value;
    const confirm = e.target.confirm.value;
    if (newPass !== confirm) { showError("Passwords do not match"); return; }
    if (newPass.length < 6) { showError("Password must be at least 6 characters"); return; }
    const result = changePassword(current, newPass);
    if (result.success) { showSuccess("Password changed"); e.target.reset(); }
    else showError(result.error);
  };

  const accent = {
    indigo: "from-indigo-600 to-purple-600",
    blue: "from-blue-600 to-emerald-500",
    purple: "from-purple-600 to-cyan-500",
    orange: "from-orange-500 to-green-500",
  }[roleTheme];

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>

      <Card className={`p-6 bg-gradient-to-r ${accent} text-white`}>
        <h2 className="font-bold text-lg">{user?.name}</h2>
        <p className="text-sm opacity-80">{user?.email}</p>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Globe className="w-5 h-5" /> General</h3>
        <form onSubmit={handleSubmit(onSaveSettings)} className="space-y-4">
          <Select label="Theme" options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} {...register("theme")} />
          <Select label="Language" options={[{ value: "en", label: "English" }, { value: "hi", label: "Hindi" }]} {...register("language")} />
          <Select label="Currency" options={["INR", "USD", "EUR"]} {...register("currency")} />
          <Button type="submit" icon={Save}>Save Settings</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</h3>
        <div className="space-y-3">
          {["email", "push", "sms"].map((key) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked={settings.notifications?.[key]} onChange={(e) => {
                storage.updateSettings({ notifications: { ...settings.notifications, [key]: e.target.checked } });
                setSettings(storage.getSettings());
                showSuccess("Notification preference updated");
              }} className="rounded" />
              <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">{key} notifications</span>
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Lock className="w-5 h-5" /> Change Password</h3>
        <form onSubmit={onChangePassword} className="space-y-4">
          <Input label="Current Password" name="current" type="password" required />
          <Input label="New Password" name="new" type="password" required />
          <Input label="Confirm Password" name="confirm" type="password" required />
          <Button type="submit">Update Password</Button>
        </form>
      </Card>

      <Button variant="danger" icon={LogOut} onClick={() => { logout(); navigate("/login"); }} className="w-full">
        Logout
      </Button>
    </div>
  );
}
