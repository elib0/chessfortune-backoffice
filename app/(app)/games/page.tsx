"use client";

import { GameIcon } from "@/components/icons/sidebar";
import AppContainer from "@/components/shared/app-container";
import { TableWrapper } from "@/components/table";
import { roomColumns } from "@/components/table/columns";
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
      ]}
    >
      <TableWrapper
        title="Games"
        isLoading={loading}
        data={rooms}
        columns={roomColumns}
        cell={"rooms"}
      />
    </AppContainer>
  );
};

export default Page;
