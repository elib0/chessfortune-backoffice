"use client";

import React from "react";
import { useFetchRooms } from "@/hooks";
import { ReportsIcon } from "@/components/icons/sidebar";
import AppContainer from "@/components/shared/app-container";
import { GameReportTable } from "@/components/table/reports/game-report-table";

const Page = () => {
  const { rooms, loading } = useFetchRooms();

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <ReportsIcon />,
          href: "/reports/gmame",
          title: "Reports",
        },
        {
          icon: <ReportsIcon />,
          href: "#",
          title: "Game",
        },
      ]}
    >
      <GameReportTable isLoading={loading} data={rooms} />
    </AppContainer>
  );
};

export default Page;
