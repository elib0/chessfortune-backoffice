import { EyeIcon } from "@/components/icons/table/eye-icon";
import { Referral } from "@/types"; // Adjust the import based on your project structure
import { User, Chip } from "@nextui-org/react";
import NextLink from "next/link";
import { Props } from "react-apexcharts";
import CreatedAtCell from "../created-at-cell";

const ReferralsRenderCells = ({ referral, columnKey }: Props) => {
  const cellValue = referral[columnKey as keyof Referral];
  switch (columnKey) {
    case "displayName":
      return (
        <User
          avatarProps={{
            radius: "lg",
            src: referral.photoURL || "/blank-user.png",
          }}
          name={referral.displayName}
        />
      );

    case "amount":
      return <span className="capitalize">{referral.amount}</span>;

    case "online":
      return (
        <Chip color={referral.online ? "success" : "danger"} variant={"shadow"}>
          {referral.online ? "Online" : "Offline"}
        </Chip>
      );

    case "status":
      return (
        <Chip
          color={referral.status === "completed" ? "success" : "warning"}
          variant={"shadow"}
        >
          {referral.status}
        </Chip>
      );

    case "createdBy":
      return (
        <User
          avatarProps={{
            radius: "lg",
            src: referral.createdByPhotoURL || "/blank-user.png",
          }}
          name={referral.createdByEmail}
        />
      );

    case "createdAt":
      return <CreatedAtCell data={referral} />;

    case "analysis":
      return (
        <NextLink href={`/games/history/${referral.id}`}>
          <EyeIcon size={20} fill="#979797" />
        </NextLink>
      );

    default:
      return cellValue;
  }
};

export default ReferralsRenderCells;
