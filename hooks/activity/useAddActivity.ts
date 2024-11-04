"use client";

import { auth } from "@/firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";
import { httpHeaderOptions } from "@/helpers";

const useAddActivity = () => {
  const [user] = useAuthState(auth);

  const addActivity = async ({ action }: { action: string }) => {
    try {
      if (!user) return;

      await fetch(`/api/activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          email: user.email,
          profileId: user.uid,
        }),
        ...httpHeaderOptions,
      });
    } catch (error) {
      console.error("Error updating activity: ", error);
    }
  };

  return {
    addActivity,
  };
};

export default useAddActivity;
