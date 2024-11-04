"use client";

import {
  Button,
  DateRangePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { FC, Key, useEffect, useState } from "react";
import { RenderCell } from "./render-cell";
import { Loader } from "../shared";
import IdentityVerificationRenderCells from "./cells/user/identity-verification-cells";
import InvoiceRenderCells from "./cells/invoice/invoice-cells";
import {
  ActivityHistoryRenderCells,
  ActivityTimelineRenderCells,
  FinancialReportsRenderCells,
  GameReportRenderCells,
  GameSettingsRenderCells,
  LiveRoomRenderCells,
  RoomsHistoryRenderCells,
  RoomsRenderCells,
  RoomsReportsRenderCells,
  UsersRenderCells,
} from "./cells";
import { ExportIcon } from "../icons/accounts/export-icon";
import { CSVLink } from "react-csv";
import { isWithinInterval } from "date-fns";
import { today, getLocalTimeZone } from "@internationalized/date";
import { convertFirestoreTimestampToDate } from "@/helpers";
import { CancelIcon } from "../icons/cancel-icon";

type ColumnType = {
  name: string;
  uid: string;
}[];

type RenderCellType =
  | "user"
  | "user-identity-verification"
  | "access-control"
  | "user-activity-history"
  | "user-activity-history-timeline"
  | "invoices"
  | "rooms"
  | "rooms-reports"
  | "rooms-history"
  | "live-rooms"
  | "game-settings"
  | "reports"
  | "game-reports";

interface Props {
  columns: ColumnType;
  data: any[];
  cell: RenderCellType;
  isLoading: boolean;
  title?: string;
  showExportIcon?: boolean;
  csvData?: {
    fileName: string;
    data: any[];
  };
  showDateFilter?: boolean;
}

export const TableWrapper: FC<Props> = ({
  title,
  columns,
  data,
  cell,
  isLoading,
  showExportIcon = false,
  csvData,
  showDateFilter,
}) => {
  const [page, setPage] = React.useState(1);
  const [tableData, setTableData] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterDate, setFilterDate] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    if (!showDateFilter) return;

    const filteredData = data.filter(({ createdAt }) => {
      if (!createdAt) return;

      const date = convertFirestoreTimestampToDate(createdAt);
      const dateMatches = filterDate
        ? isWithinInterval(date, {
            start: new Date(filterDate.start),
            end: new Date(filterDate.end),
          })
        : true;

      return dateMatches;
    });

    setTableData(filteredData);
  }, [data, filterDate, showDateFilter]);

  const totalPages = Math.ceil((tableData?.length || 1) / rowsPerPage);

  const paginatedData = Array.isArray(tableData)
    ? tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : [];

  const getRenderCell = (item: any, columnKey: Key) => {
    switch (cell) {
      case "user":
        return UsersRenderCells({ user: item, columnKey });

      case "user-identity-verification":
        return IdentityVerificationRenderCells({ user: item, columnKey });

      case "user-activity-history-timeline":
        return ActivityTimelineRenderCells({ activity: item, columnKey });

      case "user-activity-history":
        return ActivityHistoryRenderCells({ user: item, columnKey });

      case "invoices":
        return InvoiceRenderCells({ invoice: item, columnKey });

      case "rooms":
        return RoomsRenderCells({ room: item, columnKey });

      case "rooms-reports":
        return RoomsReportsRenderCells({ rooms: item, columnKey });

      case "rooms-history":
        return RoomsHistoryRenderCells({ room: item, columnKey });

      case "live-rooms":
        return LiveRoomRenderCells({ room: item, columnKey });

      case "game-settings":
        return GameSettingsRenderCells({ game: item, columnKey });

      case "reports":
        return FinancialReportsRenderCells({ report: item, columnKey });

      case "game-reports":
        return GameReportRenderCells({ report: item, columnKey });

      default:
        return RenderCell({ user: item, columnKey });
    }
  };

  return isLoading ? (
    <div className="flex justify-center items-center mt-40">
      <Loader size="lg" />
    </div>
  ) : (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <div className="flex justify-between items-center w-full">
        {tableData && (
          <h3 className="capitalize text-xl font-semibold">{`${title} ( ${tableData.length} )`}</h3>
        )}
        <div className="flex gap-4 justify-center items-center">
          {showDateFilter && (
            <div className="flex items-center gap-2">
              <DateRangePicker
                value={
                  filterDate?.start
                    ? {
                        start: today(getLocalTimeZone()),
                        end: today(getLocalTimeZone()),
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
              <Button
                onClick={() => setFilterDate(null)}
                className="h-full p-2"
                radius="sm"
                size="sm"
                color="default"
              >
                <CancelIcon />
              </Button>
            </div>
          )}
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
          {showExportIcon && csvData && (
            <Button color="primary" startContent={<ExportIcon />}>
              <CSVLink
                className="downloadbtn"
                filename={csvData.fileName}
                data={csvData.data}
              >
                Export to CSV
              </CSVLink>
            </Button>
          )}
        </div>
      </div>
      <Table>
        <TableHeader columns={columns}>
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
          emptyContent={`No ${title} to display.`}
        >
          {(item) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>{getRenderCell(item, columnKey)}</TableCell>
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
