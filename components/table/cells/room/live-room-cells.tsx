import { Chip, Tooltip } from "@nextui-org/react";
import CreatedAtCell from "../created-at-cell";
import { FC } from "react";
import { Props } from "react-apexcharts";
import { CheckIcon } from "@/components/icons/check-icon";
import { convertFirestoreTimestampToDate } from "@/helpers";
import { Timestamp } from "@firebase/firestore";
import { RoomData } from "@/types";
import RoomUserInfo from "./room-user-info-cell";

const TooltipWrapper: FC<{ value: string }> = ({ value }) => (
  <Tooltip content={value} color="primary">
    {value.length > 20 ? `${value.slice(0, 20)}...` : value}
  </Tooltip>
);

const renderTooltipCell = (value: any) => (
  <TooltipWrapper value={value.toString()} />
);

const getMilliseconds = (timestamp: Timestamp | Date | null) =>
  timestamp instanceof Timestamp
    ? timestamp.toMillis()
    : timestamp instanceof Date
    ? timestamp.getTime()
    : null;

const isLive = (room: RoomData) => {
  const now = Date.now();
  const startAtMillis = getMilliseconds(room.startAt);
  const finishAtMillis = getMilliseconds(room.finishAt);

  return (
    (startAtMillis && finishAtMillis
      ? startAtMillis < now && finishAtMillis > now
      : startAtMillis && !finishAtMillis) ?? false
  );
};

export const LiveRoomRenderCells = ({ room, columnKey }: Props) => {
  const cellValue = room[columnKey];

  switch (columnKey) {
    case "id":
    case "roomId":
      return renderTooltipCell(cellValue);

    case "createdBy":
      return <RoomUserInfo room={room} />;

    case "playerWhite":
      return <RoomUserInfo user="w" room={room} />;

    case "playerBlack":
      return <RoomUserInfo user="b" room={room} />;

    case "createdAt":
    case "startAt":
    case "finishAt":
      return (
        <CreatedAtCell
          data={{
            createdAt: cellValue,
          }}
        />
      );

    case "status":
      const isLiveStatus = isLive(room);

      return (
        <Chip variant="dot" color={isLiveStatus ? "success" : "danger"}>
          {isLiveStatus ? "Started" : "Finished"}
        </Chip>
      );

    default:
      return renderTooltipCell(cellValue);
  }
};

export default LiveRoomRenderCells;
