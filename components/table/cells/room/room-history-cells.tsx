import { RoomData } from "@/types";
import { Tooltip } from "@nextui-org/react";
import { FC } from "react";
import { Props } from "react-apexcharts";
import CreatedAtCell from "../created-at-cell";
import ActionCells from "../actions-cell";
import RoomUserInfo from "./room-user-info-cell";
import AppChessBoard from "@/components/chessboard/app-chessboard";

const TooltipWrapper: FC<{ value: string }> = ({ value }) => (
  <Tooltip content={value} color={"danger"}>
    {value.length > 20 ? `${value.slice(0, 20)}...` : value}
  </Tooltip>
);

const renderTooltipCell = (value: any) => (
  <TooltipWrapper value={value.toString()} />
);

export const RoomsHistoryRenderCells = ({ room, columnKey }: Props) => {
  const cellValue = room[columnKey as keyof RoomData];

  switch (columnKey) {
    case "id":
    case "roomId":
      return renderTooltipCell(cellValue);

    case "user":
      return <RoomUserInfo room={room} />;

    case "bet":
      return <span>{cellValue} coins</span>;

    case "timer":
      return <span>{cellValue} mins</span>;

    case "createdBy":
      return <span>{cellValue === "w" ? "White" : "Black"}</span>;

    case "createdAt":
      return <CreatedAtCell data={room} />;

    case "history":
      return (
        <ActionCells data={room} onViewHref={`/games/history/${room.id}`} />
      );

    case "analysis":
      return (
        <>
          {room?.game?.history ? (
            <AppChessBoard game={room?.game?.history} />
          ) : (
            <span className="text-base font-medium">No game Available</span>
          )}
        </>
      );

    default:
      return renderTooltipCell(cellValue);
  }
};

export default RoomsHistoryRenderCells;
