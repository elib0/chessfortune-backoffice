import { Props } from "react-apexcharts";
import ActionCells from "../actions-cell";

const RoleRenderCells = ({ role, columnKey }: Props) => {
  const cellValue = role[columnKey as keyof any];

  switch (columnKey) {
    case "role":
      return <span>{cellValue}</span>;

    case "delete":
      return <ActionCells data={role} deleteApi={`/api/roles/${role.id}`} />;

    default:
      return cellValue;
  }
};
export default RoleRenderCells;
