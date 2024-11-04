"use client";

import AppContainer from "@/components/shared/app-container";
import React from "react";
import { ReportsIcon } from "@/components/icons/sidebar";
import { TableWrapper } from "@/components/table";
import { gameReportsColumns } from "@/components/table/columns";
import { convertFirestoreTimestampToDate } from "@/helpers";
import { useFetchRooms } from "@/hooks";

const Page = () => {
  const { rooms, loading } = useFetchRooms();

  const csvData = [
    [
      "Room Id",
      "Bet",
      "Timer",
      "Created At",
      "Created By",
      "Email Address",
      "Game Over Reason",
      "Winner",
      "Start At",
      "Finish At",
    ],
    ...rooms.map(
      ({
        roomId,
        bet,
        timer,
        createdBy,
        createdAt,
        gameOverReason,
        winner: win,
        startAt,
        finishAt,
        players,
      }) => {
        const creatorSide = createdBy as keyof typeof players;
        const winnerSide = win as keyof typeof players;
        const { displayName: creator, email } =
          players[creatorSide]?.profile || {};
        const { displayName: winner } = players[winnerSide]?.profile || {};

        const createdDate = convertFirestoreTimestampToDate(
          createdAt as any
        ).toISOString();

        const startDate = startAt
          ? convertFirestoreTimestampToDate(startAt as any)?.toISOString()
          : convertFirestoreTimestampToDate(createdAt as any).toISOString();

        const finishDate = finishAt
          ? convertFirestoreTimestampToDate(finishAt as any)?.toISOString()
          : "N/A";

        return [
          roomId,
          bet,
          timer,
          createdDate,
          creator, // as Created By
          email,
          gameOverReason || "N/A",
          winner || "N/A",
          startDate,
          finishDate,
        ];
      }
    ),
  ];

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
      <TableWrapper
        title="Game Reports"
        isLoading={loading}
        data={rooms}
        columns={gameReportsColumns}
        cell={"rooms-history"}
        showExportIcon
        csvData={{
          fileName: "game-reports.csv",
          data: csvData,
        }}
      />
    </AppContainer>
  );
};

export default Page;
