import { ShareIcon, GiftIcon } from "@/components/icons/sidebar";
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
          icon: <GiftIcon />,
          href: "/payments/rewards",
          title: "Rewards",
        },
      ]}
    >
      Rewards
    </AppContainer>
  );
};

export default Page;
