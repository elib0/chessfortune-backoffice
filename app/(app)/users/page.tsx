"use client";

import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SearchIcon } from "@/components/icons/searchicon";
import AppContainer from "@/components/shared/app-container";
import { TableWrapper } from "@/components/table";
import { userColumns } from "@/components/table/columns";
import { AddUser } from "@/components/users";
import { useFetchUsers } from "@/hooks";
import { Input } from "@nextui-org/react";
import { useState } from "react";

const Page = () => {
  const [filterValue, setFilterValue] = useState<string>("");
  const { users, loading } = useFetchUsers();

  const filteredUsers = users.filter(({ displayName, email }) => {
    const handleFilterQuery = (query: string) =>
      query?.toLowerCase().trim().includes(filterValue?.toLowerCase().trim());

    const queryMatches =
      handleFilterQuery(displayName) || handleFilterQuery(email);

    return queryMatches;
  });

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <UsersIcon />,
          href: "/users",
          title: "User",
        },
      ]}
      button={<AddUser />}
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
          title="Users"
          showDateFilter={true}
        />
      </div>
    </AppContainer>
  );
};

export default Page;
