"use client";

import { ExportIcon } from "@/components/icons/accounts/export-icon";
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
} from "@nextui-org/react";
import React, { FC, useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { isWithinInterval } from "date-fns";
import { CancelIcon } from "@/components/icons/cancel-icon";
import { SearchIcon } from "@/components/icons/searchicon";
import { roomHistoryColumns } from "../columns";

import {
  convertFirestoreTimestampToDate,
  getCalenderDateValue,
} from "@/helpers";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { RoomsHistoryRenderCells } from "../cells";
import { getGameChartData } from "@/helpers/getGameChartData";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

type RowKey = React.Key;

interface Props {
  data: any[];
  isLoading: boolean;
}

export const GameReportTable: FC<Props> = ({ data, isLoading }) => {
  const [page, setPage] = React.useState(1);
  const [tableData, setTableData] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterDate, setFilterDate] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Set<RowKey>>(new Set());

  useEffect(() => {
    const filteredData = data?.filter(({ createdAt, createdBy, players }) => {
      const date = convertFirestoreTimestampToDate(createdAt);

      const player = players?.[createdBy];
      if (!player) return;

      const { displayName, email } = player.profile;

      const handleFilterQuery = (query: string) =>
        query?.toLowerCase().trim().includes(filterQuery?.toLowerCase().trim());

      const nameMatches =
        handleFilterQuery(displayName) || handleFilterQuery(email);

      const dateMatches = filterDate
        ? isWithinInterval(date, {
            start: new Date(filterDate.start),
            end: new Date(filterDate.end),
          })
        : true;

      return nameMatches && dateMatches;
    });

    setTableData(filteredData);
  }, [data, filterDate, filterQuery]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-40">
        <Loader size="lg" />
      </div>
    );

  if (!isLoading && !data?.length)
    return (
      <div className="text-center mt-40">
        <h4 className="text-xl font-semibold capitalize">{`No Game Report Available`}</h4>
        <p className="text-gray-500 mt-2">
          {`
          We couldn’t find any Game Report data. Please check back later or contact support
          if you think this is an error.
          `}
        </p>
      </div>
    );

  const { dates, data: gamesPlayedData } = getGameChartData(tableData);

  const csvData = [
    [
      "Room Id",
      "Bet",
      "Timer",
      "Created At",
      "Created By",
      "Email Address",
      "Game Over Reason",
      "Winner",
      "Start At",
      "Finish At",
    ],
    ...tableData.map(
      ({
        roomId,
        bet,
        timer,
        createdBy,
        createdAt,
        gameOverReason,
        winner: win,
        startAt,
        finishAt,
        players,
      }) => {
        const creatorSide = createdBy as keyof typeof players;
        const winnerSide = win as keyof typeof players;
        const { displayName: creator, email } =
          players[creatorSide]?.profile || {};
        const { displayName: winner } = players[winnerSide]?.profile || {};

        const createdDate = convertFirestoreTimestampToDate(
          createdAt as any
        ).toISOString();

        const startDate = startAt
          ? convertFirestoreTimestampToDate(startAt as any)?.toISOString()
          : convertFirestoreTimestampToDate(createdAt as any).toISOString();

        const finishDate = finishAt
          ? convertFirestoreTimestampToDate(finishAt as any)?.toISOString()
          : "N/A";

        return [
          roomId,
          bet,
          timer,
          createdDate,
          creator,
          email,
          gameOverReason || "N/A",
          winner || "N/A",
          startDate,
          finishDate,
        ];
      }
    ),
  ];

  const handleSelectionChange = (keys: "all" | Set<RowKey>) =>
    setSelectedKeys(
      keys === "all" ? new Set(tableData.map((row) => row.id)) : keys
    );

  const gamesWon = tableData.filter(
    ({ createdBy, winner }) => createdBy === winner
  ).length;

  const totalPages = Math.ceil((tableData?.length || 1) / rowsPerPage);

  const paginatedData = Array.isArray(tableData)
    ? tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : [];

  const chartOptions: ApexOptions = {
    series: [
      {
        color: "#016fee",
        name: "Games Played",
        data: gamesPlayedData,
      },
    ],
    chart: {
      foreColor: "#a0a0a9",
      height: 300,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 4,
      curve: "straight",
    },
    title: {
      text: "Games Played Over Time",
      align: "left",
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: dates,
    },
    yaxis: {
      min: 0,
    },
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <div className="flex gap-4 justify-between items-center w-full">
        {tableData && (
          <div className="w-full">
            <h3 className="capitalize text-xl font-semibold">{`Game Reports`}</h3>
          </div>
        )}
        <div className="flex justify-end gap-4 w-full">
          <Chip radius={"sm"} className={`text-lg p-6`} color={"primary"}>
            <div className="flex gap-2 font-semibold">
              <span className="capitalize">{`Games Played:`}</span>
              <span>{`${tableData.length}`}</span>
            </div>
          </Chip>
          <Chip radius={"sm"} className={`text-lg p-6`} color={"success"}>
            <div className="flex gap-2 font-semibold">
              <span className="capitalize">{`Games Won:`}</span>
              <span>{`${gamesWon}`}</span>
            </div>
          </Chip>
          <Chip radius={"sm"} className={`text-lg p-6`} color={"danger"}>
            <div className="flex gap-2 font-semibold">
              <span className="capitalize">{`Games Lost:`}</span>
              <span>{`${tableData.length - gamesWon}`}</span>
            </div>
          </Chip>
        </div>
      </div>

      <div className="p-6 rounded-xl shadow bg-content1 w-full">
        <ApexCharts
          options={chartOptions}
          series={chartOptions.series}
          type="line"
          height={300}
        />
      </div>

      <div className="flex justify-between items-center w-full">
        <div className="flex gap-3 items-center w-full">
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
          <Button color="primary" startContent={<ExportIcon />}>
            <CSVLink
              className="downloadbtn"
              filename={"game-reports.csv"}
              data={csvData}
            >
              Export to CSV
            </CSVLink>
          </Button>
        </div>
      </div>

      {/* =============== Table =============== */}

      <Table
        selectionMode="multiple"
        color="primary"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        <TableHeader columns={roomHistoryColumns}>
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
          emptyContent={`No Financial Reports to display.`}
        >
          {(item) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>
                  {RoomsHistoryRenderCells({ room: item, columnKey })}
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
