"use client";

import { UserIcon, ActivityIcon } from "@/components/icons/sidebar";
import { AppContainer } from "@/components/shared";
import { TableWrapper } from "@/components/table";
import { activityHistoryColumns } from "@/components/table/columns";
import { useFetchUsers } from "@/hooks";
import React from "react";

const ActivityHistoryPage = () => {
  const { users, loading } = useFetchUsers();

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <UserIcon />,
          href: "/users",
          title: "User",
        },
        {
          icon: <ActivityIcon />,
          href: "/activity-history",
          title: "Activity History",
        },
      ]}
    >
      <TableWrapper
        title="Activity"
        isLoading={loading}
        data={users}
        columns={activityHistoryColumns}
        cell={"user-activity-history"}
        showDateFilter={true}
      />
    </AppContainer>
  );
};

export default ActivityHistoryPage;
