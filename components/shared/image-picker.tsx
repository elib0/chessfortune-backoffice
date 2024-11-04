"use client";

import React, { useEffect, useRef, useState } from "react";
import { Image } from "@nextui-org/react";

interface ImagePickerProps {
  image?: string;
  getFile: (file: File | null) => void;
  getBase64?: (file: string) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  getFile,
  image = "",
  getBase64,
}) => {
  const btnRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(image);

  useEffect(() => {
    if (image?.length) {
      setPreviewUrl(image);
    }
  }, [image]);

  const handleClick = React.useCallback(() => btnRef.current?.click(), []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;

    const file = inputElement.files?.[0];

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      getFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (getBase64) {
          getBase64(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex items-center bg-default-100 rounded-3xl cursor-pointer p-6 w-fit">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        ref={btnRef}
      />

      <button
        onClick={handleClick}
        className="overflow-hidden rounded-2xl border-2 border-dashed border-white w-full"
      >
        <Image
          src={previewUrl || "/blank-user.png"}
          alt="Selected Image"
          width={150}
          height={150}
          placeholder="blur"
          className="rounded-xl"
        />
      </button>

      {/* {previewUrl && (
        <Box
          onClick={() => {
            getFile(null);
            if (getBase64) {
              getBase64("");
            }
            setPreviewUrl("");
          }}
          color="error"
          css={{
            d: "flex",
            jc: "center",
            position: "absolute",
            top: "$4",
            right: "$4",
            m: "auto",
            p: "$2",
            background: "$error",
            borderRadius: "6px",
          }}
        >
          <CloseIcon />
        </Box>
      )} */}
    </div>
  );
};

export default ImagePicker;
