import { ShareIcon, PieChartIcon } from "@/components/icons/sidebar";
import AppContainer from "@/components/shared/app-container";
import React from "react";

const Page = () => {
  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <ShareIcon />,
          href: "/referrals",
          title: "Referrals",
        },
        {
          icon: <PieChartIcon />,
          href: "/payments/program-overview",
          title: "Program Overview",
        },
      ]}
    >
      Program Overview
    </AppContainer>
  );
};

export default Page;
