"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { httpHeaderOptions } from "@/helpers";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/client";

const useFetchPermissionsById = () => {
  const [user] = useAuthState(auth);
  const [permission, setPermissions] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPermissionsByUserId = async () => {
      setLoading(true);

      try {
        const data = await fetch(`/api/permissions/${user?.uid}`, {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { permission: userPermissionsData } = await data.json();

        setPermissions(userPermissionsData);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching permission by email");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPermissionsByUserId();
  }, [user]);

  return { permission, loading };
};

export default useFetchPermissionsById;
