import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import companyService from "../services/company.service";

export default function useCompanies(options = {}) {
  const debounceEnabled = options.debounce ?? false;

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(
    search,
    debounceEnabled ? 500 : 0
  );

  const loadCompanies = async () => {
  try {
    setLoading(true);

    const response = await companyService.getCompanies({
      search: debouncedSearch,
    });

    setCompanies(
      response?.data?.companies || []
    );

  } catch (err) {
    console.error(err);
    const message = err?.response?.data?.message || err?.message || "Failed to load companies";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadCompanies();
  }, [debouncedSearch]);

  return {
    companies,
    loading,
    search,
    setSearch,
    reload: loadCompanies,
  };
}
