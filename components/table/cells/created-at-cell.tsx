import { TooltipWrapper } from "@/components/shared";

interface Props {
  data: any;
}

const CreatedAtCell = ({ data }: Props) => {
  let date;
  if (data.createdAt && data.createdAt._seconds) {
    date = new Date(data.createdAt._seconds * 1000);
  } else {
    date = new Date(data.createdAt);
  }

  if (isNaN(date.getTime())) {
    return <TooltipWrapper value={"Invalid Date"} />;
  }

  return (
    <TooltipWrapper
      value={`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}
    />
  );
};

export default CreatedAtCell;
