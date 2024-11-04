import { ProfileData } from "@/types";
import { Chip, User } from "@nextui-org/react";
import { Props } from "react-apexcharts";
import NextLink from "next/link";
import { EyeIcon } from "@/components/icons/table/eye-icon";

const IdentityVerificationRenderCells = ({ user, columnKey }: Props) => {
  const cellValue = user[columnKey as keyof ProfileData];

  switch (columnKey) {
    case "displayName":
      return (
        <User
          avatarProps={{
            src: user.photoURL || "/blank-user.png",
          }}
          name={user.displayName}
        >
          {user.email}
        </User>
      );

    case "identity":
      return (
        <Chip color={user.photoURL ? "success" : "danger"} variant={"shadow"}>
          {user.photoURL ? "Verified" : "Not Verified"}
        </Chip>
      );

    case "history":
      return (
        <NextLink href={`/users/${user.id}`}>
          <EyeIcon size={20} fill="#979797" />
        </NextLink>
      );

    default:
      return cellValue;
  }
};

export default IdentityVerificationRenderCells;
