import { ProfileData } from "@/types";
import { Props } from "react-apexcharts";
import ActionCells from "../actions-cell";
import CreatedAtCell from "../created-at-cell";
import axios from "axios";
import toast from "react-hot-toast";
import UpdateReport from "@/components/reports/update-report";

const FinancialReportsRenderCells = ({ report, columnKey }: Props) => {
  const cellValue = report[columnKey as keyof ProfileData];

  switch (columnKey) {
    case "id":
    case "userId":
    case "type":
    case "amount":
    case "description":
    case "category":
      return <span>{cellValue}</span>;

    case "date":
      return <CreatedAtCell data={report} />;

    case "actions":
      return (
        <ActionCells
          onEdit={<UpdateReport report={report} id={report.id} />}
          onDeleteClick={async () => {
            const {
              data: { message },
            } = await axios.delete(`/api/reports/${report.id}`, {
              headers: {
                "Content-Type": "application/json",
              },
            });

            toast.success(message);
            location.reload();
          }}
        />
      );

    default:
      return cellValue;
  }
};

export default FinancialReportsRenderCells;
