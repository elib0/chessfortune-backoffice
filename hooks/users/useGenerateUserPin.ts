"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { httpHeaderOptions } from "@/helpers";
import { useAddActivity } from "..";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/client";

const useGenerateUserPin = () => {
  const [user] = useAuthState(auth);
  const { addActivity } = useAddActivity();
  const [isPinGenerating, setIsPinGenerating] = useState<boolean>(false);

  const generatePin = async () => {
    setIsPinGenerating(true);

    try {
      const res = await fetch(`/api/users/pin/${user?.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        ...httpHeaderOptions,
      });

      addActivity({
        action: `Generated a new PIN`,
      });

      if (res.ok) {
        toast.success("Pin was successfully generated");
        setIsPinGenerating(false);
        location.reload();
      }
    } catch (error) {
      setIsPinGenerating(false);
      toast.error("Failed to create pin");
    } finally {
      setIsPinGenerating(false);
    }
  };

  return { isPinGenerating, generatePin };
};

export default useGenerateUserPin;
