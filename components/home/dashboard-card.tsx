import { Card, CardBody, Divider } from "@nextui-org/react";
import React, { FC } from "react";
import { Community } from "../icons/community";
import { DollarIcon } from "../icons/dollar-icon";
import { GameIcon } from "../icons/sidebar";
import { TicketIcon } from "../icons/ticket-icon";

interface Props {
  title?: string;
  content?: string;
  icon?: "community" | "dollar" | "game" | "ticket";
}

export const DashboardCard: FC<Props> = ({
  title,
  content,
  icon = "community",
}) => {
  return (
    <Card className="xl:max-w-sm bg-default-50 rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">
        <div className="flex items-center gap-2.5">
          {icon === "dollar" ? (
            <DollarIcon size={40} />
          ) : icon === "game" ? (
            <GameIcon size={40} color="currentColor" />
          ) : icon === "ticket" ? (
            <TicketIcon size={40} />
          ) : (
            <Community size={40} />
          )}
          <Divider orientation="vertical" />
          <div className="flex flex-col">
            <span className="text-default-900 text-xl font-semibold capitalize truncate w-full">
              {title}
            </span>
            <span className="text-default-900 text-sm font-medium capitalize">
              {content || 0}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
