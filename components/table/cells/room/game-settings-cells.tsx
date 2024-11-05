import { Props } from "react-apexcharts";
import ActionCells from "../actions-cell";
import UpdateGame from "@/components/game/update-game";
import RoomUserInfo from "./room-user-info-cell";

export const GameSettingsRenderCells = ({ game, columnKey }: Props) => {
  const cellValue = game[columnKey];

  switch (columnKey) {
    case "user":
      return <RoomUserInfo room={game} />;

    case "id":
    case "timer":
    case "bet":
    case "gameOverReason":
      return <span>{cellValue}</span>;

    case "actions":
      return (
        <ActionCells
          data={game}
          onEdit={<UpdateGame game={game} id={game.id} />}
          // deleteApi={`/api/rooms/${game.id}`}
        />
      );

    default:
      return <span>{cellValue}</span>;
  }
};

export default GameSettingsRenderCells;
