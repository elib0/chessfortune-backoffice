"use client";

import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useState } from "react";
import Loader from "../../shared/loader";
import toast from "react-hot-toast";
import axios from "axios";
import { useAddActivity } from "@/hooks";

const CreateRole = () => {
  const { addActivity } = useAddActivity();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  const createRoleHandler = async () => {
    try {
      setIsLoading(true);

      if (!role) {
        throw new Error("Please ");
      }

      const {
        data: { message },
      } = await axios.post("/api/roles", {
        role,
      });

      addActivity({
        action: `Created role: ${role}`,
      });

      toast.success(message);
      setIsLoading(false);
      setVisible(false);
      location.reload();
      setRole("");
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
      <Button onClick={() => setVisible(true)}>Create Role</Button>

      <Modal
        isOpen={visible}
        placement="top-center"
        className="max-w-2xl"
        onClose={() => {
          setVisible(false);
          setRole("");
        }}
      >
        <ModalContent>
          <ModalHeader>Create New Role</ModalHeader>
          <Divider />
          <ModalBody>
            <Input
              label="Role"
              name="role"
              isClearable
              fullWidth
              size="lg"
              placeholder="Enter Role"
              value={role}
              onChange={({ target: { value } }: any) => setRole(value)}
            />
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              onClick={createRoleHandler}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader size="xs" />}
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateRole;
