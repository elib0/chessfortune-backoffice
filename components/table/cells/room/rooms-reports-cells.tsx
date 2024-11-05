import { RoomData } from "@/types";
import { Tooltip } from "@nextui-org/react";
import { FC } from "react";
import { Props } from "react-apexcharts";
import ActionCells from "../actions-cell";

const TooltipWrapper: FC<{ value: string }> = ({ value }) => (
  <Tooltip content={value} color={"danger"}>
    {value.length > 20 ? `${value.slice(0, 20)}...` : value}
  </Tooltip>
);

const renderTooltipCell = (value: any) => (
  <TooltipWrapper value={value.toString()} />
);

export const RoomsReportsRenderCells = ({ rooms, columnKey }: Props) => {
  const cellValue = rooms[columnKey as keyof RoomData];

  switch (columnKey) {
    case "boardSide":
      return <span>{cellValue === "w" ? "White" : "Black"}</span>;

    case "roomId":
    case "text":
    case "type":
      return renderTooltipCell(cellValue);

    case "actions":
      return (
        <ActionCells
          data={rooms}
          title={"Reported Rooms"}
          onViewHref={`/games/history/${rooms.roomId}`}
        />
      );

    default:
      return renderTooltipCell(cellValue);
  }
};

export default RoomsReportsRenderCells;
