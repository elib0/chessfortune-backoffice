import { Props } from "react-apexcharts";
import ActionCells from "../actions-cell";
import UpdateGame from "@/components/game/update-game";
import axios from "axios";
import toast from "react-hot-toast";
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
          onEdit={<UpdateGame game={game} id={game.id} />}
          onDeleteClick={async () => {
            const {
              data: { message },
            } = await axios.delete(`/api/rooms/${game.id}`, {
              headers: {
                "Content-Type": "application/json",
              },
            });

            toast.success(message);
            location.reload();
          }}
        />
      );

    default:
      return <span>{cellValue}</span>;
  }
};

export default GameSettingsRenderCells;
