// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from "react";
import NavBar from "@/components/common/NavBar";
import { useAuth } from "@/context/useAuth";

const parties = [
  { value: "lab", label: "Labour" },
  { value: "con", label: "Conservative" },
  { value: "ld", label: "Liberal Democrats" },
  { value: "green", label: "Green" },
  { value: "snp", label: "SNP" },
  { value: "reform", label: "Reform UK" },
  { value: "other", label: "Other" },
];

const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [constituency, setConstituency] = useState(user?.constituency || "");
  const [partyOverride, setPartyOverride] = useState(user?.dashboardParty || "");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.profilePicUrl || null
  );
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [message, setMessage] = useState("");

  // Load saved user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.profilePicUrl) setPreviewUrl(parsed.profilePicUrl);
    }
  }, [setUser]);

  // Handle preview for new uploads
  useEffect(() => {
    if (!profilePic) return;
    const url = URL.createObjectURL(profilePic);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePic]);

  // Handle theme change
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setMessage("❌ Not logged in");
        return;
      }

      let uploadedPicUrl = previewUrl;

      // 🔹 Upload profile picture if new file selected
      if (profilePic) {
        const formData = new FormData();
        formData.append("file", profilePic);

        const uploadRes = await fetch(
          `${import.meta.env.VITE_API_URL}/me/upload-profile-pic`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }, // ✅ Auth only
            body: formData,
          }
        );

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Upload failed");
        }
        uploadedPicUrl = uploadData.profilePicUrl;
      }

      // 🔹 Save settings
      const res = await fetch(`${import.meta.env.VITE_API_URL}/me/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName,
          constituency,
          dashboardParty: partyOverride,
          profilePicUrl: uploadedPicUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("✅ Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Save error:", err.message);
      } else {
        console.error("Unknown error:", err);
      }
      setMessage("❌ Error saving settings.");
    }
  };

  const handleResetProfilePic = () => {
    setProfilePic(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-900 px-6">
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8 w-full max-w-2xl">
          <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            ⚙️ Settings
          </h1>

          {/* Profile Picture */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfilePic(e.target.files ? e.target.files[0] : null)
                  }
                />
                {previewUrl && (
                  <button
                    onClick={handleResetProfilePic}
                    className="ml-2 text-sm text-red-500"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Email (read-only) */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-white opacity-70 cursor-not-allowed"
            />
          </div>

          {/* Constituency */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
              Constituency
            </label>
            <input
              type="text"
              value={constituency}
              onChange={(e) => setConstituency(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Theme Toggle */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-white"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>

          {/* Party Override Dropdown */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
              Dashboard Party Override
            </label>
            <select
              value={partyOverride}
              onChange={(e) => setPartyOverride(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-white"
            >
              <option value="">None (Use Prediction)</option>
              {parties.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy Link */}
          <div className="mb-6">
            <a
              href="/privacy"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              Privacy Policy / Data Usage
            </a>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Save Changes
          </button>

          {/* Success/Error Message */}
          {message && (
            <p className="mt-3 text-center text-sm font-medium text-green-500">
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
