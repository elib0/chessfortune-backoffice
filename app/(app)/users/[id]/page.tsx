"use client";

import { DashboardCard } from "@/components/home/dashboard-card";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SearchIcon } from "@/components/icons/searchicon";
import UserIcon from "@/components/icons/sidebar/user-icon";
import AppContainer from "@/components/shared/app-container";
import Loader from "@/components/shared/loader";
import { TableWrapper } from "@/components/table";
import {
  activityTimelineColumns,
  invoiceColumns,
} from "@/components/table/columns";
import { ReferralsTable } from "@/components/table/referrals/referrals-table";
import { convertFirestoreTimestampToDate } from "@/helpers";
import { months } from "@/helpers/data";
import {
  useFetchUserById,
  useFetchInvoicesByUserId,
  useFetchUserActivityById,
  useFetchReferrals,
} from "@/hooks";
import { ActivitiesType, Referral } from "@/types";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { Timestamp } from "firebase/firestore";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

const Page: FC = () => {
  const { id } = useParams();
  const [filterValue, setFilterValue] = useState<string>("");
  const { user, loading: userLoading } = useFetchUserById(id as string);
  const { userInvoices, loading: invoicesLoading } = useFetchInvoicesByUserId(
    id as string
  );
  const { referrals, loading: referralsIsLoding } = useFetchReferrals();
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const { userActivity, loading: userActivityLoading } =
    useFetchUserActivityById(id as string);
  const [filteredActivities, setFilteredActivities] = useState<
    ActivitiesType[]
  >([]);

  useEffect(() => {
    if (selectedMonth === "All") {
      const data = userActivity?.map((activity) => {
        return {
          ...activity,
          createdAt: convertFirestoreTimestampToDate(
            activity.createdAt
          ).toISOString(),
        };
      });

      setFilteredActivities(data);
    } else {
      const data = userActivity
        ?.filter((activity) => {
          const date = convertFirestoreTimestampToDate(activity.createdAt);
          return (
            new Date(date).toLocaleString("en-US", {
              month: "long",
            }) === months[Number(selectedMonth)].label
          );
        })
        .map((activity) => {
          return {
            ...activity,
            createdAt: convertFirestoreTimestampToDate(
              activity.createdAt
            ).toISOString(),
          };
        });

      setFilteredActivities(data);
    }
  }, [selectedMonth, userActivity]);

  if (invoicesLoading || userLoading || referralsIsLoding) {
    return (
      <div className="flex items-center mt-12 div justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const pendingInvoicesLength =
    userInvoices?.filter(({ status }) => status === "processing").length || 0;

  const pendingTotalAmount = (): number =>
    Math.abs(
      Number(
        userInvoices
          ?.filter(
            ({ amount, status }) => amount > 0 && status === "processing"
          )
          .reduce((prevValue, curValue) => prevValue + curValue.amount, 0)
          .toFixed(2)
      )
    ) || 0;

  const totalAmount = (): number =>
    Math.abs(
      Number(
        userInvoices
          ?.filter(({ amount }) => amount > 0)
          .reduce((prevValue, curValue) => prevValue + curValue.amount, 0)
          .toFixed(2)
      )
    ) || 0;

  const userReferrals = referrals?.filter(
    ({ id: referralUserId }) => referralUserId === id
  );

  const userReferralsLength = userReferrals.flatMap(
    (referral) => referral.referrals
  ).length;

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
      <div className="mt-4 w-full">
        {user && (
          <div className="flex mb-4 justify-between flex-col gap-4 items-start">
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
            <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-col-3 xl:grid-cols-4 gap-5 justify-center w-full">
              <DashboardCard
                title="Games Played"
                icon="game"
                content={`${
                  Number(user.statistics.win) + Number(user.statistics.loses)
                } Matches`}
              />
              <DashboardCard
                title="Total Wins"
                icon="game"
                content={`${user.statistics.win} Wins`}
              />
              <DashboardCard
                title="Total Losses"
                icon="game"
                content={`${user.statistics.loses} Losses`}
              />
              <DashboardCard
                title="Total Payments"
                icon="dollar"
                content={`$${totalAmount()} ( ${
                  userInvoices?.length || 0
                } Transactions )`}
              />
              <DashboardCard
                title="Pending Withdraw Req."
                icon="dollar"
                content={`$${pendingTotalAmount()} ( ${pendingInvoicesLength} Transactions )`}
              />
              <DashboardCard
                title="Total Referrals"
                icon="ticket"
                content={`${userReferralsLength} Mentions`}
              />
            </div>
          </div>
        )}
        <div className="flex mt-4 gap-4 flex-col justify-between items-start w-full">
          {userActivity && (
            <div className="space-y-4 mb-2 w-full">
              <div
                className={`flex items-center ${
                  userActivity.length === 0 ? "justify-end" : "justify-between"
                }`}
              >
                {userActivity.length > 0 && (
                  <Input
                    placeholder="Search Activities..."
                    labelPlacement="outside"
                    startContent={<SearchIcon />}
                    onChange={({
                      target: { value },
                    }: {
                      target: { value: string };
                    }) => setFilterValue(value)}
                    className="w-80"
                  />
                )}
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered">{`${
                      months[Number(selectedMonth)]?.label || "Year"
                    }`}</Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Select Month"
                    onAction={(key) => setSelectedMonth(key as string)}
                  >
                    {months.map((month) => (
                      <DropdownItem key={month.value.toString()}>
                        {month.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <TableWrapper
                isLoading={userActivityLoading}
                data={filteredActivities.filter((activity) =>
                  activity.action
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
                )}
                columns={activityTimelineColumns}
                cell={"user-activity-history-timeline"}
                title={`Activities done on ${
                  months[Number(selectedMonth)]?.label || "Year"
                }`}
              />
            </div>
          )}
          <TableWrapper
            title="User Invoices"
            isLoading={invoicesLoading}
            data={userInvoices}
            columns={invoiceColumns}
            cell={"invoices"}
            showExportIcon
          />
          {userReferrals && (
            <ReferralsTable
              isLoading={referralsIsLoding}
              data={userReferrals}
            />
          )}
        </div>
      </div>
    </AppContainer>
  );
};

export default Page;
