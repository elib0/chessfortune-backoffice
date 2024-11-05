import { Tooltip } from "@nextui-org/react";
import { FC } from "react";

const TooltipWrapper: FC<{ value: string; wordLength?: number }> = ({
  value,
  wordLength = 20,
}) => (
  <Tooltip content={value.toString()} color={"danger"}>
    <span className="cursor-pointer">
      {value.length > wordLength
        ? `${value.slice(0, wordLength)}...`
        : value.toString()}
    </span>
  </Tooltip>
);

export default TooltipWrapper;
