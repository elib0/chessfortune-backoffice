import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";
import React, { useCallback } from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useRouter } from "next/navigation";
import { deleteAuthCookie } from "@/actions/auth.action";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/client";
import { useAddActivity, useFetchUserById } from "@/hooks";

export const UserDropdown = () => {
  const router = useRouter();
  const [signOut] = useSignOut(auth);
  const [user] = useAuthState(auth);
  const { addActivity } = useAddActivity();
  const { user: userDetails } = useFetchUserById(user?.uid as string);

  const handleLogout = useCallback(async () => {
    await deleteAuthCookie();
    signOut();

    addActivity({
      action: "Logged Out",
    });

    router.replace("/login");
  }, [router, signOut]);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            src={userDetails?.photoURL || "/blank-user.png"}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label="User menu actions">
        <DropdownItem
          key="profile"
          onPress={() => router.push(`/profile`)}
          className="flex flex-col justify-start w-full items-start"
        >
          <p>Signed in as</p>
          <p className="text-primary">{user?.email}</p>
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger"
          onPress={handleLogout}
        >
          Log Out
        </DropdownItem>
        <DropdownItem key="switch">
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
