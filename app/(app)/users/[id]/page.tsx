"use client";

import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import UserIcon from "@/components/icons/sidebar/user-icon";
import AppContainer from "@/components/shared/app-container";
import Loader from "@/components/shared/loader";
import { TableWrapper } from "@/components/table";
import { invoiceColumns } from "@/components/table/columns";
import { useFetchUserById, useFetchInvoicesByUserId } from "@/hooks";
import { Switch, Avatar } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { FC } from "react";

const Page: FC = () => {
  const { id } = useParams();
  const { user, loading: userLoading } = useFetchUserById(id as string);
  const { userInvoices, loading: invoicesLoading } = useFetchInvoicesByUserId(
    id as string
  );

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <UsersIcon />,
          href: "/users",
          title: "User",
        },
        {
          icon: <UserIcon />,
          href: "#",
          title: user?.displayName as string,
        },
      ]}
    >
      {invoicesLoading || userLoading ? (
        <div className="flex items-center mt-12 div justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="mt-4 w-full">
          {user && (
            <div className="flex mb-4 justify-between items-start">
              <div className="flex gap-4 justify-start items-center">
                <Avatar
                  size="lg"
                  radius="md"
                  src={user.photoURL || "/blank-user.png"}
                  name={user.displayName}
                />
                <div>
                  <h2 className="">{user.displayName}</h2>
                  <h3 className="">{user.email}</h3>
                </div>
              </div>

              <div className="flex gap-4 justify-between items-start">
                <h3>{`Enable User`}</h3>
                <Switch
                  size={"sm"}
                  isSelected={user.online}
                  aria-label="Automatic updates"
                  color={"success"}
                />
              </div>
            </div>
          )}
          {userInvoices && (
            <div className="flex mt-4 gap-4 flex-col justify-between items-start w-full">
              <TableWrapper
                title="User Invoices"
                isLoading={invoicesLoading}
                data={userInvoices}
                columns={invoiceColumns}
                cell={"invoices"}
                showExportIcon
              />
            </div>
          )}
        </div>
      )}
    </AppContainer>
  );
};

export default Page;
