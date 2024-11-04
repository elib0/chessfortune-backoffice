import ShareIcon from "@/components/icons/sidebar/share-icon";
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
      ]}
    >
      Referrals
    </AppContainer>
  );
};

export default Page;
