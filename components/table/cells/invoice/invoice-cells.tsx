import { TooltipWrapper } from "@/components/shared";
import { Chip } from "@nextui-org/react";
import { FC } from "react";
import ActionCells from "../actions-cell";
import CreatedAtCell from "../created-at-cell";
import PaymentUserInfo from "../payment/payment-user-info-cell";

const InvoiceRenderCells: FC<{ invoice: any; columnKey: any }> = ({
  invoice,
  columnKey,
}) => {
  const cellValue = invoice[columnKey as keyof typeof invoice];

  switch (columnKey) {
    case "amount":
      return <span className="">{`$${invoice.amount}`}</span>;

    case "user":
      return <PaymentUserInfo userId={invoice.profileId} />;

    case "statusUrl":
    case "seedAmount":
    case "confirmations":
    case "currentCurrency":
    case "txnId":
      return <TooltipWrapper value={cellValue} />;

    case "createdAt":
      return <CreatedAtCell data={invoice} />;

    case "status":
      return (
        <Chip
          variant="shadow"
          color={
            invoice.status === "completed"
              ? "success"
              : invoice.status === "new"
              ? "primary"
              : invoice.status === "process"
              ? "warning"
              : invoice.status === "expired"
              ? "danger"
              : "default"
          }
          className="capitalize"
        >
          {invoice.status}
        </Chip>
      );

    case "actions":
      return <ActionCells onViewHref={`/users/${invoice.id}`} />;

    default:
      return <TooltipWrapper value={cellValue} />;
  }
};

export default InvoiceRenderCells;
