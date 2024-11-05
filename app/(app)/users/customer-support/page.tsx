"use client";

import React from "react";
import { UserIcon, SupportIcon } from "@/components/icons/sidebar";
import { AppContainer } from "@/components/shared";
import { TableWrapper } from "@/components/table";
import { roomsReportsColumns } from "@/components/table/columns";
import { useFetchRoomsReports } from "@/hooks";

const Page = () => {
  const { rooms, loading } = useFetchRoomsReports();

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <UserIcon />,
          href: "/rooms",
          title: "User",
        },
        {
          icon: <SupportIcon />,
          href: "/customer-support",
          title: "Customer Support",
        },
      ]}
    >
      <TableWrapper
        isLoading={loading}
        data={rooms}
        columns={roomsReportsColumns}
        cell={"rooms-reports"}
        title={"Reported Rooms Reports"}
      />
    </AppContainer>
  );
};

export default Page;
