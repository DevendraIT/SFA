import { useCallback, useEffect, useState } from "react";
import userApi from "../api/user.api";
import { useAuth } from "../context/AuthContext";

export default function useTeamMembers() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMembers = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getSubordinates(user.id);
      setMembers(response.data?.data?.subordinates || response.data?.subordinates || []);
    } catch (err) {
      console.error("Team Members Error:", err);
      setError(err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return {
    members,
    loading,
    error,
    refresh: loadMembers,
  };
}

