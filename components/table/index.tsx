"use client";

import {
  Button,
  DateRangePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import React, { FC, Key, ReactNode, useEffect, useState } from "react";
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
  RoleRenderCells,
  RoomsHistoryRenderCells,
  RoomsRenderCells,
  RoomsReportsRenderCells,
  UsersRenderCells,
} from "./cells";
import { ExportIcon } from "../icons/accounts/export-icon";
import { CSVLink } from "react-csv";
import { isWithinInterval } from "date-fns";
import {
  convertFirestoreTimestampToDate,
  getCalenderDateValue,
} from "@/helpers";
import { CancelIcon } from "../icons/cancel-icon";
import StaffRenderCells from "./cells/staff/staff-render-cells";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/client";
import { useAddActivity } from "@/hooks";
import { DollarIcon } from "../icons/dollar-icon";

type RowKey = React.Key;

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
  | "game-reports"
  | "staffs"
  | "roles"
  | "role-management";

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
  showPagination?: boolean;
  searchInput?: ReactNode;
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
  showPagination = true,
  searchInput,
}) => {
  const [user] = useAuthState(auth);
  const { addActivity } = useAddActivity();
  const [page, setPage] = React.useState(1);
  const [tableData, setTableData] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterDate, setFilterDate] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [seed, setSeed] = useState<{
    isOpen: boolean;
    isLoading: boolean;
    value: number;
    description: string;
  }>({
    isOpen: false,
    isLoading: false,
    value: 1,
    description: "",
  });
  const [selectedKeys, setSelectedKeys] = useState<Set<RowKey>>(new Set());

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    if (!showDateFilter) return;

    const filteredData = data?.filter(({ createdAt }) => {
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-40">
        <Loader size="lg" />
      </div>
    );

  if (!isLoading && !data?.length)
    return (
      <div className="text-center mt-40 w-full">
        <h4 className="text-xl font-semibold capitalize">{`No ${title} Available`}</h4>
        <p className="text-gray-500 mt-2">
          {`
          We couldn’t find any ${title} data. Please check back later or contact support
          if you think this is an error.
          `}
        </p>
      </div>
    );

  const totalPages = Math.ceil((tableData?.length || 1) / rowsPerPage);

  const handleSelectionChange = (keys: "all" | Set<RowKey>) =>
    setSelectedKeys(
      keys === "all" ? new Set(tableData.map((row) => row.id)) : keys
    );

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

      case "staffs":
      case "role-management":
        return StaffRenderCells({ role: item, columnKey });

      case "roles":
        return RoleRenderCells({ role: item, columnKey });

      default:
        return RenderCell({ user: item, columnKey });
    }
  };

  const createNewInvoices = async () => {
    try {
      const { value, description } = seed;
      if (!value) throw new Error("Please enter a seed value");
      if (!description) throw new Error("Please enter description");

      const selectedUsersLength = Array.from(selectedKeys).length === 1;

      setSeed((prevValue) => {
        return {
          ...prevValue,
          isLoading: true,
        };
      });

      await axios.post(`/api/users/invoices`, {
        ids: Array.from(selectedKeys),
        seedAmount: value,
        description,
      });

      addActivity({
        action: `Created ${
          selectedUsersLength ? "Invoice" : "Invoices"
        } of User ${selectedUsersLength ? "Id" : "Ids"}: ${
          selectedUsersLength
            ? `${[...Array.from(selectedKeys)]}`
            : `[${[...Array.from(selectedKeys)]}]`
        } with seed amount ${value}`,
      });

      toast.success(`Invoice created successfully`);
      setSeed({
        value: 0,
        isOpen: false,
        isLoading: true,
        description: "",
      });
      location.reload();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <div className="flex justify-between items-center w-full">
        {tableData && (
          <div className="flex justify-between items-center gap-4">
            <h3
              className={`capitalize text-xl font-semibold ${
                title === "Reported Rooms Reports" && "text-danger"
              }`}
            >{`${title} ( ${tableData.length} )`}</h3>
            {searchInput}
          </div>
        )}
        <div className="flex gap-4 justify-center items-center">
          {showDateFilter && (
            <div className="flex items-center gap-2">
              {cell === "user" && Array.from(selectedKeys).length > 0 && (
                <Button
                  isIconOnly
                  onPress={() =>
                    setSeed((prevValue) => {
                      return {
                        ...prevValue,
                        isOpen: true,
                      };
                    })
                  }
                >
                  <DollarIcon />
                </Button>
              )}
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
          {showPagination && (
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">{`Rows per page: ${rowsPerPage}`}</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                {[10, 15, 20].map((item, index) => (
                  <DropdownItem
                    key={index}
                    onClick={() => setRowsPerPage(item)}
                  >
                    {item}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
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
      <Table
        selectionMode="multiple"
        color="primary"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
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

      {showPagination && (
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPages}
          onChange={setPage}
        />
      )}

      {/* ========== Invoice Modal ========== */}

      <Modal
        backdrop={"blur"}
        isOpen={seed.isOpen}
        onClose={() =>
          setSeed({
            value: 0,
            isOpen: false,
            isLoading: false,
            description: "",
          })
        }
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Add Seeds</ModalHeader>
            <ModalBody>
              <Input
                label={`Selected Users: ${Array.from(selectedKeys).length}`}
                variant="bordered"
                size="lg"
                labelPlacement="outside"
                placeholder="Enter your seeds..."
                value={`${seed.value}`}
                className="w-full"
                type={"text"}
                onChange={({ target: { value } }: any) =>
                  setSeed((prevValue) => {
                    return {
                      ...prevValue,
                      value,
                    };
                  })
                }
              />
              <Textarea
                variant="bordered"
                className="w-full"
                label="Description"
                labelPlacement="outside"
                placeholder="Enter your description"
                disableAutosize
                classNames={{
                  base: "w-full",
                  input: "resize-y min-h-40",
                }}
                onChange={({ target: { value } }: any) =>
                  setSeed((prevValue) => {
                    return {
                      ...prevValue,
                      description: value,
                    };
                  })
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                isLoading={seed.isLoading}
                isDisabled={seed.isLoading}
                onPress={createNewInvoices}
              >
                {"Save"}
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
};
