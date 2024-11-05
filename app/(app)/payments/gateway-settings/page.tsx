import { SettingsIcon, WalletIcon } from "@/components/icons/sidebar";
import AppContainer from "@/components/shared/app-container";
import React from "react";

const Page = () => {
  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <WalletIcon />,
          href: "/payments",
          title: "Payments",
        },
        {
          icon: <SettingsIcon />,
          href: "/payments/gateway-settings",
          title: "Payment Gateway Settings",
        },
      ]}
    >
      Payment Gateway Settings
    </AppContainer>
  );
};

export default Page;
