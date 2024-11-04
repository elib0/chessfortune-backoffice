import { TooltipWrapper } from "@/components/shared";
import { months } from "@/helpers/data";
import { FC } from "react";

const ActivityTimelineRenderCells: FC<{ activity: any; columnKey: any }> = ({
  activity,
  columnKey,
}) => {
  const cellValue = activity[columnKey as keyof typeof activity];

  switch (columnKey) {
    case "action":
      return <TooltipWrapper value={cellValue} wordLength={50} />;

    case "month":
      return (
        <span className="">
          {months[new Date(activity.createdAt).getMonth()].label}
        </span>
      );

    case "time":
      return (
        <span className="">
          {new Date(activity.createdAt).toLocaleTimeString()}
        </span>
      );

    case "date":
      return (
        <span className="">
          {new Date(activity.createdAt).toLocaleDateString()}
        </span>
      );

    default:
      return <TooltipWrapper value={cellValue} />;
  }
};

export default ActivityTimelineRenderCells;
