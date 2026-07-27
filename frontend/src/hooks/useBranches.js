import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import branchService from "../services/branch.service";

export default function useBranches(options = {}) {
  const debounceEnabled = options.debounce ?? false;

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(
    search,
    debounceEnabled ? 500 : 0
  );

  const loadBranches = async () => {
    try {
      setLoading(true);

      const response = await branchService.getBranches({
        search: debouncedSearch,
      });

      setBranches(
        response?.data?.branches || []
      );
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || err?.message || "Failed to load branches";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, [debouncedSearch]);

  return {
    branches,
    loading,
    search,
    setSearch,
    reload: loadBranches,
  };
}

