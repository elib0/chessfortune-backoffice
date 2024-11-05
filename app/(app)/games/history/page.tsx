"use client";

import { useState } from "react";
import { useFetchRooms } from "@/hooks";
import { TableWrapper } from "@/components/table";
import { AppContainer } from "@/components/shared";
import { roomHistoryColumns } from "@/components/table/columns";
import { GameIcon, ClockIcon } from "@/components/icons/sidebar";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "@/components/icons/searchicon";

const Page = () => {
  const { rooms, loading } = useFetchRooms();
  const [filterValue, setFilterValue] = useState<string>("");

  const filteredRooms = rooms?.filter(({ players, createdBy }) => {
    const player = players?.[createdBy as "w" | "b"];

    if (!player || !player.profile) return;

    const { displayName, email } = player.profile;

    const handleFilterQuery = (query: string) =>
      query?.toLowerCase().trim().includes(filterValue?.toLowerCase().trim());

    const queryMatches =
      handleFilterQuery(displayName) || handleFilterQuery(email);

    return queryMatches;
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
          icon: <ClockIcon />,
          href: "/history",
          title: "History",
        },
      ]}
    >
      <div className="flex flex-col gap-4">
        {rooms.length > 0 && (
          <Input
            placeholder="Search Users..."
            labelPlacement="outside"
            startContent={<SearchIcon />}
            onChange={({ target: { value } }: { target: { value: string } }) =>
              setFilterValue(value)
            }
            className="w-80"
          />
        )}
        <TableWrapper
          title="Game History"
          isLoading={loading}
          data={filteredRooms}
          columns={roomHistoryColumns}
          cell={"rooms-history"}
        />
      </div>
    </AppContainer>
  );
};

export default Page;
