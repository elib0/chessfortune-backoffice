"use client";

import React from "react";
import { ReportsIcon } from "@/components/icons/sidebar";
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
          icon: <ReportsIcon />,
          href: "/reports/rooms",
          title: "Reports",
        },
        {
          icon: <ReportsIcon />,
          href: "#",
          title: "Rooms",
        },
      ]}
    >
      <TableWrapper
        isLoading={loading}
        data={rooms}
        columns={roomsReportsColumns}
        cell={"rooms-reports"}
        title={"Reported Rooms Reports"}
        showExportIcon={true}
        csvData={{
          fileName: "room-reports.csv",
          data:
            rooms?.length > 0
              ? [
                  ["Board Side", "Room Id", "Text", "Type"],
                  ...rooms?.map(({ boardSide: side, roomId, text, type }) => {
                    const boardSide = side === "w" ? "White" : "Black";

                    return [boardSide, roomId, text, type];
                  }),
                ]
              : [],
        }}
      />
    </AppContainer>
  );
};

export default Page;
