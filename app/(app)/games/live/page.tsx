"use client";

import React from "react";
import { useFetchRooms } from "@/hooks";
import { TableWrapper } from "@/components/table";
import GameIcon from "@/components/icons/sidebar/game-icon";
import PlayIcon from "@/components/icons/sidebar/play-icon";
import AppContainer from "@/components/shared/app-container";
import { liveRoomColumns } from "@/components/table/columns";
import { Timestamp } from "@firebase/firestore";

const getMilliseconds = (timestamp: Timestamp | Date | null) =>
  timestamp instanceof Timestamp
    ? timestamp.toMillis()
    : timestamp instanceof Date
    ? timestamp.getTime()
    : null;

const Page = () => {
  const { rooms, loading } = useFetchRooms();

  // const uniqueGameOverReasons = rooms
  //   .map(({ gameOverReason }) => gameOverReason)
  //   .filter((value, index, self) => self.indexOf(value) === index);

  const liveRooms = rooms.filter((item) => {
    const now = Date.now();

    // Check if finishAt is not present; if so, consider it live
    if (!item?.finishAt) {
      return true; // Include this room as it's considered live
    }

    // Use startAt if available, otherwise fallback to createdAt
    const startAtMillis =
      getMilliseconds(item.startAt) || getMilliseconds(item.createdAt);
    const finishAtMillis = getMilliseconds(item.finishAt); // Can be null or undefined

    // Determine if the game is live based on start and finish timestamps
    const isLive =
      startAtMillis &&
      startAtMillis < now &&
      (!finishAtMillis || finishAtMillis > now);

    return isLive; // Return true if the game is live
  });

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <GameIcon />,
          href: "/games",
          title: "Games",
        },
        {
          icon: <PlayIcon />,
          href: "/live",
          title: "Live Games",
        },
      ]}
    >
      <TableWrapper
        title="Live Games"
        isLoading={loading}
        data={liveRooms}
        columns={liveRoomColumns}
        cell={"live-rooms"}
      />
    </AppContainer>
  );
};

export default Page;
