"use client";

import { SearchIcon } from "@/components/icons/searchicon";
import UserCogIcon from "@/components/icons/sidebar/user-cog";
import UserIcon from "@/components/icons/sidebar/user-icon";
import { Loader } from "@/components/shared";
import AppContainer from "@/components/shared/app-container";
import { TableWrapper } from "@/components/table";
import { staffManagementColumns } from "@/components/table/columns";
import { AssignRole } from "@/components/users";
import { useFetchPermissions, useFetchUsers } from "@/hooks";
import { Input } from "@nextui-org/react";
import React, { useState } from "react";

const Page = () => {
  const [filterValue, setFilterValue] = useState<string>("");
  const { users, loading: usersIsLoading } = useFetchUsers();
  const { permissions, loading: permissionsIsLoading } = useFetchPermissions();

  if (permissionsIsLoading || usersIsLoading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <Loader size="lg" />
      </div>
    );
  }
  if (
    (!permissions || Object.keys(permissions).length === 0) &&
    (!users || users.length === 0)
  )
    return (
      <div className="text-center mt-40">
        <h4 className="text-xl font-semibold">No Staffs Available</h4>
        <p className="text-gray-500 mt-2">
          We couldn’t find any staffs. Please check back later or contact
          support if you think this is an error.
        </p>
      </div>
    );

  const permissionsData = permissions
    ?.map((item: any) => {
      const user = users.find((user) => user.id === item.userId);

      return {
        ...item,
        name: user?.displayName,
        photoURL: user?.photoURL,
      };
    })
    .filter(({ role, name, email }) => {
      const searchQuery = (value: string) =>
        value?.toLowerCase().includes(filterValue.toLowerCase());

      const nameOrEmailSearch = searchQuery(name) || searchQuery(email);

      return role !== "admin" && nameOrEmailSearch;
    });

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
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search Users..."
            labelPlacement="outside"
            startContent={<SearchIcon />}
            onChange={({ target: { value } }: { target: { value: string } }) =>
              setFilterValue(value)
            }
            className="w-80"
          />
          <div className="flex gap-2">
            <AssignRole users={users} />
          </div>
        </div>
        <TableWrapper
          isLoading={usersIsLoading || permissionsIsLoading}
          data={permissionsData}
          cell={"staffs"}
          title="Staffs"
          columns={staffManagementColumns}
          showDateFilter={true}
        />
      </div>
    </AppContainer>
  );
};

export default Page;
