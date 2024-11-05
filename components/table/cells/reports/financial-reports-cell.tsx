import { ProfileData } from "@/types";
import { Props } from "react-apexcharts";
import ActionCells from "../actions-cell";
import CreatedAtCell from "../created-at-cell";
import UpdateReport from "@/components/reports/update-report";

const FinancialReportsRenderCells = ({ report, columnKey }: Props) => {
  const cellValue = report[columnKey as keyof ProfileData];

  switch (columnKey) {
    case "id":
    case "name":
    case "email":
    case "type":
    case "amount":
    case "description":
    case "category":
      return <span className="capitalize">{cellValue}</span>;

    case "date":
      return <CreatedAtCell data={report} />;

    case "actions":
      return (
        <ActionCells
          data={report}
          onEdit={<UpdateReport report={report} id={report.id} />}
          deleteApi={`/api/reports/${report.id}`}
        />
      );

    default:
      return cellValue;
  }
};

export default FinancialReportsRenderCells;
