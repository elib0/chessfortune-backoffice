"use client";

import React from "react";
import AppContainer from "@/components/shared/app-container";
import { ReportsIcon } from "@/components/icons/sidebar";
import { TableWrapper } from "@/components/table";
import { reportsColumns } from "@/components/table/columns";
import { useFetchReports } from "@/hooks";
import { convertFirestoreTimestampToDate } from "@/helpers";
import AddReport from "@/components/reports/add-report";

const Page = () => {
  const { reports, loading } = useFetchReports();

  const csvData = [
    [
      "Report Id",
      "User Id",
      "Amount",
      "Type",
      "Category",
      "Description",
      "Created At",
    ],
    ...reports.map(
      ({ id, userId, amount, type, category, description, createdAt }) => {
        const date = convertFirestoreTimestampToDate(
          createdAt as any
        ).toISOString();

        return [id, userId, amount, type, category, description, date];
      }
    ),
  ];

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
      <TableWrapper
        isLoading={loading}
        data={reports}
        columns={reportsColumns}
        cell={"reports"}
        title="Financial Reports"
        showExportIcon
        csvData={{
          fileName: "financial-reports.csv",
          data: csvData,
        }}
      />
    </AppContainer>
  );
};

export default Page;
