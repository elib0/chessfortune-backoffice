"use client";

import React from "react";
import { AppContainer, Loader } from "../shared";
import { DashboardIcon } from "../icons/sidebar";
import { DashboardCard } from "./dashboard-card";
import {
  useFetchInvoices,
  useFetchReferrals,
  useFetchRoles,
  useFetchRooms,
  useFetchRoomsReports,
  useFetchUsers,
} from "@/hooks";
import { convertFirestoreTimestampToDate } from "@/helpers";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { getGameChartData } from "@/helpers/getGameChartData";
import { Avatar, Card } from "@nextui-org/react";
import getMilliseconds from "@/helpers/getMilliseconds";
import { TableWrapper } from "../table";
import { roomsReportsColumns } from "../table/columns";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const today = new Date().toLocaleDateString();

const otherChartOptions: ApexOptions = {
  chart: {
    foreColor: "#a0a0a9",
    height: 284,
    type: "line",
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 4,
    curve: "straight",
  },

  grid: {
    show: false,
  },
  yaxis: {
    min: 0,
  },
};

export const Content = () => {
  const { users, loading: usersIsFetching } = useFetchUsers();
  const { rooms, loading: roomsIsFetching } = useFetchRooms();
  const { invoices, loading: invoicesIsFetching } = useFetchInvoices();
  const { roles, loading: rolesIsLoading } = useFetchRoles();
  const { referrals, loading: referralsIsLoding } = useFetchReferrals();
  const { rooms: roomReports, loading: roomReportsIsLoading } =
    useFetchRoomsReports();

  if (
    usersIsFetching ||
    roomsIsFetching ||
    invoicesIsFetching ||
    rolesIsLoading ||
    referralsIsLoding ||
    roomReportsIsLoading
  )
    return (
      <div className="flex justify-center items-center mt-40">
        <Loader size="lg" />
      </div>
    );

  if (
    !users?.length ||
    !rooms?.length ||
    !invoices?.length ||
    !roles?.length ||
    !referrals?.length ||
    !roomReports?.length
  )
    return (
      <div className="text-center mt-40 mx-auto">
        <h4 className="text-xl font-semibold">No Data Available</h4>
        <p className="text-gray-500 max-w-[60ch] mt-2">
          We couldn’t find any users, games, invoices, staffs, or referrals at
          the moment. Please check back later or contact support if you think
          this is an error.
        </p>
      </div>
    );

  const getPayments =
    invoices?.length > 0
      ? invoices.filter(
          ({ amount, status }) => status === "completed" && amount > 0
        )
      : [];

  const liveRooms = rooms?.filter((item) => {
    const now = Date.now();

    if (!item?.finishAt) {
      return true;
    }

    const startAtMillis =
      getMilliseconds(item.startAt) || getMilliseconds(item.createdAt);
    const finishAtMillis = getMilliseconds(item.finishAt);

    const isLive =
      startAtMillis &&
      startAtMillis < now &&
      (!finishAtMillis || finishAtMillis > now);

    return isLive;
  });

  const { dates: gameDates, data: gamesPlayedData } = getGameChartData(rooms);

  const dates = invoices.map(({ createdAt }) =>
    convertFirestoreTimestampToDate(createdAt as any).toLocaleDateString()
  );

  const paymentChartOptions: ApexOptions = {
    series: [
      {
        color: "#60ca65",
        name: "Payed Amount",
        data: [...getPayments.map(({ amount }) => amount)],
      },
    ],
    title: {
      text: "Payments Over Time",
      align: "left",
    },
    xaxis: {
      categories: dates,
    },
    ...otherChartOptions,
  };

  const gameChartOptions: ApexOptions = {
    series: [
      {
        color: "#016fee",
        name: "Games Played",
        data: gamesPlayedData,
      },
    ],
    title: {
      text: "Games Played Over Time",
      align: "left",
    },
    xaxis: {
      categories: gameDates,
    },
    ...otherChartOptions,
  };

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <DashboardIcon />,
          href: "/",
          title: "Dashboard",
        },
      ]}
    >
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-col-3 xl:grid-cols-4 gap-5 justify-center w-full">
          <DashboardCard
            title="Total Users"
            content={`${users.length} People`}
          />
          <DashboardCard
            title="Active Users"
            content={`${users.filter(({ online }) => online).length} People`}
          />
          <DashboardCard
            title="Live Users"
            content={`${liveRooms.length} People`}
          />
          <DashboardCard
            title="Pending Withdraw Req."
            icon="dollar"
            content={`${
              invoices.filter(({ status }) => status === "processing").length
            } Transactions`}
          />
          <DashboardCard
            title="Today's Payments"
            icon="dollar"
            content={`${
              invoices.filter(
                ({ status, createdAt }) =>
                  status === "completed" &&
                  convertFirestoreTimestampToDate(
                    createdAt as any
                  ).toLocaleDateString() === today
              ).length
            } Transactions`}
          />
          <DashboardCard
            title="Total Staff"
            content={`${
              roles.filter(({ role }) => role !== "admin").length
            } People`}
          />
          <DashboardCard
            title="Games Played"
            icon="game"
            content={`${
              rooms.filter(
                ({ createdAt }) =>
                  convertFirestoreTimestampToDate(
                    createdAt as any
                  ).toLocaleDateString() === today
              ).length
            } Matches`}
          />
          <DashboardCard
            title="Total Referrals"
            icon="ticket"
            content={`${
              referrals.flatMap(({ referrals: userReferrals }) => userReferrals)
                .length
            } Mentions`}
          />
        </div>
        <div className="grid grid-cols-4 gap-5">
          <div className="col-span-3 w-full">
            <div className="space-y-5">
              <Card className="rounded-xl shadow-md p-4">
                <ApexCharts
                  options={paymentChartOptions}
                  series={paymentChartOptions.series}
                  type="line"
                  height={284}
                />
              </Card>
              <Card className="rounded-xl shadow-md p-4">
                <ApexCharts
                  options={gameChartOptions}
                  series={gameChartOptions.series}
                  type="line"
                  height={284}
                />
              </Card>
            </div>
          </div>
          <div className="col-span-1 w-full">
            <Card className="rounded-xl shadow-md p-4">
              <div className="bg-default-100 rounded-xl text-center p-2 px-4 border-dashed border-2 border-divider">
                <span className="text-default-900 text-xl font-semibold">
                  Latest Users
                </span>
              </div>
              <ul className="flex flex-col gap-5 mt-6">
                {users
                  .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                  .slice(0, 10)
                  .map(({ photoURL, displayName, email, createdAt }, index) => {
                    const date = convertFirestoreTimestampToDate(
                      createdAt as any
                    ).toLocaleDateString();

                    return (
                      <li
                        key={index}
                        className="flex justify-between gap-4 items-start"
                      >
                        <div className="flex gap-3 items-start w-full">
                          <Avatar
                            isBordered
                            src={photoURL || "/blank-user.png"}
                          />
                          <div className="flex flex-col">
                            <span className="text-default-900 text-sm font-medium capitalize truncate w-full">
                              {displayName}
                            </span>
                            <span className="text-default-900 text-xs font-normal capitalize">
                              {email}
                            </span>
                          </div>
                        </div>
                        <span className="text-end text-base w-full">
                          {date}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </Card>
          </div>
        </div>
        <TableWrapper
          data={roomReports}
          cell={"rooms-reports"}
          columns={roomsReportsColumns}
          title={"Reported Room Reports"}
          isLoading={roomReportsIsLoading}
        />
      </div>
    </AppContainer>
  );
};
