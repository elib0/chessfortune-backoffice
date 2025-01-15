"use client";

import axios from "axios";
import React, { useEffect } from "react";
import { auth } from "@/firebase/client";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarContext } from "./layout-context";
import { SidebarWrapper } from "../sidebar/sidebar";
import { useLockedBody } from "../hooks/useBodyLock";
import { useAuthState } from "react-firebase-hooks/auth";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [user] = useAuthState(auth);
  const [_, setLocked] = useLockedBody(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  const updateOnlineStatus = async (isOnline: boolean) => {
    try {
      if (!user?.uid) return;

      if (isOnline) {
        await axios.post(`/api/users/${user.uid}/online`, { online: isOnline });
      } else {
        const url = `/api/users/${user.uid}/online`;
        const data = JSON.stringify({ online: isOnline });
        navigator.sendBeacon(url, data);
      }
    } catch (error) {
      console.error("Failed to update online status:", error);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateOnlineStatus(true);
      } else {
        updateOnlineStatus(false);
      }
    };

    const handleBeforeUnload = () => {
      updateOnlineStatus(false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Mark user as online when the component mounts
    updateOnlineStatus(true);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  return (
    <SidebarContext.Provider
      value={{
        collapsed: sidebarOpen,
        setCollapsed: handleToggleSidebar,
      }}
    >
      <section className="flex">
        <SidebarWrapper />
        <NavbarWrapper>{children}</NavbarWrapper>
      </section>
    </SidebarContext.Provider>
  );
};
