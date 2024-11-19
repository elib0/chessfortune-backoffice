import { TooltipWrapper } from "@/components/shared";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { FC } from "react";
import CreatedAtCell from "../created-at-cell";
import { EditIcon } from "@/components/icons/table/edit-icon";
import { CheckIcon } from "@/components/icons/check-icon";
import toast from "react-hot-toast";
import { httpHeaderOptions } from "@/helpers";

const PaymentRenderCells: FC<{
  payment: any;
  columnKey: any;
  table: "payment" | "withdrawal";
  handleUserActivity: (id: string, value: string) => void;
  handleOpenApproveModal?: (open: boolean, id: string) => void;
}> = ({
  payment,
  columnKey,
  table,
  handleUserActivity,
  handleOpenApproveModal,
}) => {
  const actionOptions =
    table === "payment"
      ? ["completed", "expired"]
      : ["new", "processing", "completed", "expired"];

  const cellValue = payment[columnKey as keyof typeof payment];

  switch (columnKey) {
    case "amount":
      return <span className="">{`$${payment.amount}`}</span>;

    case "user":
      return (
        <div className="w-full flex flex-col">
          <h2 className="font-medium">{payment.user.displayName}</h2>
          <h3 className="font-medium">{payment.user.email}</h3>
        </div>
      );

    case "description":
      return (
        <TooltipWrapper
          value={cellValue ? cellValue : "No description available"}
          wordLength={32}
        />
      );

    case "statusUrl":
    case "seedAmount":
    case "confirmations":
    case "currentCurrency":
    case "txnId":
      return <TooltipWrapper value={cellValue} wordLength={12} />;

    case "createdAt":
      return <CreatedAtCell data={payment} />;

    case "status":
      return (
        <Chip
          variant="shadow"
          color={
            payment.status === "completed"
              ? "success"
              : payment.status === "new"
              ? "primary"
              : payment.status === "processing"
              ? "warning"
              : payment.status === "expired"
              ? "danger"
              : "default"
          }
          className="capitalize"
        >
          {payment.status}
        </Chip>
      );

    case "actions":
      return (
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light">
              <EditIcon size={20} fill="#979797" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            {actionOptions.map((item, index) => (
              <DropdownItem
                key={index}
                onPress={async () => {
                  try {
                    if (item !== payment.status) {
                      if (item !== "completed") {
                        await fetch(`/api/invoices/status`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            id: payment.id,
                            status: item,
                          }),
                          ...httpHeaderOptions,
                        });

                        handleUserActivity(payment.id, item);

                        toast.success(`Status updated successfully`);
                        location.reload();
                      } else if (handleOpenApproveModal) {
                        handleOpenApproveModal(true, payment.id);
                        handleUserActivity(payment.id, item);
                      }
                    }
                  } catch (error: any) {
                    console.error(
                      `Error updating status ${item}, ${error.message}`
                    );
                  }
                }}
              >
                <span className="flex items-center justify-between capitalize">
                  {item}
                  {payment.status === item && <CheckIcon />}
                </span>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      );

    default:
      return <TooltipWrapper value={cellValue} />;
  }
};

export default PaymentRenderCells;
