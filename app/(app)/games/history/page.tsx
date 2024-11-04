"use client";

import { GameIcon, ClockIcon } from "@/components/icons/sidebar";
import { AppContainer } from "@/components/shared";
import { TableWrapper } from "@/components/table";
import { roomHistoryColumns } from "@/components/table/columns";
import { useFetchRooms } from "@/hooks";
import React from "react";

const Page = () => {
  const { rooms, loading } = useFetchRooms();

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <GameIcon />,
          href: "/games",
          title: "Games",
        },
        {
          icon: <ClockIcon />,
          href: "/history",
          title: "History",
        },
      ]}
    >
      <TableWrapper
        title="Game History"
        isLoading={loading}
        data={rooms}
        columns={roomHistoryColumns}
        cell={"rooms-history"}
      />
    </AppContainer>
  );
};

export default Page;
