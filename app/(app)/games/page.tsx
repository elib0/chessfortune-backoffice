"use client";

import { GameIcon } from "@/components/icons/sidebar";
import AppContainer from "@/components/shared/app-container";
import { useFetchRooms } from "@/hooks";
import { GameTable } from "@/components/table/game/game-table";

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
      <GameTable isLoading={loading} data={rooms} />
    </AppContainer>
  );
};

export default Page;
