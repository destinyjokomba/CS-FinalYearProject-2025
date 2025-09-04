// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import auth from "@/context/useAuth";
import type { User } from "@/types/dashboard";

const parties = [
  { value: "lab", label: "Labour" },
  { value: "con", label: "Conservative" },
  { value: "ld", label: "Liberal Democrats" },
  { value: "green", label: "Green" },
  { value: "snp", label: "SNP" },
  { value: "reform", label: "Reform UK" },
  { value: "other", label: "Other" },
];

const regions = [
  "Scotland",
  "Wales",
  "North of England",
  "Midlands",
  "London",
  "South of England",
];

const SettingsPage: React.FC = () => {
  const location = useLocation();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [chosenAlignment, setChosenAlignment] = useState("");
  const [dashboardParty, setDashboardParty] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = auth.getUser();
    if (storedUser) {
      setDisplayName(storedUser.displayName || "");
      setEmail(storedUser.email || "");
      setRegion(storedUser.region || "");
      setChosenAlignment(storedUser.chosenAlignment || "");
      setDashboardParty(storedUser.dashboardParty || "");
      setPreviewUrl(storedUser.profilePicUrl || null);

      // Load alignment fallback from localStorage if available
      const storedAlignment = localStorage.getItem("chosenAlignment");
      if (storedAlignment && !storedUser.chosenAlignment) {
        setChosenAlignment(storedAlignment);
      }
    }
  }, [location.pathname]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemovePicture = () => {
    setProfilePic(null);
    setPreviewUrl(null);
    localStorage.removeItem("profilePicUrl");

    const storedUser = auth.getUser();
    if (storedUser) {
      storedUser.profilePicUrl = null;
      auth.setUser(storedUser);
    }
  };

  const handleSave = async () => {
    try {
      const token = auth.getToken();
      if (!token) {
        setMessage("❌ Not logged in");
        return;
      }

      let uploadedPicUrl: string | null = null;

      if (profilePic) {
        const formData = new FormData();
        formData.append("file", profilePic);

        const uploadRes = await fetch(
          `${import.meta.env.VITE_API_URL}/me/upload-profile-pic`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
        uploadedPicUrl = uploadData.profilePicUrl;

        if (uploadedPicUrl) {
          localStorage.setItem("profilePicUrl", uploadedPicUrl);
        }
      }

      const body: Record<string, unknown> = {
        displayName,
        region,
        chosenAlignment,
        dashboardParty,
      };
      if (uploadedPicUrl) body.profilePicUrl = uploadedPicUrl;
      if (previewUrl === null && !profilePic) {
        body.profilePicUrl = null;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/me/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      auth.setUser(data.user as User);

      if (data.user && (data.user as User).profilePicUrl === null) {
        localStorage.removeItem("profilePicUrl");
        setPreviewUrl(null);
      }

      if (chosenAlignment) {
        localStorage.setItem("chosenAlignment", chosenAlignment);
        localStorage.setItem("alignment_set", "true");
      }

      setMessage("✅ Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage("❌ " + err.message);
      } else {
        setMessage("❌ Error saving settings.");
      }
    }
  };

  return (
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
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile Preview"
              className="w-20 h-20 rounded-full mb-3 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 mb-3" />
          )}
          <div className="flex gap-3">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemovePicture}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
              >
                Remove
              </button>
            )}
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

        {/* Email */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
            Email
          </label>
          <input
            type="text"
            value={email}
            readOnly
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 dark:bg-slate-700 dark:text-gray-400"
          />
        </div>

        {/* Region */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Select a region</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Alignment */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
            Political Alignment
          </label>
          <select
            value={chosenAlignment}
            onChange={(e) => setChosenAlignment(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:text-white"
          >
            <option value="">None (Not selected)</option>
            {parties.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        >
          Save Changes
        </button>

        {message && (
          <p className="mt-3 text-center text-sm font-medium text-green-500">
            {message}
          </p>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Want to learn more about how we protect your data?{" "}
            <Link
              to="/security"
              data-testid="privacy-security-link"
              className="text-blue-600 hover:underline"
            >
              Read about Security & GDPR
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
