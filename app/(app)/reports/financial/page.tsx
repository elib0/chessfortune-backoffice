"use client";

import React from "react";
import AppContainer from "@/components/shared/app-container";
import { ReportsIcon } from "@/components/icons/sidebar";
import { useFetchReports, useFetchUsers } from "@/hooks";
import AddReport from "@/components/reports/add-report";
import { FinancialReportTable } from "@/components/table/reports/financial-report-table";

const Page = () => {
  const { reports, loading } = useFetchReports();
  const { users, loading: usersLoading } = useFetchUsers();

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <ReportsIcon />,
          href: "/reports/financial",
          title: "Reports",
        },
        {
          icon: <ReportsIcon />,
          href: "#",
          title: "Financial",
        },
      ]}
      button={<AddReport />}
    >
      <FinancialReportTable
        isLoading={loading || usersLoading}
        data={reports?.map((item) => {
          const user = users.find((user) => user.id === item.userId);

          return {
            ...item,
            name: user?.displayName,
            email: user?.email,
          };
        })}
      />
    </AppContainer>
  );
};

export default Page;
