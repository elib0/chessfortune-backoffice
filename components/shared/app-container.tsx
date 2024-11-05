"use client";

import React, { FC, ReactNode } from "react";
import Link from "next/link";
import { Loader } from "@/components/shared";
import { usePathname } from "next/navigation";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { useFetchPermissionsById, useFetchUsers } from "@/hooks";
import { Button } from "@nextui-org/react";
import { UserIcon } from "../icons/sidebar";
import { AssignRole } from "../users";
import CreateRole from "../users/role/create-role";

interface Props {
  breadCrumbs?: {
    icon: ReactNode;
    href: string;
    title: string;
  }[];
  children: React.ReactNode;
  button?: ReactNode;
}

const Message: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex justify-center items-center mt-40">
      <p>{text}</p>
    </div>
  );
};

const Box: FC<Props> = ({ breadCrumbs, button, children }) => (
  <div className="overflow-hidden h-full">
    <div className="flex flex-col justify-center flex-wrap h-fit pt-5 gap-4 p-6 sm:p-8 sm:px-12 w-full">
      <div className="flex justify-between">
        <Breadcrumbs
          css={{
            marginBlock: 0,
          }}
        >
          {breadCrumbs &&
            breadCrumbs.map(({ href, title, icon }, index) => (
              <Crumb
                key={index}
                css={{
                  marginBlock: 0,
                }}
              >
                {icon}
                <Link href={href}>
                  <CrumbLink
                    href="#"
                    css={{
                      cursor: "pointer",
                    }}
                  >
                    {title}
                  </CrumbLink>
                </Link>
                {index !== breadCrumbs.length - 1 && <div>/</div>}
              </Crumb>
            ))}
        </Breadcrumbs>
        {button}
      </div>
      {children}
    </div>
  </div>
);

const AppContainer: FC<Props> = ({ breadCrumbs, button, children }) => {
  const path = usePathname();
  const { permission, loading } = useFetchPermissionsById();
  const { users, loading: usersIsLoading } = useFetchUsers();

  if (loading || usersIsLoading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <Loader size="lg" />
      </div>
    );
  }

  if (path === "/" || path.includes("profile")) {
    return (
      <Box breadCrumbs={breadCrumbs} button={button}>
        {children}
      </Box>
    );
  }

  if (!permission)
    return (
      <div className="text-center mt-40">
        <h4 className="text-xl font-semibold capitalize">{`No Roles Available`}</h4>
        <p className="text-gray-500 mt-2">
          {`
          We couldn’t find any Roles. Please check back later or contact support
          if you think this is an error.
          `}
        </p>
        {path !== "/staff" ? (
          <div className="space-y-2 mt-2">
            <p className="text-gray-300">
              {`
            Navigate back to Staff and create a new role
          `}
            </p>
            <Button className="mt-2" startContent={<UserIcon />}>
              <Link href={`/staff`}>Staff Management</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-300 mt-2">
              {`
              Create or Assign a new Role
            `}
            </p>
            <div className="flex items-center justify-center gap-3">
              <CreateRole /> <AssignRole users={users} />
            </div>
          </div>
        )}
      </div>
    );

  const isAdmin = permission?.role?.toLowerCase() === "admin";
  const hasPageAccess = isAdmin || permission?.pages.includes(path);

  return !permission ||
    (!isAdmin && (!permission?.pages || permission?.pages.length === 0)) ? (
    <Message text="No pages assigned to this role. Please contact the administrator." />
  ) : !hasPageAccess ? (
    <Message text="You do not have access to this page. Please contact the administrator." />
  ) : (
    <Box breadCrumbs={breadCrumbs} button={button}>
      {children}
    </Box>
  );
};

export default AppContainer;
