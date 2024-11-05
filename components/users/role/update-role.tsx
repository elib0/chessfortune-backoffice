"use client";

import {
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAddActivity } from "@/hooks";
import { pages } from "@/helpers/data";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { IconButton } from "@/components/styles";

const UpdateRole: FC<{
  data: any;
}> = ({ data: { id, pages: userPages, role: userRole, userId } }) => {
  const { addActivity } = useAddActivity();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPages, setSelectedPages] = useState<string[]>(userPages);

  const handleSelectionChange = (href: string) => {
    setSelectedPages((prev: any) => {
      if (prev.includes(href)) {
        return prev.filter((page: any) => page !== href);
      } else {
        return [...prev, href];
      }
    });
  };

  const updateRoleHandler = async () => {
    try {
      setIsLoading(true);

      if (!userId) {
        throw new Error("Select a user to assign a role.");
      }

      const {
        data: { message },
      } = await axios.put(`/api/permissions/${id}`, {
        pages: selectedPages,
      });

      addActivity({
        action: `Updated Permissions to userId: ${userId}}`,
      });

      toast.success(message);
      setIsLoading(false);
      onOpenChange();
    } catch (error: any) {
      setIsLoading(false);
      toast.error(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : error.message
      );
    }
  };

  return (
    <>
      <IconButton onClick={onOpen} disabled={!userId}>
        <EditIcon size={20} fill="#979797" />
      </IconButton>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        size="4xl"
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        closeButton={<></>}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Assign Permissions
            </ModalHeader>
            <ModalBody className="p-6 py-0">
              <div className="grid grid-cols-3 items-start gap-4">
                {pages.map((item, index) => (
                  <div key={index}>
                    <CheckboxGroup
                      label={item.title}
                      defaultValue={selectedPages}
                    >
                      {item.pages.map(({ title, href }) => (
                        <Checkbox
                          key={href}
                          value={href}
                          onChange={() => handleSelectionChange(href)}
                        >
                          {title}
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </div>
                ))}
              </div>
            </ModalBody>
            <Divider className="mt-4" />
            <ModalFooter>
              <Button
                isLoading={isLoading}
                color="primary"
                onPress={updateRoleHandler}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateRole;
