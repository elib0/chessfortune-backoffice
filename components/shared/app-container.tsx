"use client";

import React, { FC, ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";

interface Props {
  breadCrumbs?: {
    icon: ReactNode;
    href: string;
    title: string;
  }[];
  children: React.ReactNode;
  button?: ReactNode;
}

const AppContainer: FC<Props> = ({ breadCrumbs, button, children }) => {
  return (
    <div className="overflow-hidden h-full">
      <div className="flex flex-col justify-center flex-wrap h-fit pt-5 gap-4 p-6 sm:p-8 sm:px-12 w-full">
        <div className="flex justify-between">
          <Breadcrumbs
            css={{
              marginBlock: 0,
            }}
          >
            {breadCrumbs &&
              breadCrumbs.map(({ href, title, icon }, index) => (
                <Crumb
                  key={index}
                  css={{
                    marginBlock: 0,
                  }}
                >
                  {icon}
                  <Link href={href}>
                    <CrumbLink
                      href="#"
                      css={{
                        cursor: "pointer",
                      }}
                    >
                      {title}
                    </CrumbLink>
                  </Link>
                  {index !== breadCrumbs.length - 1 && <div>/</div>}
                </Crumb>
              ))}
          </Breadcrumbs>
          {button}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AppContainer;
