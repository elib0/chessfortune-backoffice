"use client";

import { useState, useEffect } from "react";
import { ProfileData } from "../../types";
import toast from "react-hot-toast";
import { httpHeaderOptions } from "@/helpers";

const useFetchUserById = (userId: string) => {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserById = async () => {
      setLoading(true);

      try {
        const data = await fetch(`/api/users/${userId}`, {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { user: userData } = await data.json();

        setUser(userData);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching user by ID");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserById();
  }, [userId]);

  return { user, loading };
};

export default useFetchUserById;
