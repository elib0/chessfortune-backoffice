import { EyeIcon } from "@/components/icons/table/eye-icon";
import { ProfileData } from "@/types";
import { User, Chip } from "@nextui-org/react";
import NextLink from "next/link";
import { Props } from "react-apexcharts";

const ActivityHistoryRenderCells = ({ user, columnKey }: Props) => {
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

    case "win":
      return <span>{Number(user.statistics.win)}</span>;

    case "lost":
      return <span>{Number(user.statistics.loses)}</span>;

    case "gamePlayed":
      return (
        <span>
          {Number(user.statistics.win) + Number(user.statistics.loses)}
        </span>
      );

    // case "timeline":
    //   return (
    //     <NextLink href={`/users/activity-history/timeline/${user.id}`}>
    //       <EyeIcon size={20} fill="#979797" />
    //     </NextLink>
    //   );

    case "transaction":
      return (
        <NextLink href={`/users/${user.id}`}>
          <EyeIcon size={20} fill="#979797" />
        </NextLink>
      );
    default:
      return cellValue;
  }
};
export default ActivityHistoryRenderCells;
