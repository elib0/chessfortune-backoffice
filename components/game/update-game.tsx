"use client";

import {
  Modal,
  Divider,
  Input,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Tooltip,
  ModalContent,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { IconButton } from "../styles";
import { Loader } from "../shared";
import { FC, useMemo, useState } from "react";
import { EditIcon } from "../icons/table/edit-icon";
import axios from "axios";
import { useAddActivity } from "@/hooks";
import { RoomData } from "@/types";
import type { Selection } from "@nextui-org/react";

interface Props {
  game: RoomData;
  id: string;
}

const gameOverReasons = [
  "timeOut",
  "surrender",
  "mutualDraw",
  "timeOutDisconnection",
];

const UpdateGame: FC<Props> = ({ game, id }) => {
  const { addActivity } = useAddActivity();
  const [formData, setFormData] = useState<RoomData>(game);
  const [visible, setVisible] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set([game.gameOverReason])
  );

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const submitHandler = async () => {
    try {
      setIsUploading(true);

      const { timer, bet, gameOverReason } = formData;

      if (!timer) {
        setIsUploading(false);
        return toast.error("Game Time is required.");
      }

      if (!gameOverReason) {
        setIsUploading(false);
        return toast.error("Game Over Reason is required.");
      }

      if (!bet) {
        setIsUploading(false);
        return toast.error("Game Bet is required.");
      }

      const {
        data: { message },
      } = await axios.put(
        `/api/rooms/${id}`,
        {
          ...formData,
          gameOverReason: selectedValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      addActivity({
        action: `Updated Game ID: ${formData.id}`,
      });

      toast.success(message);
      setVisible(false);
      location.reload();
    } catch (error: any) {
      setIsUploading(false);
      toast.error("Error updating profile: ", error.mesage);
    }
  };

  return (
    <>
      <Tooltip content={`Edit User`} color="secondary">
        <IconButton onClick={() => setVisible(true)}>
          <EditIcon size={20} fill="#979797" />
        </IconButton>
      </Tooltip>
      <Modal
        closeButton
        placement="top-center"
        className="max-w-2xl"
        isOpen={visible}
        onClose={() => {
          setVisible(false);
          setSelectedKeys(new Set([game.gameOverReason]));
        }}
      >
        <ModalContent>
          <ModalHeader>Update User</ModalHeader>
          <Divider />
          <ModalBody>
            <div className="flex flex-col flex-wrap gap-4 lg:flex-nowrap">
              <div className="flex flex-wrap gap-4 lg:flex-nowrap">
                <Input
                  label="Game Time"
                  name="timer"
                  variant="bordered"
                  isClearable
                  fullWidth
                  size="lg"
                  placeholder="Enter Game Time"
                  value={`${formData.timer}`}
                  onChange={handleChange}
                />
                <Input
                  label="Game Bet"
                  name="bet"
                  variant="bordered"
                  isClearable
                  fullWidth
                  size="lg"
                  placeholder="Enter Game Bet"
                  value={`${formData.bet}`}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2 w-fit">
                Game Over Reason
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" className="capitalize">
                      {selectedValue}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Single selection example"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                  >
                    {gameOverReasons.map((reason) => (
                      <DropdownItem key={reason}>{reason}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </ModalBody>
          <Divider className="mt-4" />
          <ModalFooter>
            <Button
              onClick={submitHandler}
              className={`flex items-center justify-center gap-4`}
              disabled={isUploading}
            >
              {isUploading && <Loader size="xs" />}
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGame;
