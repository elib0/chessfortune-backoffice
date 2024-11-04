"use client";

import { LockIcon } from "@/components/icons/auth";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SearchIcon } from "@/components/icons/searchicon";
import { Loader } from "@/components/shared";
import AppContainer from "@/components/shared/app-container";
import { TableWrapper } from "@/components/table";
import { activityTimelineColumns } from "@/components/table/columns";
import { UpdateUser } from "@/components/users";
import { auth } from "@/firebase/client";
import { convertFirestoreTimestampToDate, httpHeaderOptions } from "@/helpers";
import { months } from "@/helpers/data";
import {
  useAddActivity,
  useFetchUserActivityById,
  useFetchUserById,
} from "@/hooks";
import { ActivitiesType } from "@/types";
import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

const Page = () => {
  const [user] = useAuthState(auth);
  const { addActivity } = useAddActivity();
  const { user: userData, loading } = useFetchUserById(user?.uid as string);
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const { userActivity, loading: userActivityLoading } =
    useFetchUserActivityById(user?.uid as string);
  const [filteredActivities, setFilteredActivities] = useState<
    ActivitiesType[]
  >([]);
  const [isPinGenerating, setIsPinGenerating] = useState<boolean>(false);

  useEffect(() => {
    if (selectedMonth === "All") {
      const data = userActivity.map((activity) => {
        return {
          ...activity,
          createdAt: convertFirestoreTimestampToDate(
            activity.createdAt
          ).toISOString(),
        };
      });

      setFilteredActivities(data);
    } else {
      const data = userActivity
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
  }, [selectedMonth, userActivity]);

  const generateUserPin = async () => {
    try {
      if (!userData) return;
      if (!userData.pin) {
        setIsPinGenerating(true);

        const res = await fetch(`/api/users/pin/${user?.uid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          ...httpHeaderOptions,
        });

        addActivity({
          action: `Generated a new PIN`,
        });

        if (res.ok) {
          toast.success("Pin was successfully generated");
          setIsPinGenerating(false);
          location.reload();
        }
      }
    } catch (error) {
      setIsPinGenerating(false);
      toast.error("Failed to create pin");
    }
  };

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <UsersIcon />,
          href: "/profile",
          title: "Profile",
        },
      ]}
    >
      {loading || userActivityLoading ? (
        <div className="flex items-center mt-12 div justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="flex flex-col">
          {userData && (
            <div className="flex justify-between items-start">
              <div className="flex gap-4 justify-start items-center">
                <Avatar
                  size="lg"
                  radius="md"
                  src={userData.photoURL || "/blank-user.png"}
                />
                <div>
                  <h2 className="">{userData.displayName}</h2>
                  <h3 className="">{userData.email}</h3>
                </div>
              </div>
              <div className={`flex gap-2`}>
                {!userData.pin ? (
                  <Button onPress={generateUserPin} isLoading={isPinGenerating}>
                    Generate PIN
                    <LockIcon fill="#fff" size={"1.2em"} />
                  </Button>
                ) : (
                  <Tooltip
                    content="User's Pin"
                    color="primary"
                    className="font-bold"
                  >
                    <Chip
                      startContent={<LockIcon fill="#fff" size={"1em"} />}
                      radius="sm"
                      color="default"
                      variant="shadow"
                      className="py-5 px-3 space-x-1 text-base cursor-pointer"
                    >
                      <span className="font-bold tracking-wider">{`${userData.pin}`}</span>
                    </Chip>
                  </Tooltip>
                )}
                <Button isIconOnly>
                  <UpdateUser user={userData} id={userData.uid} />
                </Button>
              </div>
            </div>
          )}
          <div
            className={`flex items-center ${
              userActivity.length === 0 ? "justify-end" : "justify-between"
            } mt-4 mb-2`}
          >
            {userActivity.length > 0 && (
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
            isLoading={userActivityLoading}
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
