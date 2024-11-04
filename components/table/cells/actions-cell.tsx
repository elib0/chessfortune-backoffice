import { Tooltip } from "@nextui-org/react";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { EyeIcon } from "../../icons/table/eye-icon";
import NextLink from "next/link";
import { ReactNode } from "react";

interface Props {
  title?: string;
  onViewHref?: string;
  onEdit?: ReactNode;
  onShowDeleteIcon?: boolean;
  onDeleteClick?: () => void;
}

const ActionCells = ({
  title = "",
  onViewHref,
  onEdit,
  onDeleteClick,
  onShowDeleteIcon = true,
}: Props) => (
  <div className="flex items-center gap-4">
    {onViewHref?.length && (
      <Tooltip content="Details">
        <NextLink href={onViewHref}>
          <EyeIcon size={20} fill="#979797" />
        </NextLink>
      </Tooltip>
    )}
    {onEdit}
    {onShowDeleteIcon && (
      <Tooltip content={`Delete ${title}`} color="danger">
        <button onClick={onDeleteClick}>
          <DeleteIcon size={20} fill="#FF0080" />
        </button>
      </Tooltip>
    )}
  </div>
);

export default ActionCells;
