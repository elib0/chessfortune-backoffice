"use client";

import { useState, useEffect } from "react";
import { ReportsData } from "../../types";
import { httpHeaderOptions } from "@/helpers";

const useFetchReports = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [reports, setReports] = useState<ReportsData[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/reports", {
          ...httpHeaderOptions,
        });
        const { reports: reportsData } = await response.json();

        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { loading, reports };
};

export default useFetchReports;
