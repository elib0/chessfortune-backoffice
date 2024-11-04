"use client";

import { SearchIcon } from "@/components/icons/searchicon";
import { UserIcon, ActivityIcon } from "@/components/icons/sidebar";
import { AppContainer, Loader } from "@/components/shared";
import { TableWrapper } from "@/components/table";
import { activityTimelineColumns } from "@/components/table/columns";
import { convertFirestoreTimestampToDate } from "@/helpers";
import { months } from "@/helpers/data";
import { useFetchUserById, useFetchActivity } from "@/hooks";
import { ActivitiesType } from "@/types";
import {
  Avatar,
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const [filterValue, setFilterValue] = useState<string>("");
  const { user, loading: userLoading } = useFetchUserById(id as string);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const { activities, loading: activityLoading } = useFetchActivity();
  const [filteredActivities, setFilteredActivities] = useState<
    ActivitiesType[]
  >([]);

  useEffect(() => {
    if (selectedMonth === "All") {
      const data = activities.map((activity) => {
        return {
          ...activity,
          createdAt: convertFirestoreTimestampToDate(
            activity.createdAt
          ).toISOString(),
        };
      });

      setFilteredActivities(data);
    } else {
      const data = activities
        .filter((activity) => {
          const date = convertFirestoreTimestampToDate(activity.createdAt);
          return (
            new Date(date).toLocaleString("en-US", {
              month: "long",
            }) === months[Number(selectedMonth)].label
          );
        })
        .map((activity) => {
          return {
            ...activity,
            createdAt: convertFirestoreTimestampToDate(
              activity.createdAt
            ).toISOString(),
          };
        });

      setFilteredActivities(data);
    }
  }, [selectedMonth, activities]);

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <UserIcon />,
          href: "/staff",
          title: "Staff",
        },
        {
          icon: <ActivityIcon />,
          href: "/activity-monitoring",
          title: "Activity Monitoring",
        },
      ]}
    >
      {userLoading || activityLoading ? (
        <div className="flex items-center mt-12 div justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="w-full">
          {user && (
            <div className="flex mb-4 justify-between items-start">
              <div className="flex gap-4 justify-start items-center">
                <Avatar
                  size="lg"
                  radius="md"
                  src={user.photoURL || "/blank-user.png"}
                  name={user.displayName}
                />
                <div>
                  <h2 className="">{user.displayName}</h2>
                  <h3 className="">{user.email}</h3>
                </div>
              </div>
            </div>
          )}
          <div
            className={`flex items-center ${
              activities.length === 0 ? "justify-end" : "justify-between"
            } mt-4 mb-2`}
          >
            {activities.length > 0 && (
              <Input
                placeholder="Search Activities..."
                labelPlacement="outside"
                startContent={<SearchIcon />}
                onChange={({
                  target: { value },
                }: {
                  target: { value: string };
                }) => setFilterValue(value)}
                className="w-80"
              />
            )}
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">{`${
                  months[Number(selectedMonth)]?.label || "Year"
                }`}</Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select Month"
                onAction={(key) => setSelectedMonth(key as string)}
              >
                {months.map((month) => (
                  <DropdownItem key={month.value.toString()}>
                    {month.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <TableWrapper
            isLoading={activityLoading}
            data={filteredActivities.filter((activity) =>
              activity.action.toLowerCase().includes(filterValue.toLowerCase())
            )}
            columns={activityTimelineColumns}
            cell={"user-activity-history-timeline"}
            title={`Activities done on ${
              months[Number(selectedMonth)]?.label || "Year"
            }`}
          />
        </div>
      )}
    </AppContainer>
  );
};

export default Page;
