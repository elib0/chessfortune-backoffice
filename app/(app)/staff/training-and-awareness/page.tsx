import { UserIcon, BookOpenIcon } from "@/components/icons/sidebar";
import { AppContainer } from "@/components/shared";
import React from "react";

const Page = () => {
  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <UserIcon />,
          href: "/staff",
          title: "Staff",
        },
        {
          icon: <BookOpenIcon />,
          href: "/training-and-awareness",
          title: "Training And Awareness",
        },
      ]}
    >
      Training And Awareness
    </AppContainer>
  );
};

export default Page;
