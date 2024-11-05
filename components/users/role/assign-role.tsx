"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { FC, useState } from "react";
import Loader from "../../shared/loader";
import toast from "react-hot-toast";
import axios from "axios";
import { useAddActivity, useFetchRoles } from "@/hooks";
import { ProfileData } from "@/types";

type UserRoles = "staff" | "staff-admin" | "admin";

export interface UserFormData {
  role: UserRoles;
  userId: string;
  email: string;
}

const formState: UserFormData = {
  role: "staff",
  userId: "",
  email: "",
};

const AssignRole: FC<{ users: ProfileData[] }> = ({ users }) => {
  const { addActivity } = useAddActivity();
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserFormData>(formState);
  const { roles, loading: rolesIsLoading } = useFetchRoles();

  const assignRoleHandler = async () => {
    try {
      setIsLoading(true);

      if (!formData.userId) {
        throw new Error("Select a user to assign a role.");
      }

      if (!formData.role) {
        throw new Error("Select a role.");
      }

      const {
        data: { message },
      } = await axios.post("/api/permissions", {
        ...formData,
      });

      addActivity({
        action: `Assigned role: ${formData.role} to userId: ${formData.userId}}`,
      });

      toast.success(message);
      setIsLoading(false);
      setVisible(false);
      location.reload();
      setFormData(formState);
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
      <Button onClick={() => setVisible(true)}>Assign Role</Button>

      <Modal
        isOpen={visible}
        placement="top-center"
        className="max-w-2xl"
        onClose={() => {
          setVisible(false);
          setFormData(formState);
        }}
      >
        <ModalContent>
          <ModalHeader>Assign New Role</ModalHeader>
          <Divider />
          <ModalBody>
            <div className="flex flex-col flex-wrap gap-4 lg:flex-nowrap">
              <div className="flex justify-center flex-wrap gap-4 lg:flex-nowrap">
                <Autocomplete
                  label="User"
                  placeholder="Search users..."
                  className="max-w-xs"
                  size="lg"
                  onSelectionChange={(key) => {
                    const [userId, email] = (key as string).split("+");
                    setFormData((prevValue) => {
                      return {
                        ...prevValue,
                        userId,
                        email,
                      };
                    });
                  }}
                >
                  {users.map(({ id, displayName, email, photoURL }) => (
                    <AutocompleteItem
                      key={`${id}+${email}`}
                      textValue={displayName}
                    >
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={displayName}
                          className="flex-shrink-0"
                          size="sm"
                          src={photoURL}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{displayName}</span>
                          <span className="text-tiny text-default-400">
                            {email}
                          </span>
                        </div>
                      </div>
                    </AutocompleteItem>
                  ))}
                </Autocomplete>

                <Select
                  size="lg"
                  isLoading={rolesIsLoading}
                  className="w-full"
                  label="Role"
                  placeholder="Select role"
                  selectedKeys={[formData.role]}
                  onChange={({ target: { value } }: any) =>
                    setFormData((prevValue) => {
                      return {
                        ...prevValue,
                        role: value,
                      };
                    })
                  }
                >
                  {roles.map(({ role }) => {
                    const item = role.toLowerCase();

                    return (
                      <SelectItem key={item} className="capitalize">
                        {item}
                      </SelectItem>
                    );
                  })}
                </Select>
              </div>
            </div>
          </ModalBody>
          <Divider className="mt-4" />
          <ModalFooter>
            <Button
              onClick={assignRoleHandler}
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

export default AssignRole;
