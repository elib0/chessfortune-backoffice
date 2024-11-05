"use client";

import { useState, useEffect } from "react";
import { Permission } from "../../types";
import { httpHeaderOptions } from "@/helpers";

const useFetchPermissions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchUsersPermissions = async () => {
      setLoading(true);

      try {
        const data = await fetch("/api/permissions", {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { permissions: permissionsData } = await data.json();

        setPermissions(permissionsData);
      } catch (error) {
        console.error("Error fetching permissions: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersPermissions();
  }, []);

  return { loading, permissions };
};

export default useFetchPermissions;
