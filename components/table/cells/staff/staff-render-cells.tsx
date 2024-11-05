import { Props } from "react-apexcharts";
import ActionCells from "../actions-cell";
import UpdateRole from "@/components/users/role/update-role";

const StaffRenderCells = ({ role, columnKey }: Props) => {
  const cellValue = role[columnKey as keyof any];

  switch (columnKey) {
    case "id":
    case "userId":
    case "role":
    case "name":
    case "email":
      return <span>{cellValue}</span>;

    case "permission":
      return <ActionCells data={role} onEdit={<UpdateRole data={role} />} />;

    case "delete":
      return (
        <ActionCells data={role} deleteApi={`/api/permissions/${role.id}`} />
      );

    default:
      return cellValue;
  }
};
export default StaffRenderCells;
