"use client";

import { useState, useEffect } from "react";
import { ProfileData } from "../../types";
import { httpHeaderOptions } from "@/helpers";

const useFetchUsers = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<ProfileData[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const data = await fetch("/api/users", {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { profiles } = await data.json();

        setUsers(profiles);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { loading, users };
};

export default useFetchUsers;
