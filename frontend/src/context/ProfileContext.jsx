import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/profile");
      setProfile(data || null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveProfile = async (profileData) => {
    const { data } = await api.post("/profile", profileData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    setProfile(data);
    return data;
  };

  const deleteProfile = async () => {
    await api.delete("/profile");
    setProfile(null);
  };

  const value = useMemo(
    () => ({ profile, loading, error, refreshProfile: loadProfile, saveProfile, deleteProfile }),
    [profile, loading, error]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => useContext(ProfileContext);
