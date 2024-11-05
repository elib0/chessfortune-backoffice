import { ReportsIcon } from "@/components/icons/sidebar";
import AppContainer from "@/components/shared/app-container";
import React from "react";

const Page = () => {
  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <ReportsIcon />,
          href: "/reports/security",
          title: "Reports",
        },
        {
          icon: <ReportsIcon />,
          href: "#",
          title: "Security",
        },
      ]}
    >
      Security
    </AppContainer>
  );
};

export default Page;
