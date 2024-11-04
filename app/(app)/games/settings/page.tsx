"use client";

import { SettingsIcon } from "@/components/icons/sidebar";
import GameIcon from "@/components/icons/sidebar/game-icon";
import AppContainer from "@/components/shared/app-container";
import { TableWrapper } from "@/components/table";
import { gameSettingsColumns } from "@/components/table/columns";
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
          icon: <SettingsIcon />,
          href: "/settings",
          title: "Settings",
        },
      ]}
    >
      <TableWrapper
        isLoading={loading}
        data={rooms}
        columns={gameSettingsColumns}
        cell={"game-settings"}
        title={"Game Settings"}
      />
    </AppContainer>
  );
};

export default Page;
