import { Text } from "@/components/styles";
import { ProfileData } from "@/types";
import { User, Chip } from "@nextui-org/react";
import { Props } from "react-apexcharts";
import ActionCells from "../actions-cell";
import { UpdateUser } from "@/components/users";

const UserRenderCells = ({ user, columnKey }: Props) => {
  const cellValue = user[columnKey as keyof ProfileData];

  switch (columnKey) {
    case "displayName":
      return (
        <User
          avatarProps={{
            radius: "lg",
            src: user.photoURL || "/blank-user.png",
          }}
          name={user.displayName}
        />
      );

    case "email":
      return <span>{user.email}</span>;

    case "elo":
      return <span>{user.elo}</span>;

    case "online":
      return (
        <div className="flex">
          <Chip color={user.online ? "success" : "danger"} variant={"shadow"}>
            {user.online ? "Online" : "Offline"}
          </Chip>
        </div>
      );

    case "referred":
      return <Text>{user.referred}</Text>;

    case "win":
      return <Text>{user.statistics.win}</Text>;

    case "loses":
      return <Text>{user.statistics.loses}</Text>;

    case "seeds":
      return <Text>{user.seeds}</Text>;

    case "actions":
      return (
        <ActionCells
          data={user}
          title={"user"}
          onViewHref={`/users/${user.id}`}
          deleteApi={`/api/users/${user.id}`}
          onEdit={<UpdateUser user={user} id={user.id} />}
        />
      );

    default:
      return cellValue;
  }
};

export default UserRenderCells;
