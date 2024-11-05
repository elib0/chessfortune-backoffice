import { RoomData } from "@/types";
import { Chip, Tooltip } from "@nextui-org/react";
import { FC } from "react";
import { Props } from "react-apexcharts";
import CreatedAtCell from "../created-at-cell";
import ActionCells from "../actions-cell";

const UserInfo = ({ room }: { room: any }) => {
  const player = room?.players?.[room.createdBy];

  if (!player || !player.profile) {
    return <div>No user information available</div>;
  }

  const { displayName, email } = player.profile;

  return (
    <div className="w-full flex flex-col">
      <h2 className="capitalize">{displayName}</h2>
      <h3 className="capitalize">{email}</h3>
    </div>
  );
};

const WinnerInfo = ({ room }: { room: any }) => {
  const player = room?.players?.[room.winner];

  if (!player || !player.profile) {
    return <div>No user information available</div>;
  }

  const { displayName, email } = player.profile;

  return (
    <div className="w-full flex flex-col">
      <h2 className="capitalize">{displayName}</h2>
      <h3 className="capitalize">{email}</h3>
    </div>
  );
};

const TooltipWrapper: FC<{ value: string }> = ({ value }) => (
  <Tooltip content={value} color={"danger"}>
    {value.length > 20 ? `${value.slice(0, 20)}...` : value}
  </Tooltip>
);

const renderTooltipCell = (value: any) => (
  <TooltipWrapper value={value.toString()} />
);

export const RoomRenderCells = ({ room, columnKey }: Props) => {
  const cellValue = room[columnKey as keyof RoomData];

  switch (columnKey) {
    case "id":
      return renderTooltipCell(cellValue);

    case "bet":
      return <span>{cellValue} coins</span>;

    case "timer":
      return <span>{cellValue} mins</span>;

    case "createdBy":
      return <UserInfo room={room} />;

    case "winner":
      return <WinnerInfo room={room} />;

    case "private":
      return (
        <Chip color={cellValue ? "danger" : "success"} variant="solid">
          {cellValue ? "Private" : "Public"}
        </Chip>
      );

    case "gameOverReason":
      return <span>{cellValue || "No Reason"}</span>;

    case "createdAt":
      return <CreatedAtCell data={room} />;

    case "startAt":
    case "finishAt":
      return (
        <CreatedAtCell
          data={{
            createdAt: cellValue,
          }}
        />
      );

    case "actions":
      return (
        <ActionCells data={room} onViewHref={`/games/history/${room.id}`} />
      );
  }
};

export default RoomRenderCells;
