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
  Divider,
} from "@nextui-org/react";
import React, { FC, useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { FinancialReportsRenderCells } from "../cells";
import { isWithinInterval } from "date-fns";
import { CancelIcon } from "@/components/icons/cancel-icon";
import { SearchIcon } from "@/components/icons/searchicon";
import { reportsColumns } from "../columns";

import {
  convertFirestoreTimestampToDate,
  getCalenderDateValue,
} from "@/helpers";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { useFetchRooms } from "@/hooks";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

type RowKey = React.Key;

type ReportType = "income" | "expense";

interface Props {
  data: any[];
  isLoading: boolean;
}

type StatusSelectionType = "all" | "income" | "expense";

export const FinancialReportTable: FC<Props> = ({ data, isLoading }) => {
  const [page, setPage] = React.useState(1);
  const [typeFilter, setTypeFilter] =
    React.useState<StatusSelectionType>("all");
  const [tableData, setTableData] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterDate, setFilterDate] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Set<RowKey>>(new Set());
  const { rooms, loading: roomsIsLoading } = useFetchRooms();

  useEffect(() => {
    const filteredData = data?.filter(({ type, createdAt, name, email }) => {
      const date = convertFirestoreTimestampToDate(createdAt);

      const handleFilterQuery = (query: string) =>
        query?.toLowerCase().trim().includes(filterQuery?.toLowerCase().trim());

      const nameMatches = handleFilterQuery(name) || handleFilterQuery(email);
      const typeMatches = typeFilter === "all" || type === typeFilter;

      const dateMatches = filterDate
        ? isWithinInterval(date, {
            start: new Date(filterDate.start),
            end: new Date(filterDate.end),
          })
        : true;

      return typeMatches && nameMatches && dateMatches;
    });

    setTableData(filteredData);
  }, [data, typeFilter, filterDate, filterQuery]);

  if (isLoading || roomsIsLoading)
    return (
      <div className="flex justify-center items-center mt-40">
        <Loader size="lg" />
      </div>
    );

  if (!isLoading && !data?.length)
    return (
      <div className="text-center mt-40">
        <h4 className="text-xl font-semibold capitalize">{`No Financial Report Available`}</h4>
        <p className="text-gray-500 mt-2">
          {`
          We couldn’t find any Financial Report data. Please check back later or contact support
          if you think this is an error.
          `}
        </p>
      </div>
    );

  const roomIncomes = rooms?.filter((room) => {
    if (!room.gameOverReason) return true;

    const reason = room.gameOverReason;
    return reason !== "timeOut" && reason !== "timeOutDisconnection";
  });

  const csvData = [
    [
      "Report Id",
      "Name",
      "Email",
      "Amount",
      "Type",
      "Category",
      "Description",
      "Created At",
    ],
    ...tableData.map(
      ({ id, name, email, amount, type, category, description, createdAt }) => {
        const date = convertFirestoreTimestampToDate(
          createdAt as any
        ).toISOString();

        return [id, name, email, amount, type, category, description, date];
      }
    ),
  ];

  const handleSelectionChange = (keys: "all" | Set<RowKey>) =>
    setSelectedKeys(
      keys === "all" ? new Set(tableData.map((row) => row.id)) : keys
    );

  const getReportTypeLength = (reportType: ReportType): number =>
    tableData.filter(({ type }) => type === reportType).length || 0;

  const getReportTypeTotalAmount = (
    reportType: ReportType,
    isGame: boolean
  ): number =>
    Math.abs(
      tableData
        .filter(({ type }) => type === reportType)
        .reduce(
          (prevValue, curValue) => prevValue + Number(curValue.amount),
          isGame && reportType === "income" ? roomIncomes.length : 0
        )
        .toFixed(2)
    );

  //  :

  const totalPages = Math.ceil((tableData?.length || 1) / rowsPerPage);

  const paginatedData = Array.isArray(tableData)
    ? tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : [];

  const reportFilterOptions = ["all", "income", "expense"];
  const showProfiltLoss =
    typeFilter === "all" &&
    getReportTypeLength("income" as ReportType) > 0 &&
    getReportTypeLength("expense" as ReportType) > 0;

  const getAmount = (type: ReportType) =>
    tableData?.length > 0 ? tableData.filter(({ type: t }) => t === type) : [];

  const dates = tableData.map(({ createdAt }) =>
    convertFirestoreTimestampToDate(createdAt as any).toLocaleDateString()
  );

  const chartOptions: ApexOptions = {
    series: [
      {
        color: "#60ca65",
        name: "Income",
        data: [0, ...getAmount("income").map(({ amount }) => amount)],
      },
      {
        color: "#f04a61",
        name: "Expense",
        data: [0, ...getAmount("expense").map(({ amount }) => amount)],
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
      text: "Incomes and Expenses Over Time",
      align: "left",
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: dates,
    },
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <div className="flex items-center justify-end gap-4 w-full">
        <Chip radius={"sm"} className={`text-lg p-6`} color={"success"}>
          <div className="flex gap-2 font-semibold">
            <span className="capitalize">{`Game:`}</span>
            <span>{`$${roomIncomes.length}`}</span>
          </div>
        </Chip>
        <div>
          <Chip radius={"sm"} className={`text-lg p-6`} color={"success"}>
            <div className="flex gap-2 font-semibold">
              <span className="capitalize">{`External:`}</span>
              <span>{`$${getReportTypeTotalAmount(
                "income",
                false
              )}, ( ${getReportTypeLength("income")} )`}</span>
            </div>
          </Chip>
        </div>
      </div>
      <div className="flex gap-4 justify-between items-center w-full">
        {tableData && (
          <div className="w-full">
            <h3 className="capitalize text-xl font-semibold">{`${typeFilter} Financial Reports ( ${tableData.length} )`}</h3>
          </div>
        )}
        <div className="flex justify-end gap-4 w-full">
          {reportFilterOptions
            .filter((value) => value !== "all")
            .map((value, index) => (
              <Chip
                key={index}
                radius={"sm"}
                className={`text-lg p-6`}
                color={value === "income" ? "success" : "danger"}
              >
                <div className="flex gap-2 font-semibold">
                  <span className="capitalize">{`${value}:`}</span>
                  <span>
                    {`$${getReportTypeTotalAmount(
                      value as ReportType,
                      value === "income"
                    )}, ( ${
                      value === "income"
                        ? getReportTypeLength(value as ReportType) +
                          roomIncomes.length
                        : getReportTypeLength(value as ReportType)
                    } )`}
                  </span>
                </div>
              </Chip>
            ))}
          {showProfiltLoss && (
            <Divider orientation="vertical" className="w-1 h-12 rounded-2xl" />
          )}
          {showProfiltLoss &&
            reportFilterOptions
              .filter((value) => value !== "all")
              .map((value, index) => {
                const incomeTotal = getReportTypeTotalAmount(
                  "income" as ReportType,
                  true
                );
                const expenseTotal = getReportTypeTotalAmount(
                  "expense" as ReportType,
                  false
                );

                const isProfit = incomeTotal > expenseTotal;
                const profitOrLossAmount = Math.abs(incomeTotal - expenseTotal);

                return (
                  <Chip
                    key={index}
                    radius={"sm"}
                    className="text-lg p-6"
                    color={value === "income" ? "success" : "danger"}
                  >
                    <div className="flex gap-2 font-semibold">
                      <span className="capitalize">
                        {value === "income" ? "Profit:" : "Loss:"}
                      </span>
                      <span>{`$${
                        isProfit && value === "income"
                          ? profitOrLossAmount
                          : !isProfit && value === "expense"
                          ? profitOrLossAmount
                          : 0
                      }`}</span>
                    </div>
                  </Chip>
                );
              })}
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
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="capitalize"
              >{`${typeFilter}`}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              {reportFilterOptions.map((item, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => setTypeFilter(item as StatusSelectionType)}
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
          <Button color="primary" startContent={<ExportIcon />}>
            <CSVLink
              className="downloadbtn"
              filename={"financial-reports.csv"}
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
        <TableHeader columns={reportsColumns}>
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
                  {FinancialReportsRenderCells({ report: item, columnKey })}
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
