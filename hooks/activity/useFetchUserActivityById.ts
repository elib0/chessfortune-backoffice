"use client";

import { useState, useEffect } from "react";
import { Activity } from "../../types";
import toast from "react-hot-toast";
import { httpHeaderOptions } from "@/helpers";

const useFetchUserActivityById = (userId: string) => {
  const [userActivity, setUserActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserActivity = async () => {
      setLoading(true);

      try {
        const data = await fetch(`/api/users/activity/${userId}`, {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { activities } = await data.json();

        setUserActivity(activities);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching user activity by ID");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserActivity();
  }, [userId]);

  return { userActivity, loading };
};

export default useFetchUserActivityById;
