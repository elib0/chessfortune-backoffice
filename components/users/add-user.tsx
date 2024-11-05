"use client";

import {
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { FC, useState } from "react";
import ImagePicker from "../shared/image-picker";
import Loader from "../shared/loader";
import toast from "react-hot-toast";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { clientStorageRef } from "@/firebase/client";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { useAddActivity } from "@/hooks";
import { boardThemeSetOptions } from "@/helpers/data";
import { LockIcon, EyeSlashIcon } from "../icons/auth";
import { EyeIcon } from "../icons/table/eye-icon";

export interface UserFormData {
  displayName: string;
  email: string;
  password: string;
  online: boolean;
  photoURL: File | null;
  config: {
    boardTheme: {
      set: string;
      theme: number;
    };
    chat: boolean;
    sound: boolean;
  };
  statistics: {
    loses: number;
    win: number;
  };
  seeds: number;
}

const formState: UserFormData = {
  displayName: "",
  email: "",
  password: "",
  online: false,
  photoURL: null,
  config: {
    boardTheme: {
      set: "cburnett",
      theme: 0,
    },
    chat: false,
    sound: false,
  },
  statistics: {
    loses: 0,
    win: 0,
  },
  seeds: 0,
};

const AddUser: FC = () => {
  const { addActivity } = useAddActivity();
  const [visible, setVisible] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserFormData>(formState);

  const addImage = async () => {
    const { name } = formData.photoURL as File;
    const imageRef = clientStorageRef(`/profile/${name + uuidv4()}`);
    await uploadBytes(imageRef, formData.photoURL as File);
    const image = await getDownloadURL(imageRef);
    return image;
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const addUser = async () => {
    try {
      setUploading(true);

      const {
        displayName,
        email,
        password,
        config: {
          boardTheme: { set },
        },
      } = formData;

      if (!displayName || !email || !password) {
        throw new Error("Please fill in all required fields.");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      if (password.length < 6) {
        throw new Error("Password must me 6 digits long.");
      }

      if (!set) {
        throw new Error("Please select a board theme.");
      }

      const {
        data: { message },
      } = await axios.post("/api/users", {
        ...formData,
        photoURL: formData.photoURL ? await addImage() : "",
      });

      addActivity({
        action: `Added user with email: ${email}`,
      });

      toast.success(message);
      setUploading(false);
      setVisible(false);
      location.reload();
      setFormData(formState);
    } catch (error: any) {
      setUploading(false);
      toast.error(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : error.message
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Button onClick={() => setVisible(true)}>Add User</Button>

      <Modal
        isOpen={visible}
        placement="top-center"
        className="max-w-2xl"
        onClose={() => setVisible(false)}
      >
        <ModalContent>
          <ModalHeader>Add New User</ModalHeader>
          <Divider />
          <ModalBody>
            <div className="flex flex-col flex-wrap gap-4 lg:flex-nowrap">
              <div className="flex flex-wrap gap-10 lg:flex-nowrap">
                <ImagePicker
                  getFile={(value: File | null) => {
                    if (value) {
                      setFormData((prevVal) => {
                        return { ...prevVal, photoURL: value };
                      });
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-4 lg:flex-nowrap">
                {/* <Checkbox
                  size="md"
                  className="w-full"
                  onValueChange={(value) =>
                    setFormData((prevVal) => {
                      return { ...prevVal, online: value };
                    })
                  }
                >
                  Online Status
                </Checkbox> */}
                <Checkbox
                  size="md"
                  className="w-full"
                  onValueChange={(value) =>
                    setFormData((prevValue) => {
                      return {
                        ...prevValue,
                        config: {
                          ...prevValue.config,
                          chat: value,
                        },
                      };
                    })
                  }
                >
                  Chat
                </Checkbox>
                <Checkbox
                  size="md"
                  className="w-full"
                  onValueChange={(value) =>
                    setFormData((prevValue) => {
                      return {
                        ...prevValue,
                        config: {
                          ...prevValue.config,
                          sound: value,
                        },
                      };
                    })
                  }
                >
                  Sound
                </Checkbox>
              </div>
              <div className="flex flex-wrap gap-4 lg:flex-nowrap">
                <Input
                  label="Email"
                  name="email"
                  isClearable
                  fullWidth
                  size="lg"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <Input
                  fullWidth
                  name="password"
                  label="Password"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Enter your password"
                  type={isVisible ? "text" : "password"}
                  startContent={<LockIcon fill="#d0d1d0" />}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label="toggle password visibility"
                    >
                      {isVisible ? (
                        <EyeSlashIcon fill="#d0d1d0" />
                      ) : (
                        <EyeIcon fill="#d0d1d0" size={16} />
                      )}
                    </button>
                  }
                />
              </div>

              <div className="flex justify-center flex-wrap gap-4 lg:flex-nowrap">
                <Input
                  label="Name"
                  name="displayName"
                  isClearable
                  fullWidth
                  size="lg"
                  placeholder="Enter Name"
                  value={formData.displayName}
                  onChange={handleChange}
                />

                <Select
                  size="lg"
                  className="w-full"
                  label="Board Theme Set"
                  placeholder="Select Board Theme Set"
                  selectedKeys={[formData.config.boardTheme.set]}
                  onChange={({ target: { value } }: any) =>
                    setFormData((prevValue) => {
                      return {
                        ...prevValue,
                        config: {
                          ...prevValue.config,
                          boardTheme: {
                            ...prevValue.config.boardTheme,
                            set: value,
                          },
                        },
                      };
                    })
                  }
                >
                  {boardThemeSetOptions.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex justify-center flex-wrap gap-4 lg:flex-nowrap">
                <Input
                  label="Board Theme"
                  name="theme"
                  isClearable
                  fullWidth
                  size="lg"
                  type="number"
                  placeholder="Enter Board Theme"
                  value={`${formData.config.boardTheme.theme}`}
                  onChange={({ target: { value } }: any) =>
                    setFormData((prevValue) => {
                      return {
                        ...prevValue,
                        config: {
                          ...prevValue.config,
                          boardTheme: {
                            ...prevValue.config.boardTheme,
                            theme: value,
                          },
                        },
                      };
                    })
                  }
                />
              </div>
            </div>
          </ModalBody>
          <Divider className="mt-4" />
          <ModalFooter>
            <Button onClick={addUser} className="flex items-center gap-2">
              {uploading && <Loader size="xs" />}
              Add User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddUser;
