"use client";

import {
  Modal,
  Divider,
  Input,
  Checkbox,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Tooltip,
  ModalContent,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { IconButton } from "../styles";
import { ImagePicker, Loader } from "../shared";
import { FC, useState, useEffect } from "react";
import { EditIcon } from "../icons/table/edit-icon";
import { clientStorageRef } from "@/firebase/client";
import { uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useAddActivity } from "@/hooks";
import { boardThemeSetOptions } from "@/helpers/data";

export interface UserFormData {
  displayName: string;
  email: string;
  online: boolean;
  photoURL: File | null | string;
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

interface Props {
  user: UserFormData;
  id: string;
}

const UpdateUser: FC<Props> = ({ user, id }) => {
  const { addActivity } = useAddActivity();
  const [formData, setFormData] = useState<UserFormData>(user);
  const [visible, setVisible] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setFormData((prevVal) => {
      return { ...prevVal, photoURL: user.photoURL || null };
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateImage = async () => {
    const { name } = formData.photoURL as File;

    const imageRef = clientStorageRef(`/profile/${name + uuidv4()}`);
    await uploadBytes(imageRef, formData.photoURL as File);
    const image = await getDownloadURL(imageRef);
    return image;
  };

  const clearImage = () => {
    setFormData((prevVal) => {
      return { ...prevVal, photoURL: user.photoURL };
    });
  };

  const updateUser = async () => {
    try {
      setIsUploading(true);

      if (!id || id === undefined) {
        throw new Error("User ID is required. Please provide a valid user ID.");
      }

      if (!formData.displayName || !formData.email) {
        throw new Error("Please fill in all required top-level fields.");
      }

      if (!formData.config.boardTheme.set) {
        throw new Error("Please select a board theme.");
      }

      let newImageRef = `${user.photoURL}` as string;

      if (!newImageRef) {
        if (formData.photoURL === null) {
          toast.error(`Choose a photo to upload`);
          setIsUploading(false);
          return;
        }

        newImageRef = await updateImage();
      } else if (user.photoURL !== formData.photoURL) {
        if (newImageRef.includes("googleusercontent.com/")) {
          newImageRef = await updateImage();
        } else {
          const oldImageRef = clientStorageRef(`${user.photoURL}`);
          await deleteObject(oldImageRef);

          newImageRef = await updateImage();
        }
      }

      const {
        data: { message },
      } = await axios.put(`/api/users/${id}`, {
        ...formData,
        photoURL: newImageRef,
      });

      addActivity({
        action: `Updated user with email: ${formData.email}`,
      });

      toast.success(message);
      setVisible(false);
      location.reload();
    } catch (error: any) {
      setIsUploading(false);
      toast.error(error.mesage);
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
          clearImage();
        }}
      >
        <ModalContent>
          <ModalHeader>Update User</ModalHeader>
          <Divider />
          <ModalBody>
            <div className="flex flex-col flex-wrap gap-4 lg:flex-nowrap">
              <ImagePicker
                image={`${user.photoURL}`}
                getFile={(value: File | null) => {
                  if (value) {
                    setFormData((prevVal) => {
                      return { ...prevVal, photoURL: value };
                    });
                  }
                }}
              />

              {formData?.config?.chat && formData?.config?.sound && (
                <div className="flex flex-wrap gap-4 lg:flex-nowrap">
                  {/* <Checkbox
                defaultSelected={formData.online}
                size="md"
                width={"w-full"}
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
                    defaultSelected={formData.config.chat}
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
                    defaultSelected={formData.config.sound}
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
              )}
              <div className="flex flex-wrap gap-4 lg:flex-nowrap">
                <Input
                  label="Name"
                  name="displayName"
                  variant="bordered"
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
                  variant="bordered"
                  isClearable
                  fullWidth
                  size="lg"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-center flex-wrap gap-4 lg:flex-nowrap">
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
            <Button
              onClick={updateUser}
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

export default UpdateUser;
