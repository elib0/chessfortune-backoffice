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
  DateRangePicker,
  Input,
  Tooltip,
} from "@nextui-org/react";
import React, { FC, useState, useEffect } from "react";
import { CancelIcon } from "@/components/icons/cancel-icon";
import { SearchIcon } from "@/components/icons/searchicon";
import { roomColumns } from "../columns";

import {
  convertFirestoreTimestampToDate,
  getCalenderDateValue,
} from "@/helpers";

import { RoomData } from "@/types";
import RoomRenderCells from "../cells/room/rooms-cells";
import { isWithinInterval } from "date-fns";

type StatusSelectionType = "all" | "free" | "private";

interface Props {
  data: RoomData[];
  isLoading: boolean;
}

export const GameTable: FC<Props> = ({ data, isLoading }) => {
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
    const filteredRooms = data?.filter(
      ({ players, createdBy, bet, private: isPrivate, createdAt }) => {
        const player = players?.[createdBy as "w" | "b"];

        if (!player || !player.profile) return;

        const { displayName, email } = player.profile;

        const handleFilterQuery = (query: string) =>
          query
            ?.toLowerCase()
            .trim()
            .includes(filterQuery?.toLowerCase().trim());

        const queryMatches =
          handleFilterQuery(displayName) || handleFilterQuery(email);

        const statusMatches = (() => {
          switch (statusFilter) {
            case "free":
              return bet === 0;
            case "private":
              return isPrivate;
            default:
              return true;
          }
        })();

        if (!createdAt) return queryMatches && statusMatches;

        const date = convertFirestoreTimestampToDate(createdAt as any);
        const dateMatches = filterDate
          ? isWithinInterval(date, {
              start: new Date(filterDate.start),
              end: new Date(filterDate.end),
            })
          : true;

        return queryMatches && statusMatches && dateMatches;
      }
    );

    setTableData(filteredRooms);
  }, [data, filterDate, filterQuery, statusFilter]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-40">
        <Loader size="lg" />
      </div>
    );

  if (!isLoading && !data?.length)
    return (
      <div className="text-center mt-40">
        <h4 className="text-xl font-semibold capitalize">{`No Games Available`}</h4>
        <p className="text-gray-500 mt-2">
          {`
          We couldn’t find any Games data. Please check back later or contact support
          if you think this is an error.
          `}
        </p>
      </div>
    );

  const getWaitingRooms = (): RoomData[] => {
    const waitingRooms: RoomData[] = [];
    const currentTime = new Date().getTime();

    data.forEach((room) => {
      const { game, startAt } = room;

      if (!game || !game.history || !startAt) return;

      const gameStartTime = convertFirestoreTimestampToDate(startAt as any);
      if (!gameStartTime) return;

      const timeDifference = (currentTime - gameStartTime.getTime()) / 1000;

      // Check if the game started within the last 30 minutes
      const gameStartedRecently = timeDifference <= 1800; // 30 minutes in seconds
      const noMovesMade = Object.keys(game.history).length === 0;

      // Only add rooms that started within the last 30 minutes and have no moves made
      if (gameStartedRecently && noMovesMade) {
        waitingRooms.push(room);
      }
    });

    return waitingRooms;
  };

  const totalPages = Math.ceil((tableData?.length || 1) / rowsPerPage);

  const paginatedData = Array.isArray(tableData)
    ? tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : [];

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <div className="flex gap-4 justify-between items-center w-full">
        {tableData && (
          <div className="w-full">
            <h3 className="capitalize text-xl font-semibold">{`${statusFilter} Games`}</h3>
          </div>
        )}
        <div className="flex justify-end gap-4 w-full">
          <div className="p-2 px-4 rounded-lg bg-content1">
            {`Waiting Games: ${getWaitingRooms().length}`}
          </div>
        </div>
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
              {["all", "free", "private"].map((item, index) => (
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
        <TableHeader columns={roomColumns}>
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
        <TableBody items={paginatedData} emptyContent={`No Games to display.`}>
          {(item) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>
                  {RoomRenderCells({ room: item, columnKey })}
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
