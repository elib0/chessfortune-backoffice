"use client";

import { useState, useEffect } from "react";
import { Activity } from "@/types";
import { httpHeaderOptions } from "@/helpers";

const useFetchActivities = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const data = await fetch("/api/activity", {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { activities: allActivities } = await data.json();

        setActivities(allActivities);
      } catch (error) {
        console.error("Error fetching activities: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { loading, activities };
};

export default useFetchActivities;
