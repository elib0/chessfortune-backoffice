"use client";

import { SearchIcon } from "@/components/icons/searchicon";
import UserCogIcon from "@/components/icons/sidebar/user-cog";
import UserIcon from "@/components/icons/sidebar/user-icon";
import AppContainer from "@/components/shared/app-container";
import { TableWrapper } from "@/components/table";
import { userColumns } from "@/components/table/columns";
import { useFetchUsers } from "@/hooks";
import { Input } from "@nextui-org/react";
import React, { useState } from "react";

const Page = () => {
  const [filterValue, setFilterValue] = useState<string>("");
  const { users, loading } = useFetchUsers();

  const filteredUsers = users.filter(({ displayName }) =>
    displayName.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <UserIcon />,
          href: "/staff",
          title: "Staff",
        },
        {
          icon: <UserCogIcon />,
          href: "#",
          title: "Management",
        },
      ]}
    >
      <div className="flex flex-col gap-4">
        {users.length > 0 && (
          <Input
            placeholder="Search Users..."
            labelPlacement="outside"
            startContent={<SearchIcon />}
            onChange={({ target: { value } }: { target: { value: string } }) =>
              setFilterValue(value)
            }
            className="w-80"
          />
        )}
        <TableWrapper
          isLoading={loading}
          data={filteredUsers}
          columns={userColumns}
          cell={"user"}
          title="Staffs"
        />
      </div>
    </AppContainer>
  );
};

export default Page;
