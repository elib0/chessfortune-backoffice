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

export interface UserFormData {
  displayName: string;
  email: string;
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

const formState = {
  displayName: "",
  email: "",
  online: false,
  photoURL: null,
  config: {
    boardTheme: {
      set: "",
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
  const [uploading, setUploading] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserFormData>(formState);
  const [visible, setVisible] = useState<boolean>(false);

  const updateImage = async () => {
    const { name } = formData.photoURL as File;
    const imageRef = clientStorageRef(`/profile/${name + uuidv4()}`);
    await uploadBytes(imageRef, formData.photoURL as File);
    const image = await getDownloadURL(imageRef);
    return image;
  };

  const addUser = async () => {
    try {
      setUploading(true);

      if (!formData.displayName || !formData.email) {
        throw new Error("Please fill in all required top-level fields.");
      }

      if (!formData.config.boardTheme.set) {
        throw new Error("Please complete the board theme configuration.");
      }

      if (!formData.photoURL) {
        throw new Error("Please upload a photo.");
      }

      if (!(formData.photoURL instanceof File)) {
        throw new Error("Invalid photo file.");
      }

      const {
        data: { message },
      } = await axios.post("/api/users", {
        ...formData,
        photoURL: await updateImage(),
      });

      addActivity({
        action: `Added user with email: ${formData.email}`,
      });

      toast.success(message);
      setUploading(false);
      setVisible(false);
      location.reload();
      setFormData(formState);
    } catch (error: any) {
      setUploading(false);
      toast.error(error.message);
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
                  label="Name"
                  name="displayName"
                  isClearable
                  fullWidth
                  size="lg"
                  placeholder="Enter Name"
                  value={formData.displayName}
                  onChange={handleChange}
                />

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
              </div>

              <div className="flex justify-center flex-wrap gap-4 lg:flex-nowrap">
                <Input
                  label="Board Theme Set"
                  name="set"
                  isClearable
                  fullWidth
                  size="lg"
                  placeholder="Enter Board Theme Set"
                  value={formData.config.boardTheme.set}
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
                />
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

              <div className="flex justify-center flex-wrap gap-4 lg:flex-nowrap">
                <Input
                  label="Statistics Win"
                  name="win"
                  isClearable
                  fullWidth
                  size="lg"
                  type="number"
                  placeholder="Enter Wins"
                  value={`${formData.statistics.win}`}
                  onChange={({ target: { value } }: any) =>
                    setFormData((prevValue) => {
                      return {
                        ...prevValue,
                        statistics: {
                          ...prevValue.statistics,
                          win: value,
                        },
                      };
                    })
                  }
                />
                <Input
                  label="Statistics Loses"
                  name="loses"
                  isClearable
                  fullWidth
                  size="lg"
                  type="number"
                  placeholder="Enter Loses"
                  value={`${formData.statistics.loses}`}
                  onChange={({ target: { value } }: any) =>
                    setFormData((prevValue) => {
                      return {
                        ...prevValue,
                        statistics: {
                          ...prevValue.statistics,
                          loses: value,
                        },
                      };
                    })
                  }
                />
                <Input
                  label="Seeds"
                  name="seeds"
                  isClearable
                  fullWidth
                  size="lg"
                  type="number"
                  placeholder="Enter Seeds"
                  value={`${formData.seeds}`}
                  onChange={handleChange}
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
