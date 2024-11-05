"use client";
import { SearchIcon } from "@/components/icons/searchicon";
import { UserIcon } from "@/components/icons/sidebar";
import { UserSettingIcon } from "@/components/icons/user-setting-icon";
import { AppContainer, Loader } from "@/components/shared";
import { TableWrapper } from "@/components/table";
import { roleColumns, roleManagementColumns } from "@/components/table/columns";
import CreateRole from "@/components/users/role/create-role";
import { useFetchPermissions, useFetchRoles, useFetchUsers } from "@/hooks";
import { Input } from "@nextui-org/react";
import React, { useState } from "react";

const Page = () => {
  const [filterValue, setFilterValue] = useState<string>("");
  const { users, loading: usersIsLoading } = useFetchUsers();
  const { roles, loading: rolesIsLoading } = useFetchRoles();
  const { permissions, loading: permissionsIsLoading } = useFetchPermissions();

  if (permissionsIsLoading || usersIsLoading || rolesIsLoading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <Loader size="lg" />
      </div>
    );
  }

  if (!permissions && !users && !roles)
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
          icon: <UserSettingIcon />,
          href: "/role-management",
          title: "Role Management",
        },
      ]}
      button={<CreateRole />}
    >
      <div className="space-y-4">
        <TableWrapper
          isLoading={rolesIsLoading}
          data={roles}
          cell={"roles"}
          title="Roles"
          columns={roleColumns}
        />
        {permissions.filter(({ role }) => role !== "admin").length > 0 && (
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
          isLoading={usersIsLoading || permissionsIsLoading}
          data={permissionsData}
          cell={"role-management"}
          title="User Roles"
          columns={roleManagementColumns}
          showDateFilter={true}
        />
      </div>
    </AppContainer>
  );
};
export default Page;
