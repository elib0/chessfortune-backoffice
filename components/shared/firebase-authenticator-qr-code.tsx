import { useFirebaseQrAuthenticator } from "@/hooks";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import React from "react";
import { QrCodeIcon } from "../icons/qr-code-icon";
import { QRCodeCanvas } from "qrcode.react";

const FirebaseAuthenticatorQRCode = () => {
  const { qrUri } = useFirebaseQrAuthenticator();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button isIconOnly size="sm" onPress={onOpen}>
        <QrCodeIcon />
      </Button>
      <Modal backdrop={"blur"} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Authenticator QR Code
          </ModalHeader>
          <ModalBody>
            <div className={`flex justify-center items-center mb-4`}>
              <div className={`bg-default-100 p-4 rounded-lg w-fit`}>
                <QRCodeCanvas value={qrUri} />
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FirebaseAuthenticatorQRCode;
