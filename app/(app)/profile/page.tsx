"use client";

import { LockIcon } from "@/components/icons/auth";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SearchIcon } from "@/components/icons/searchicon";
import { Loader } from "@/components/shared";
import AppContainer from "@/components/shared/app-container";
import { TableWrapper } from "@/components/table";
import {
  activityTimelineColumns,
  paymentColumns,
} from "@/components/table/columns";
import { PaymentTable } from "@/components/table/payment/payment-table";
import { UpdateUser } from "@/components/users";
import { auth } from "@/firebase/client";
import { convertFirestoreTimestampToDate } from "@/helpers";
import { months } from "@/helpers/data";
import {
  useFetchInvoicesByUserId,
  useFetchUserActivityById,
  useFetchUserByEmail,
  useFetchUserById,
  useGenerateUserPin,
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

const Page = () => {
  const [user] = useAuthState(auth);
  const { user: userData, loading } = useFetchUserById(user?.uid as string);
  const { userInvoices, loading: invoicesLoading } = useFetchInvoicesByUserId(
    userData?.id as string
  );
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const { userActivity, loading: userActivityLoading } =
    useFetchUserActivityById(user?.uid as string);
  const [filteredActivities, setFilteredActivities] = useState<
    ActivitiesType[]
  >([]);
  const { isPinGenerating, generatePin } = useGenerateUserPin();

  useEffect(() => {
    if (selectedMonth === "All") {
      const data = userActivity?.map((activity) => {
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
        ?.filter((activity) => {
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
      {loading || userActivityLoading || invoicesLoading ? (
        <div className="flex items-center mt-12 div justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {userData && (
            <div className="flex justify-between items-start">
              <div className="flex gap-4 justify-start items-center">
                <Avatar
                  size="lg"
                  radius="md"
                  src={userData.photoURL || "/blank-user.png"}
                />
                <div>
                  <div className="flex gap-2">
                    <h2 className="">{userData.displayName}</h2>
                    <UpdateUser user={userData} id={userData.id} />
                  </div>
                  <h3 className="">{userData.email}</h3>
                </div>
              </div>
              <Tooltip
                content="Click to generate a new security PIN"
                color="primary"
                className="font-bold"
              >
                <Button onPress={generatePin} isLoading={isPinGenerating}>
                  <Chip
                    startContent={
                      !isPinGenerating ? (
                        <LockIcon fill="#fff" size={"1em"} />
                      ) : null
                    }
                    radius="sm"
                    color="default"
                    variant="shadow"
                    className="p-0 space-x-1 text-base cursor-pointer"
                  >
                    <span className="font-bold tracking-wider">
                      {!userData.pin ? "Generate PIN" : userData.pin}
                    </span>
                  </Chip>
                </Button>
              </Tooltip>
            </div>
          )}
          {userActivity && (
            <div className="space-y-4 mt-4 mb-2">
              <div
                className={`flex items-center ${
                  userActivity.length === 0 ? "justify-end" : "justify-between"
                }`}
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
                  activity.action
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
                )}
                columns={activityTimelineColumns}
                cell={"user-activity-history-timeline"}
                title={`Activities done on ${
                  months[Number(selectedMonth)]?.label || "Year"
                }`}
              />
            </div>
          )}
          {/* {userInvoices && ( */}
          <PaymentTable
            isLoading={loading}
            data={userInvoices || []}
            columns={paymentColumns}
            title={`Payments`}
            table="payment"
            showSeedRange={true}
          />
          {/* )} */}
        </div>
      )}
    </AppContainer>
  );
};

export default Page;
