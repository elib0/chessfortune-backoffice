"use client";

import { useState, useEffect } from "react";
import { ProfileData } from "../../types";
import toast from "react-hot-toast";
import { httpHeaderOptions } from "@/helpers";

const useFetchUserByEmail = (userId: string) => {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserByEmail = async () => {
      setLoading(true);

      try {
        const data = await fetch(`/api/users/email/${userId}`, {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { user: userData } = await data.json();

        setUser(userData);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching user by Email");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserByEmail();
  }, [userId]);

  return { user, loading };
};

export default useFetchUserByEmail;
