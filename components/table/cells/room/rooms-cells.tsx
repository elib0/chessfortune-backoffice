import { RoomData } from "@/types";
import { Tooltip } from "@nextui-org/react";
import { FC } from "react";
import { Props } from "react-apexcharts";
import CreatedAtCell from "../created-at-cell";
import ActionCells from "../actions-cell";

const UserInfo = ({ user, room }: { user: "w" | "b"; room: any }) => {
  const { displayName, email } = room.players[room.createdBy].profile;

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
    case "winner":
      return <UserInfo user={cellValue} room={room} />;

    case "gameOverReason":
      return <span>{cellValue}</span>;

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
      return <ActionCells onViewHref={`/rooms/${room.id}`} />;
  }
};

export default RoomRenderCells;
