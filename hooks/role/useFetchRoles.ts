"use client";

import { useState, useEffect } from "react";
import { Role } from "../../types";
import { httpHeaderOptions } from "@/helpers";

const useFetchRoles = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const data = await fetch("/api/roles", {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { roles: rolesData } = await data.json();

        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { loading, roles };
};

export default useFetchRoles;
