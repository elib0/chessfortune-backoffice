"use client";

import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import React, { FC, useMemo, useState } from "react";
import Loader from "../shared/loader";
import toast from "react-hot-toast";
import axios from "axios";
import { useAddActivity } from "@/hooks";
import type { Selection } from "@nextui-org/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/client";
import { ReportsData } from "@/types";
import { EditIcon } from "../icons/table/edit-icon";
import { IconButton } from "../styles";

interface Report {
  amount: number;
  category: "Salary" | "Rent";
  description: string;
}

const formState: Report = {
  amount: 5.0,
  category: "Salary",
  description: "",
};

interface Props {
  report: ReportsData;
  id: string;
}

const UpdateReport: FC<Props> = ({ report, id }) => {
  const [user] = useAuthState(auth);
  const { addActivity } = useAddActivity();
  const [uploading, setUploading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Report>(report);
  const [visible, setVisible] = useState<boolean>(false);

  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set([formData.category])
  );

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async () => {
    try {
      setUploading(true);

      const { amount, description } = formData;

      if (!amount) {
        setUploading(false);
        return toast.error("Amount is required.");
      }

      if (!description) {
        setUploading(false);
        return toast.error("Description is required.");
      }

      const {
        data: { message },
      } = await axios.put(
        `/api/reports/${id}`,
        {
          ...formData,
          category: selectedValue,
          userId: user?.uid,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      addActivity({
        action: `Updated report with ID: ${id}`,
      });

      toast.success(message);
      setUploading(false);
      setVisible(false);
      location.reload();
      setFormData(formState);
    } catch (error) {
      setUploading(false);
      toast.error("Error updating document");
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
        isOpen={visible}
        placement="top-center"
        className="max-w-2xl"
        onClose={() => {
          setVisible(false);
          setSelectedKeys(new Set(["Salary"]));
        }}
      >
        <ModalContent>
          <ModalHeader>Update Report</ModalHeader>
          <Divider />
          <ModalBody>
            <div className="flex flex-col flex-wrap gap-4 lg:flex-nowrap">
              <div className="flex flex-wrap gap-4 lg:flex-nowrap justify-center items-end">
                <Input
                  label="Amount"
                  name="amount"
                  isClearable
                  fullWidth
                  size="lg"
                  placeholder="Enter Amount"
                  value={`${formData.amount}`}
                  onChange={handleChange}
                  type="number"
                />
                <div className="flex flex-col gap-2 w-full">
                  Category
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
                      {["Salaray", "Rent"].map((reason) => (
                        <DropdownItem key={reason}>{reason}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>

              <div className="flex justify-center flex-wrap gap-4 lg:flex-nowrap">
                <Textarea
                  label="Description"
                  name="description"
                  fullWidth
                  size="lg"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </ModalBody>
          <Divider className="mt-4" />
          <ModalFooter>
            <Button onClick={submitHandler} className="flex items-center gap-2">
              {uploading && <Loader size="xs" />}
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateReport;
