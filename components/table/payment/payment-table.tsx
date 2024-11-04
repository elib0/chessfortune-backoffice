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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Slider,
  SliderValue,
  Tooltip,
} from "@nextui-org/react";
import React, { FC, useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { PaymentRenderCells } from "../cells";
import { isWithinInterval } from "date-fns";
import { convertFirestoreTimestampToDate, httpHeaderOptions } from "@/helpers";
import { CancelIcon } from "@/components/icons/cancel-icon";
import { today, getLocalTimeZone } from "@internationalized/date";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/client";
import { LockIcon, EyeSlashIcon } from "@/components/icons/auth";
import { EyeIcon } from "@/components/icons/table/eye-icon";
import { ProfileData } from "@/types";
import { useAddActivity, useFetchUsers } from "@/hooks";
import { SearchIcon } from "@/components/icons/searchicon";
import { DollarIcon } from "@/components/icons/dollar-icon";

type ColumnType = {
  name: string;
  uid: string;
}[];

type RowKey = React.Key;

interface Props {
  columns: ColumnType;
  data: any[];
  isLoading: boolean;
  title?: string;
  showExportIcon?: boolean;
  csvData?: {
    fileName: string;
    data: any[];
  };
  table: "payment" | "withdrawal";
  showSeedRange?: boolean;
}

type StatusType = "new" | "processing" | "completed" | "expired";

type StatusSelectionType =
  | "all"
  | "new"
  | "processing"
  | "completed"
  | "expired";

interface ApprovalModalType {
  isOpen: boolean;
  isApproving: boolean;
  invoiceId: string;
  currentUser: ProfileData | null;
  isLoading: boolean;
}

const approvalModalState: ApprovalModalType = {
  isOpen: false,
  invoiceId: "",
  isApproving: false,
  currentUser: null,
  isLoading: false,
};

export const PaymentTable: FC<Props> = ({
  title,
  columns,
  data,
  isLoading,
  showExportIcon = false,
  csvData,
  table,
  showSeedRange = false,
}) => {
  const [user] = useAuthState(auth);
  const { addActivity } = useAddActivity();
  const [page, setPage] = React.useState(1);
  const [statusFilter, setStatusFilter] =
    React.useState<StatusSelectionType>("all");
  const [pin, setPin] = useState<string>("");
  const [tableData, setTableData] = useState<any[]>([]);
  const { users, loading: usersIsLoading } = useFetchUsers();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterDate, setFilterDate] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [checkApprove, setCheckApprove] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [filterSeedRange, setFilterSeedRange] = useState<any>([0, 10]);
  const [approvalModal, setapprovalModal] =
    useState<ApprovalModalType>(approvalModalState);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [seed, setSeed] = useState<{
    isOpen: boolean;
    isLoading: boolean;
    value: number;
  }>({
    isOpen: false,
    isLoading: false,
    value: 1,
  });
  const [selectedKeys, setSelectedKeys] = useState<Set<RowKey>>(new Set());

  useEffect(() => {
    const paymentWithUserData = data.map((paymentData) => {
      const matchingUser = users.find(
        (userData) => paymentData.profileId === userData.id
      );

      return {
        ...paymentData,
        user: matchingUser || {},
      };
    });

    const filteredData = paymentWithUserData.filter(
      ({ status, createdAt, seedAmount, user }) => {
        const date = convertFirestoreTimestampToDate(createdAt);

        const handleFilterQuery = (query: string) =>
          query
            ?.toLowerCase()
            .trim()
            .includes(filterQuery?.toLowerCase().trim());

        const nameMatches =
          handleFilterQuery(user?.displayName) ||
          handleFilterQuery(user?.email);

        const seedRange =
          Number(seedAmount) >= filterSeedRange[0] &&
          seedAmount <= filterSeedRange[1];

        const statusMatches = statusFilter === "all" || status === statusFilter;
        const dateMatches = filterDate
          ? isWithinInterval(date, {
              start: new Date(filterDate.start),
              end: new Date(filterDate.end),
            })
          : true;

        return showSeedRange
          ? statusMatches && nameMatches && seedRange && dateMatches
          : statusMatches && nameMatches && dateMatches;
      }
    );

    setTableData(filteredData);
  }, [
    data,
    users,
    statusFilter,
    filterSeedRange,
    filterDate,
    filterQuery,
    showSeedRange,
  ]);

  const handleSelectionChange = (keys: "all" | Set<RowKey>) =>
    setSelectedKeys(
      keys === "all" ? new Set(tableData.map((row) => row.id)) : keys
    );

  const toggleVisibility = () => setIsVisible(!isVisible);

  const closeModal = () => {
    setapprovalModal(approvalModalState);
  };

  const toggleApprovalModalIsLaoding = (value: boolean) =>
    setapprovalModal((prevValue) => {
      return {
        ...prevValue,
        isLoading: value,
      };
    });

  const checkUserPin = async () => {
    setCheckApprove(true);

    if (!approvalModal.isOpen || !approvalModal.invoiceId) return;

    toggleApprovalModalIsLaoding(true);

    try {
      if (!user) return;

      const data = await fetch(`/api/users/${user.uid}`, {
        method: "GET",
        ...httpHeaderOptions,
      });

      const { user: userData } = await data.json();

      if (!userData.pin) {
        const res = await fetch(`/api/users/pin/${user.uid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          ...httpHeaderOptions,
        });

        if (res.ok) {
          toast.success("Please check your profile for the pin");
          toggleApprovalModalIsLaoding(false);
        }
      }

      setapprovalModal((prevValue) => {
        return {
          ...prevValue,
          currentUser: userData,
        };
      });
      toggleApprovalModalIsLaoding(false);
    } catch (error) {
      closeModal();
      toast.error("Failed to update status");
    }
  };

  const changePaymentStataus = async () => {
    try {
      const { currentUser, invoiceId } = approvalModal;
      const { pin: userPin } = currentUser as ProfileData;

      if (userPin !== pin) return toast.error("Pin doesn't match");

      setapprovalModal((prevValue) => {
        return {
          ...prevValue,
          isApproving: true,
        };
      });

      await fetch(`/api/invoices/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: invoiceId,
          status: "completed",
        }),
        ...httpHeaderOptions,
      });

      toast.success(`Status updated successfully`);
      closeModal();
      location.reload();
    } catch (error) {
      toast.error(`Error updating status`);
    }
  };

  const getPaymentStatusLength = (paymentStatus: StatusType): number =>
    data.filter(({ status }) => status === paymentStatus).length || 0;

  const getPaymentStatusTotalAmount = (paymentStatus: StatusType): number =>
    Math.abs(
      data
        .filter(({ status }) => status === paymentStatus)
        .reduce((prevValue, curValue) => prevValue + curValue.amount, 0)
        .toFixed(2)
    );

  const totalPages = Math.ceil((tableData?.length || 1) / rowsPerPage);

  const paginatedData = Array.isArray(tableData)
    ? tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : [];

  const statusFilterOptions =
    table === "payment"
      ? ["all", "completed", "expired"]
      : ["all", "new", "processing", "completed", "expired"];

  const submitSeeds = async () => {
    try {
      const { value } = seed;

      if (!value) throw new Error("Please enter a seed value");

      setSeed((prevValue) => {
        return {
          ...prevValue,
          isLoading: true,
        };
      });

      await fetch(`/api/invoices/seeds`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: Array.from(selectedKeys),
          seedAmount: value,
        }),
        ...httpHeaderOptions,
      });

      addActivity({
        action: `Updated invoice seeds by user email: ${user?.email}`,
      });

      toast.success(`Seed updated successfully`);
      setSeed({
        value: 0,
        isOpen: false,
        isLoading: true,
      });
      location.reload();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return isLoading || usersIsLoading ? (
    <div className="flex justify-center items-center mt-40">
      <Loader size="lg" />
    </div>
  ) : (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <div className="flex gap-4 justify-between items-center w-full">
        {tableData && (
          <div className="w-full">
            <h3 className="capitalize text-xl font-semibold">{`${statusFilter} ${title} ( ${tableData.length} )`}</h3>
          </div>
        )}
        <div className="flex justify-end gap-4 w-full">
          {statusFilterOptions
            .filter((value) => value !== "all")
            .map((value, index) => (
              <Chip
                key={index}
                radius={"sm"}
                className={`text-lg p-6`}
                color={
                  value === "new"
                    ? "primary"
                    : value === "processing"
                    ? "warning"
                    : value === "completed"
                    ? "success"
                    : "danger"
                }
              >
                <div className="flex gap-2 font-semibold">
                  <span className="capitalize">{`${value}:`}</span>
                  <span>
                    {`$${getPaymentStatusTotalAmount(
                      value as StatusType
                    )}, ( ${getPaymentStatusLength(value as StatusType)} )`}
                  </span>
                </div>
              </Chip>
            ))}
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
              {statusFilterOptions.map((item, index) => (
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
          {showSeedRange && (
            <Slider
              label="Seed Range"
              size="sm"
              radius="md"
              step={1}
              minValue={0}
              maxValue={100}
              className="w-64"
              color="foreground"
              value={filterSeedRange}
              defaultValue={filterSeedRange}
              onChange={(value: SliderValue) => setFilterSeedRange(value)}
            />
          )}
        </div>

        <div className="flex gap-3 justify-end items-center w-full">
          {table === "payment" && Array.from(selectedKeys).length > 0 && (
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
                setFilterSeedRange([0, 10]);
              }}
              className="h-full p-2"
              radius="sm"
              size="sm"
              color="default"
            >
              <CancelIcon />
            </Button>
          </Tooltip>
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

      {/* =============== Table =============== */}

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
                <TableCell>
                  {PaymentRenderCells({
                    payment: item,
                    columnKey,
                    table,
                    handleUserActivity: (id: string, value: string) =>
                      addActivity({
                        action: `Invoice ID: ${id} status updated to "${value}" by user email: ${user?.email}`,
                      }),
                    handleOpenApproveModal: (open, id) =>
                      setapprovalModal((prevValue) => {
                        return {
                          ...prevValue,
                          isOpen: open,
                          invoiceId: id,
                        };
                      }),
                  })}
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

      {/* ========== Approve Modal ========== */}

      <Modal
        backdrop={"blur"}
        isOpen={approvalModal.isOpen}
        closeButton={<></>}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Approve Payment
            </ModalHeader>
            <ModalBody>
              {!checkApprove && !approvalModal.isLoading ? (
                <div className="bg-red-500/50 p-3 rounded-lg">
                  <p className="font-medium">
                    Are you sure you want to approve this transaction?
                  </p>
                </div>
              ) : approvalModal.isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader size="md" />
                </div>
              ) : (
                <Input
                  label="Enter your 6-digit pin"
                  variant="bordered"
                  size="lg"
                  minLength={6}
                  maxLength={6}
                  labelPlacement="outside"
                  placeholder="Enter pin"
                  startContent={<LockIcon size={"1.2em"} fill="#d0d1d0" />}
                  endContent={
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="focus:outline-none"
                      aria-label="toggle password visibility"
                    >
                      {isVisible ? (
                        <EyeSlashIcon fill="#d0d1d0" />
                      ) : (
                        <EyeIcon fill="#d0d1d0" size={16} />
                      )}
                    </button>
                  }
                  value={pin}
                  className="w-full"
                  type={isVisible ? "text" : "password"}
                  onChange={({ target: { value } }: any) => {
                    const isNumeric = /^\d*$/.test(value);
                    if (isNumeric) {
                      setPin(value);
                    }
                  }}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                isLoading={approvalModal.isApproving}
                isDisabled={!checkApprove ? false : pin.length !== 6}
                onPress={!checkApprove ? checkUserPin : changePaymentStataus}
              >
                {!checkApprove ? "Yes" : "Save"}
              </Button>
              <Button
                color="danger"
                variant="bordered"
                onPress={() => {
                  setPin("");
                  setCheckApprove(false);
                  closeModal();
                }}
              >
                {!checkApprove ? "No" : "Cancel"}
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>

      {/* ========== Approve Modal ========== */}

      <Modal
        backdrop={"blur"}
        isOpen={seed.isOpen}
        onClose={() =>
          setSeed({
            value: 0,
            isOpen: false,
            isLoading: false,
          })
        }
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">Add Seeds</ModalHeader>
            <ModalBody>
              <Input
                label={`Selected seeds: ${Array.from(selectedKeys).length}`}
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
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                isLoading={seed.isLoading}
                isDisabled={seed.isLoading}
                onPress={submitSeeds}
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
