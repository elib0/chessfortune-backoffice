import { EyeIcon } from "@/components/icons/table/eye-icon";
import { ProfileData } from "@/types";
import { User, Chip } from "@nextui-org/react";
import NextLink from "next/link";
import { Props } from "react-apexcharts";

const GameReportRenderCells = ({ report, columnKey }: Props) => {
  const cellValue = report[columnKey as keyof ProfileData];

  switch (columnKey) {
    case "displayName":
      return (
        <User
          avatarProps={{
            radius: "lg",
            src: report.photoURL || "/blank-user.png",
          }}
          name={report.displayName}
        />
      );

    case "gamePlayed":
      return (
        <Chip
          color={
            report.statistics.win + report.statistics.loses > 0
              ? "success"
              : "danger"
          }
          variant={"shadow"}
        >
          {report.statistics.win + report.statistics.loses}
        </Chip>
      );

    case "analysis":
      return (
        <NextLink href={`/games/history/${report.id}`}>
          <EyeIcon size={20} fill="#979797" />
        </NextLink>
      );
    default:
      return cellValue;
  }
};
export default GameReportRenderCells;
