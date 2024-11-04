"use client";

import { UserIcon, BadgeCheckIcon } from "@/components/icons/sidebar";
import { AppContainer } from "@/components/shared";
import { TableWrapper } from "@/components/table";
import { identityVerificationColumns } from "@/components/table/columns";
import { useFetchUsers } from "@/hooks";
import React from "react";

const Page = () => {
  const { users, loading } = useFetchUsers();

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <UserIcon />,
          href: "/users",
          title: "User",
        },
        {
          icon: <BadgeCheckIcon />,
          href: "/identity-verification",
          title: "Identity Verification",
        },
      ]}
    >
      <TableWrapper
        title="Verifications"
        isLoading={loading}
        data={users}
        columns={identityVerificationColumns}
        cell={"user-identity-verification"}
        showDateFilter={true}
      />
    </AppContainer>
  );
};

export default Page;
