import { useEffect, useState } from "react";
import api from "../api/axiosApi";
import { FinanceData } from "../components/common/dashboard/finances/financeData";

export const useFinanceData = () => {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.post({ action: "getUserFinanceData" });
        
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching finance data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading };
};