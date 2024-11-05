"use client";

import { LockIcon } from "@/components/icons/auth";
import { UserIcon } from "@/components/icons/sidebar";
import { AppContainer } from "@/components/shared";
import { TableWrapper } from "@/components/table";
import { userColumns } from "@/components/table/columns";
import { useFetchUsers } from "@/hooks";

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
          icon: <LockIcon fill="#969696" />,
          href: "/access-control",
          title: "Access Control",
        },
      ]}
    >
      <TableWrapper
        isLoading={loading}
        data={users}
        columns={userColumns}
        cell={"user"}
        title={"User Access Control"}
      />
    </AppContainer>
  );
};

export default Page;
