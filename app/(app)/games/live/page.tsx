"use client";

import React from "react";
import { useFetchRooms } from "@/hooks";
import { TableWrapper } from "@/components/table";
import GameIcon from "@/components/icons/sidebar/game-icon";
import PlayIcon from "@/components/icons/sidebar/play-icon";
import AppContainer from "@/components/shared/app-container";
import { liveRoomColumns } from "@/components/table/columns";
import getMilliseconds from "@/helpers/getMilliseconds";

const Page = () => {
  const { rooms, loading } = useFetchRooms();

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
