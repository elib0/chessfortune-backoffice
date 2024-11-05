"use client";

import { SearchIcon } from "@/components/icons/searchicon";
import { UserIcon, ActivityIcon } from "@/components/icons/sidebar";
import { AppContainer } from "@/components/shared";
import { TableWrapper } from "@/components/table";
import { activityHistoryColumns } from "@/components/table/columns";
import { useFetchUsers } from "@/hooks";
import { Input } from "@nextui-org/react";
import React, { useState } from "react";

const ActivityHistoryPage = () => {
  const { users, loading } = useFetchUsers();
  const [filterValue, setFilterValue] = useState<string>("");

  if (!loading && !users?.length)
    return (
      <div className="text-center mt-40">
        <h4 className="text-xl font-semibold">No Users Available</h4>
        <p className="text-gray-500 mt-2">
          We couldn’t find any users. Please check back later or contact support
          if you think this is an error.
        </p>
      </div>
    );

  const filteredUsers = users?.filter(({ displayName, email }) => {
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
          icon: <UserIcon />,
          href: "/users",
          title: "User",
        },
        {
          icon: <ActivityIcon />,
          href: "/activity-history",
          title: "Activity History",
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
          title="Activity"
          isLoading={loading}
          data={filteredUsers}
          columns={activityHistoryColumns}
          cell={"user-activity-history"}
        />
      </div>
    </AppContainer>
  );
};

export default ActivityHistoryPage;
