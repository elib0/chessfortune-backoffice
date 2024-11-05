"use client";

import { Loader } from "@/components/shared";
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Chip,
  DateRangePicker,
  Input,
  Tooltip,
  CalendarDate,
} from "@nextui-org/react";
import React, { FC, useState, useEffect } from "react";
import { isWithinInterval } from "date-fns";
import { CancelIcon } from "@/components/icons/cancel-icon";
import { today, getLocalTimeZone } from "@internationalized/date";
import { SearchIcon } from "@/components/icons/searchicon";
import { referralColumns } from "../columns";

import {
  convertFirestoreTimestampToDate,
  getCalenderDateValue,
} from "@/helpers";

import { Referral } from "@/types";
import ReferralsRenderCells from "../cells/referrals/referrals-cells";
import { usePathname } from "next/navigation";

type StatusSelectionType = "all" | "pending" | "completed";

interface Props {
  data: Referral[];
  isLoading: boolean;
}

export const ReferralsTable: FC<Props> = ({ data, isLoading }) => {
  const pathname = usePathname();
  const [page, setPage] = React.useState(1);
  const [tableData, setTableData] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterDate, setFilterDate] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] =
    React.useState<StatusSelectionType>("all");

  useEffect(() => {
    const filteredData = data?.flatMap(
      ({ displayName, email, photoURL, referrals }) => {
        const handleFilterQuery = (query: string) =>
          query
            ?.toLowerCase()
            .trim()
            .includes(filterQuery?.toLowerCase().trim());

        const nameMatchesProfile =
          handleFilterQuery(displayName) || handleFilterQuery(email);

        const filteredReferrals = referrals.filter((referral) => {
          const nameMatchesReferral =
            handleFilterQuery(referral.displayName) ||
            handleFilterQuery(referral.email);

          const nameMatches = nameMatchesProfile || nameMatchesReferral;
          const statusMatches =
            statusFilter === "all" || referral.status === statusFilter;

          const dateMatches = filterDate
            ? referrals.some((ref) => {
                const date = convertFirestoreTimestampToDate(
                  ref.createdAt as any
                );
                return isWithinInterval(date, {
                  start: new Date(filterDate.start),
                  end: new Date(filterDate.end),
                });
              })
            : true;

          return nameMatches && dateMatches && statusMatches;
        });

        return filteredReferrals.map((referral) => ({
          id: referral.id,
          displayName: referral.displayName,
          photoURL: referral.photoURL,
          email: referral.email,
          amount: referral.amount || 0,
          online: referral.online,
          status: referral.status,
          createdByEmail: email,
          createdByPhotoURL: photoURL,
          createdAt: referral.createdAt,
        }));
      }
    );

    setTableData(filteredData);
  }, [data, filterDate, filterQuery, statusFilter]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-40 w-full">
        <Loader size="lg" />
      </div>
    );

  if (!isLoading && !data?.length)
    return (
      <div className="text-center my-40 w-full">
        <h4 className="text-xl font-semibold capitalize">{`No Referrals Available`}</h4>
        <p className="text-gray-500 mt-2">
          {`
          We couldn’t find any Referrals data. Please check back later or contact support
          if you think this is an error.
          `}
        </p>
      </div>
    );

  const totalPages = Math.ceil((tableData?.length || 1) / rowsPerPage);

  const paginatedData = Array.isArray(tableData)
    ? tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : [];

  const calculatedReferralData = data.reduce(
    (acc, referrer) => {
      const totalReferrals = referrer.referrals.length;

      const activeReferrals = referrer.referrals.filter(
        (ref) => ref.status === "completed"
      ).length;

      const inactiveReferrals = referrer.referrals.filter(
        (ref) => ref.status !== "completed"
      ).length;

      const totalRevenue = referrer.referrals.reduce(
        (sum, ref) => sum + (ref.amount || 0),
        0
      );

      acc.totalReferrals = (acc.totalReferrals || 0) + totalReferrals;
      acc.activeReferrals = (acc.activeReferrals || 0) + activeReferrals;
      acc.inactiveReferrals = (acc.inactiveReferrals || 0) + inactiveReferrals;
      acc.totalRevenue = (acc.totalRevenue || 0) + totalRevenue;

      return acc;
    },
    {
      totalReferrals: 0,
      activeReferrals: 0,
      inactiveReferrals: 0,
      totalRevenue: 0,
    }
  );

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <div className="flex gap-4 justify-between items-center w-full">
        {tableData && (
          <div className="w-full">
            <h3 className="capitalize text-xl font-semibold">{`Referrals`}</h3>
          </div>
        )}
        {pathname === "/referrals/program-overview" && (
          <div className="flex justify-end gap-4 w-full">
            <Chip radius={"sm"} className={`text-lg p-6`} color={"primary"}>
              <div className="flex gap-2 font-semibold">
                <span className="capitalize">{`Total Referrals:`}</span>
                <span>{`${calculatedReferralData.totalReferrals}`}</span>
              </div>
            </Chip>
            <Chip radius={"sm"} className={`text-lg p-6`} color={"success"}>
              <div className="flex gap-2 font-semibold">
                <span className="capitalize">{`Active Referrals:`}</span>
                <span>{`${calculatedReferralData.activeReferrals}`}</span>
              </div>
            </Chip>
            <Chip radius={"sm"} className={`text-lg p-6`} color={"danger"}>
              <div className="flex gap-2 font-semibold">
                <span className="capitalize">{`Inactive Referrals:`}</span>
                <span>{`${calculatedReferralData.inactiveReferrals}`}</span>
              </div>
            </Chip>
            <Chip radius={"sm"} className={`text-lg p-6`} color={"success"}>
              <div className="flex gap-2 font-semibold">
                <span className="capitalize">{`Total Revenue:`}</span>
                <span>{`${calculatedReferralData.totalRevenue}`}</span>
              </div>
            </Chip>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center w-full">
        <div className="flex gap-3 items-center w-full">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="capitalize"
              >{`${statusFilter}`}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              {["all", "pending", "completed"].map((item, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => setStatusFilter(item as StatusSelectionType)}
                  className="capitalize"
                >
                  {item}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Input
            placeholder="Search Users..."
            value={filterQuery}
            labelPlacement="outside"
            startContent={<SearchIcon />}
            onChange={({ target: { value } }: { target: { value: string } }) =>
              setFilterQuery(value)
            }
            className="w-80"
          />
        </div>

        <div className="flex gap-3 justify-end items-center w-full">
          <DateRangePicker
            value={
              filterDate?.start
                ? {
                    start: getCalenderDateValue(filterDate.start),
                    end: getCalenderDateValue(filterDate.end),
                  }
                : null
            }
            className="max-w-xs"
            visibleMonths={2}
            onChange={({ start, end }) => {
              setFilterDate({
                start: start.toDate("UTC"),
                end: end.toDate("UTC"),
              });
            }}
          />
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">{`Rows per page: ${rowsPerPage}`}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              {[10, 15, 20].map((item, index) => (
                <DropdownItem key={index} onClick={() => setRowsPerPage(item)}>
                  {item}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Tooltip content="Reset" color="primary">
            <Button
              onClick={() => {
                setFilterQuery("");
                setRowsPerPage(10);
                setFilterDate(null);
              }}
              className="h-full p-2"
              radius="sm"
              size="sm"
              color="default"
            >
              <CancelIcon />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* =============== Table =============== */}

      <Table color="primary">
        <TableHeader columns={referralColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={paginatedData}
          emptyContent={`No Referrals to display.`}
        >
          {(item) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>
                  {ReferralsRenderCells({ referral: item, columnKey })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={totalPages}
        onChange={setPage}
      />
    </div>
  );
};
