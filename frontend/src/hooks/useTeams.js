import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import teamService from "../services/team.service";

export default function useTeams(options = {}) {
  const debounceEnabled = options.debounce ?? false;

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(
    search,
    debounceEnabled ? 500 : 0
  );

  const loadTeams = async () => {
    try {
      setLoading(true);

      const response = await teamService.getTeams({
        search: debouncedSearch,
      });

      setTeams(
        response?.data?.teams || []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, [debouncedSearch]);

  return {
    teams,
    loading,
    search,
    setSearch,
    reload: loadTeams,
  };
}

