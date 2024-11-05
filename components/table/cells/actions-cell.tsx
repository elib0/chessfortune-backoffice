import { Tooltip } from "@nextui-org/react";
import { DeleteIcon } from "../../icons/table/delete-icon";
import { EyeIcon } from "../../icons/table/eye-icon";
import NextLink from "next/link";
import { ReactNode, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "@/components/shared";
import { clientStorageRef } from "@/firebase/client";
import { deleteObject } from "firebase/storage";

interface Props {
  title?: string;
  data: any;
  onViewHref?: string;
  deleteApi?: string;
  onEdit?: ReactNode;
}

const ActionCells = ({
  title = "",
  data,
  onViewHref,
  onEdit,
  deleteApi,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      if (!deleteApi) return;

      if (title === "user" && data.photoURL.length > 0) {
        if (data.photoURL.includes("googleusercontent.com/")) return;

        const oldImageRef = clientStorageRef(`${data.photoURL}`);
        await deleteObject(oldImageRef);
      }

      const {
        data: { message },
      } = await axios.delete(deleteApi, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success(message);
      location.reload();
    } catch (error: any) {
      setIsLoading(false);
      toast.error(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {onViewHref?.length && (
        <Tooltip
          color={data?.id ? "default" : "danger"}
          content={data?.id ? "Details" : "No Data"}
        >
          <NextLink href={onViewHref}>
            <EyeIcon size={20} fill="#979797" />
          </NextLink>
        </Tooltip>
      )}
      {onEdit}
      {deleteApi && (
        <Tooltip content={`Delete ${title}`} color="danger">
          <button onClick={handleDelete}>
            {isLoading ? (
              <Loader size="xs" />
            ) : (
              <DeleteIcon size={20} fill="#FF0080" />
            )}
          </button>
        </Tooltip>
      )}
    </div>
  );
};

export default ActionCells;
