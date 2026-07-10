import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Shield,
  Moon,
  Sun,
  Save,
} from "lucide-react";

export default function HOSSettings() {
  const [darkMode, setDarkMode] = useState(false);

  const [profile, setProfile] = useState({
    name: "Ayushi Jain",
    email: "ayushi@example.com",
    phone: "+91 9876543210",
    designation: "Head of Sales",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Settings
          </h1>

          <p className="text-gray-500">
            Manage your profile and application preferences.
          </p>

        </div>

        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">

          <Save size={18} />

          Save Changes

        </button>

      </div>

      {/* Profile */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex items-center gap-3 mb-6">

          <User className="text-blue-600" />

          <h2 className="text-xl font-semibold">
            Profile Settings
          </h2>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Designation
            </label>

            <input
              type="text"
              name="designation"
              value={profile.designation}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg p-3"
            />

          </div>

        </div>

      </div>

      {/* Change Password */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex items-center gap-3 mb-6">

          <Lock className="text-red-600" />

          <h2 className="text-xl font-semibold">
            Change Password
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-5">

          <input
            type="password"
            placeholder="Current Password"
            className="border rounded-lg p-3"
          />

          <input
            type="password"
            placeholder="New Password"
            className="border rounded-lg p-3"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="border rounded-lg p-3"
          />

        </div>

      </div>

      {/* Notification Settings */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex items-center gap-3 mb-6">

          <Bell className="text-yellow-500" />

          <h2 className="text-xl font-semibold">
            Notification Settings
          </h2>

        </div>

        <div className="space-y-4">

          <label className="flex justify-between items-center">

            Email Notifications

            <input type="checkbox" defaultChecked />

          </label>

          <label className="flex justify-between items-center">

            SMS Notifications

            <input type="checkbox" defaultChecked />

          </label>

          <label className="flex justify-between items-center">

            Push Notifications

            <input type="checkbox" />

          </label>

        </div>

      </div>
            {/* Team Settings */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-6">
          Team Settings
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block text-sm font-medium mb-2">
              Default Team
            </label>

            <select className="w-full border rounded-lg p-3">

              <option>North Region</option>
              <option>South Region</option>
              <option>East Region</option>
              <option>West Region</option>

            </select>

          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              Default Dashboard
            </label>

            <select className="w-full border rounded-lg p-3">

              <option>Overview</option>
              <option>Analytics</option>
              <option>Orders</option>
              <option>Customers</option>

            </select>

          </div>

        </div>

      </div>

      {/* Security Settings */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex items-center gap-3 mb-6">

          <Shield className="text-green-600" />

          <h2 className="text-xl font-semibold">
            Security Settings
          </h2>

        </div>

        <div className="space-y-5">

          <label className="flex justify-between items-center">

            Enable Two-Factor Authentication

            <input type="checkbox" defaultChecked />

          </label>

          <label className="flex justify-between items-center">

            Login Alerts

            <input type="checkbox" defaultChecked />

          </label>

          <label className="flex justify-between items-center">

            Allow New Device Login

            <input type="checkbox" />

          </label>

          <label className="flex justify-between items-center">

            Auto Logout After 30 Minutes

            <input type="checkbox" defaultChecked />

          </label>

        </div>

      </div>

      {/* Theme Settings */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-6">
          Theme Settings
        </h2>

        <div className="flex items-center justify-between">

          <div>

            <p className="font-semibold">
              Dark Mode
            </p>

            <p className="text-sm text-gray-500">
              Switch between Light and Dark theme.
            </p>

          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition ${
              darkMode
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {darkMode ? (
              <>
                <Moon size={18} />
                Dark
              </>
            ) : (
              <>
                <Sun size={18} />
                Light
              </>
            )}
          </button>

        </div>

      </div>

      {/* Session Management */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-6">
          Active Sessions
        </h2>

        <div className="space-y-4">

          {[
            {
              device: "Windows 11 - Chrome",
              location: "Bhopal",
              time: "Active Now",
            },
            {
              device: "Android Mobile",
              location: "Indore",
              time: "Today 09:20 AM",
            },
            {
              device: "MacBook Pro",
              location: "Delhi",
              time: "Yesterday",
            },
          ].map((session, index) => (

            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center md:justify-between border rounded-lg p-4 gap-4"
            >

              <div>

                <h3 className="font-semibold">
                  {session.device}
                </h3>

                <p className="text-sm text-gray-500">
                  {session.location}
                </p>

              </div>

              <div className="text-gray-500">
                {session.time}
              </div>

              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                Logout
              </button>

            </div>

          ))}

        </div>

      </div>

      {/* Login History */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-5">
          Login History
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">
                  Date
                </th>

                <th className="text-left p-4">
                  Device
                </th>

                <th className="text-left p-4">
                  Location
                </th>

                <th className="text-left p-4">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {[
                {
                  date: "08 Jul 2026",
                  device: "Chrome",
                  location: "Bhopal",
                  status: "Success",
                },
                {
                  date: "07 Jul 2026",
                  device: "Android",
                  location: "Indore",
                  status: "Success",
                },
                {
                  date: "06 Jul 2026",
                  device: "Firefox",
                  location: "Delhi",
                  status: "Success",
                },
              ].map((item, index) => (

                <tr
                  key={index}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4">
                    {item.date}
                  </td>

                  <td className="p-4">
                    {item.device}
                  </td>

                  <td className="p-4">
                    {item.location}
                  </td>

                  <td className="p-4">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}