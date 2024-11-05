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
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import React, { FC, useEffect, useMemo, useState } from "react";
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
import { reportTypes, categories } from "@/helpers/data";

interface Report {
  amount: number;
  type: string;
  category: string;
  description: string;
}

const formState: Report = {
  amount: 5,
  type: reportTypes[0].key,
  category: categories[0].key,
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

  useEffect(() => {
    setFormData(report);
  }, [report]);

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

      const { amount, description, type, category } = formData;

      if (!amount || Number(amount) === 0)
        throw new Error("Amount is required.");
      if (Number(amount) <= 0)
        throw new Error("Amount must be a positive value.");
      if (!description) throw new Error("Description is required.");
      if (!type) throw new Error("Type is required.");
      if (!category) throw new Error("Category is required.");

      const {
        data: { message },
      } = await axios.put(
        `/api/reports/${id}`,
        {
          ...formData,
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
          setFormData(formState);
        }}
      >
        <ModalContent>
          <ModalHeader>Update Income/Exprense</ModalHeader>
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
                <Select
                  size="lg"
                  label="Select Type"
                  className="w-full"
                  defaultSelectedKeys={[formData.type]}
                  onChange={({ target: { value } }: any) =>
                    setFormData((prevValue) => {
                      return {
                        ...prevValue,
                        type: value,
                      };
                    })
                  }
                >
                  {reportTypes.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
                <Select
                  size="lg"
                  label="Select Category"
                  className="w-full"
                  defaultSelectedKeys={[formData.category]}
                  onChange={({ target: { value } }: any) =>
                    setFormData((prevValue) => {
                      return {
                        ...prevValue,
                        category: value,
                      };
                    })
                  }
                >
                  {categories.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
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
