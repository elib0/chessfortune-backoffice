"use client";

import { Accordion, AccordionItem, Tooltip } from "@nextui-org/react";
import NextLink from "next/link";

interface Props {
  icon: React.ReactNode;
  title: string;
  items: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export const CollapseIconItems = ({ icon, items, title }: Props) => {
  return (
    <Accordion selectionMode="multiple" className="p-0">
      <AccordionItem
        className="sidebar-collapse-item"
        title={
          <div className="flex flex-row gap-3">
            <span>{icon}</span>
            <span>{title}</span>
          </div>
        }
      >
        {items.map((item, index) => (
          <Tooltip
            content={item.title}
            key={index}
            color={"primary"}
            placement="right"
          >
            <NextLink href={`${item.href}`}>
              <div
                className={`flex items-center justify-start gap-3 p-3 w-full rounded-lg hover:bg-default-100`}
              >
                {item.icon}
                <h4 className="text-base font-normal">
                  {item.title.length > 20
                    ? `${item.title.slice(0, 20)}...`
                    : item.title}
                </h4>
              </div>
            </NextLink>
          </Tooltip>
        ))}
      </AccordionItem>
    </Accordion>
  );
};
