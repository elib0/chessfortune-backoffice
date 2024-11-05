"use client";

import React from "react";
import { useFetchReferrals } from "@/hooks";
import AppContainer from "@/components/shared/app-container";
import ShareIcon from "@/components/icons/sidebar/share-icon";
import { ReferralsTable } from "@/components/table/referrals/referrals-table";
import { PieChartIcon } from "@/components/icons/sidebar";

const Page = () => {
  const { referrals, loading } = useFetchReferrals();

  if (!loading && !referrals?.length)
    return (
      <div className="text-center mt-40">
        <h4 className="text-xl font-semibold">No Referrals Available</h4>
        <p className="text-gray-500 mt-2">
          We couldn’t find any referrals. Please check back later or contact
          support if you think this is an error.
        </p>
      </div>
    );

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
          href: "/",
          title: "Program Overview",
        },
      ]}
    >
      <ReferralsTable isLoading={loading} data={referrals} />
    </AppContainer>
  );
};

export default Page;
